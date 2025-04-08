
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Récupérer les clés depuis les variables d'environnement
const API_KEY = Deno.env.get("KONNECT_API_KEY");
const WALLET_ID = Deno.env.get("KONNECT_WALLET_ID");

// CORS headers pour permettre l'accès depuis n'importe quelle origine
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting - Map stockant les IP et leurs tentatives
const ipLimitCache = new Map();
const MAX_REQUESTS = 20; // Maximum de requêtes
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

// Fonction pour valider les données de la requête
function validatePaymentData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data) {
    errors.push("Données manquantes");
    return { valid: false, errors };
  }
  
  // Vérifier les champs obligatoires
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    errors.push("Montant invalide ou manquant");
  }
  
  if (!data.orderId || typeof data.orderId !== 'string' || data.orderId.length < 3) {
    errors.push("ID de commande invalide ou manquant");
  } else if (!/^[a-zA-Z0-9-]+$/.test(data.orderId)) {
    errors.push("Format d'ID de commande invalide (caractères alphanumériques uniquement)");
  }
  
  // Vérification des champs optionnels mais avec validation si présents
  if (data.email && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Format d'email invalide");
    }
  }
  
  if (data.phoneNumber && typeof data.phoneNumber === 'string') {
    if (!/^\d{8,}$/.test(data.phoneNumber.replace(/[+\s-]/g, ''))) {
      errors.push("Format de numéro de téléphone invalide");
    }
  }
  
  // Vérifier les limites de montant (pour éviter les transactions très élevées par erreur)
  if (data.amount > 10000000) { // 10,000 TND (en millimes)
    errors.push("Montant supérieur à la limite autorisée");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Fonction servant à initialiser un paiement via l'API Konnect
serve(async (req) => {
  // Récupérer l'adresse IP
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(/\s*,\s*/)[0] : "0.0.0.0";
  
  // Log la requête pour l'audit
  console.log(`Requête de paiement reçue de ${ip} à ${new Date().toISOString()}`);
  
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
    if (!API_KEY || !WALLET_ID) {
      console.error("Configuration serveur incomplète - Clés API manquantes");
      return new Response(
        JSON.stringify({ error: "Configuration serveur incomplète" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Récupérer les données du corps de la requête
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error(`Corps JSON invalide depuis ${ip}`);
      return new Response(
        JSON.stringify({ error: "Corps JSON invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Valider les données de paiement
    const validation = validatePaymentData(requestData);
    if (!validation.valid) {
      console.error(`Données de paiement invalides depuis ${ip}:`, validation.errors);
      return new Response(
        JSON.stringify({ error: "Données de paiement invalides", details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { amount, description, firstName, lastName, email, phoneNumber, orderId } = requestData;

    console.log(`Initialisation de paiement pour ${orderId}: ${amount} millimes, IP: ${ip}`);

    // Déterminer le domaine de base pour les redirections et webhooks
    const baseDomain = "https://effaassdrpabvpgoulrq.functions.supabase.co";
    const webhookUrl = `${baseDomain}/payment-webhook`;

    // Préparer le corps de la requête pour Konnect
    const konnectRequestBody = {
      receiverWalletId: WALLET_ID,
      token: "TND",
      amount: amount, // Montant en millimes
      type: "immediate",
      description: description || `Paiement facture #${orderId}`,
      acceptedPaymentMethods: ["bank_card", "wallet", "e-DINAR"],
      lifespan: 10,
      checkoutForm: true,
      addPaymentFeesToAmount: true,
      firstName: firstName || "",
      lastName: lastName || "",
      phoneNumber: phoneNumber || "",
      email: email || "",
      orderId: orderId,
      webhook: webhookUrl, // Notre URL de webhook
      silentWebhook: true,
      successUrl: "https://softfacture.tn/paiement-reussi", // URL de succès
      failUrl: "https://softfacture.tn/paiement-echoue", // URL d'échec
      theme: "light"
    };

    console.log(`Appel API Konnect pour ${orderId} depuis ${ip}`);
    
    // URL de l'API Konnect
    const apiUrl = "https://api.konnect.network/api/v2/payments/init-payment";

    // Ajouter un timeout pour éviter les requêtes qui bloquent
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
    
    try {
      // Appel à l'API Konnect
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(konnectRequestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Réponse API Konnect status: ${response.status} pour ${orderId}`);

      // En cas d'erreur HTTP
      if (!response.ok) {
        // Cloner la réponse pour éviter le problème "Body already consumed"
        const clonedResponse = response.clone();
        
        let errorDetails;
        try {
          errorDetails = await clonedResponse.json();
          console.error(`Erreur API Konnect (JSON) pour ${orderId}:`, errorDetails);
        } catch (e) {
          const text = await response.text();
          console.error(`Erreur API Konnect (texte brut) pour ${orderId}:`, text);
          return new Response(
            JSON.stringify({ error: "Erreur lors de l'initialisation du paiement", raw: text }),
            { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ error: "Erreur lors de l'initialisation du paiement", details: errorDetails }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Parser la réponse JSON
      try {
        const responseData = await response.json();
        console.log(`Paiement initialisé avec succès pour ${orderId}, ref: ${responseData.paymentRef || 'N/A'}`);
        
        // Retourner la réponse de l'API
        return new Response(
          JSON.stringify(responseData),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (e) {
        console.error(`Erreur parsing JSON réponse pour ${orderId}:`, e);
        const text = await response.text();
        return new Response(
          JSON.stringify({ error: "Réponse non JSON", raw: text }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error(`Timeout de l'API Konnect pour ${orderId}`);
        return new Response(
          JSON.stringify({ error: "Timeout de l'API de paiement" }),
          { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }
  } catch (error) {
    // Gérer les erreurs générales
    console.error(`Erreur générale pour l'initialisation du paiement depuis ${ip}:`, error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
