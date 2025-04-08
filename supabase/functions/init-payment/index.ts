
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Récupérer les clés depuis les variables d'environnement
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const KONNECT_API_KEY = Deno.env.get("KONNECT_API_KEY") || "";
const KONNECT_WALLET_ID = Deno.env.get("KONNECT_WALLET_ID") || "";

// Initialiser le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// CORS headers pour permettre l'accès depuis n'importe quelle origine
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting - Map stockant les IP et leurs tentatives
const ipLimitCache = new Map();
const MAX_REQUESTS = 10; // Maximum de requêtes
const WINDOW_MS = 60000; // Fenêtre de 1 minute (en ms)

// Fonction pour vérifier le rate limiting
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  
  // Nettoyer les anciennes entrées
  for (const [key, entry] of ipLimitCache.entries()) {
    if (now - entry.timestamp > WINDOW_MS) {
      ipLimitCache.delete(key);
    }
  }
  
  // Vérifier si l'IP existe déjà
  if (!ipLimitCache.has(ip)) {
    ipLimitCache.set(ip, {
      count: 1,
      timestamp: now
    });
    return true;
  }
  
  // Vérifier le nombre de requêtes
  const entry = ipLimitCache.get(ip);
  if (entry.count >= MAX_REQUESTS) {
    return false;
  }
  
  // Incrémenter le compteur
  entry.count += 1;
  return true;
}

// Fonction pour valider les paramètres d'entrée
function validateInput(data: any): { valid: boolean; error?: string } {
  if (!data) {
    return { valid: false, error: "Données manquantes" };
  }
  
  // Valider le montant
  if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
    return { valid: false, error: "Montant invalide" };
  }
  
  // Valider la description
  if (!data.description || typeof data.description !== "string") {
    return { valid: false, error: "Description manquante" };
  }
  
  // Valider l'orderId si présent
  if (data.orderId && (typeof data.orderId !== "string" || !/^[a-zA-Z0-9-]+$/.test(data.orderId))) {
    return { valid: false, error: "Format d'ID de commande invalide" };
  }
  
  // Valider l'email si présent
  if (data.email && (typeof data.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
    return { valid: false, error: "Format d'email invalide" };
  }
  
  // Limiter le montant maximum pour la sécurité
  if (data.amount > 10000000) { // 10,000 TND
    return { valid: false, error: "Montant supérieur à la limite autorisée" };
  }
  
  return { valid: true };
}

// Fonction servant à initialiser un paiement Konnect
serve(async (req) => {
  // Récupérer l'adresse IP
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(/\s*,\s*/)[0] : "0.0.0.0";
  
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier la méthode HTTP
    if (req.method !== "POST") {
      console.warn(`Méthode non autorisée: ${req.method} depuis ${ip}`);
      return new Response(
        JSON.stringify({ error: "Méthode non autorisée" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier le rate limiting
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit dépassé pour l'IP: ${ip}`);
      return new Response(
        JSON.stringify({ error: "Trop de requêtes, veuillez réessayer plus tard" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier que les clés API sont disponibles
    if (!KONNECT_API_KEY || !KONNECT_WALLET_ID) {
      console.error("Configuration serveur incomplète - Clés API manquantes");
      return new Response(
        JSON.stringify({ error: "Configuration serveur incomplète" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Récupérer la session utilisateur pour permettre la journalisation
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          userId = user.id;
        }
      } catch (error) {
        console.warn('Erreur lors de la vérification du token:', error);
        // On continue sans userId
      }
    }

    // Récupérer les données de la requête
    const requestData = await req.json();
    
    // Valider les données d'entrée
    const validation = validateInput(requestData);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Générer un identifiant unique pour le paiement (si non fourni)
    const paymentRef = requestData.orderId || `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const plan = requestData.plan || null;

    // Préparer les données pour l'API Konnect
    const konnectData = {
      receiver: KONNECT_WALLET_ID,
      amount: requestData.amount, 
      accept_free_amount: false,
      payment_link_mode: false,
      first_name: requestData.firstName || "",
      last_name: requestData.lastName || "",
      email: requestData.email || "",
      phone: "",
      order_id: paymentRef,
      success_link: `${req.headers.get('origin')}/paiement-reussi?ref=${paymentRef}${plan ? `&plan=${plan}` : ''}`,
      fail_link: `${req.headers.get('origin')}/paiement-echoue?ref=${paymentRef}${plan ? `&plan=${plan}` : ''}`,
      webHook: `${SUPABASE_URL}/functions/v1/payment-webhook`,
      payment_method: ["bank_card", "e-DINAR", "flouci"],
      subscription: false,
      description: requestData.description,
      image: `${req.headers.get('origin')}/favicon.ico`
    };

    // Appeler l'API Konnect pour créer un paiement
    const response = await fetch('https://api.konnect.network/api/v2/payments/init-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KONNECT_API_KEY
      },
      body: JSON.stringify(konnectData)
    });

    // Traiter la réponse de Konnect
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Konnect:', response.status, errorText);
      
      let errorMessage = "Erreur lors de l'initialisation du paiement";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // Utiliser le message par défaut
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const konnectResponse = await response.json();
    
    // Log pour l'audit
    console.log(`Paiement initialisé: ${JSON.stringify({
      timestamp: new Date().toISOString(),
      ip,
      userId,
      paymentRef,
      amount: requestData.amount,
      plan
    })}`);

    // Retourner l'URL de paiement au client
    return new Response(
      JSON.stringify({ 
        payUrl: konnectResponse.payUrl,
        paymentRef
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    // Gérer les erreurs générales
    console.error(`Erreur lors de l'initialisation du paiement depuis ${ip}:`, error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
