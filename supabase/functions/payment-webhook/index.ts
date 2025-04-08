
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Récupérer les clés depuis les variables d'environnement
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const KONNECT_API_KEY = Deno.env.get("KONNECT_API_KEY") || "";
const KONNECT_WEBHOOK_SECRET = Deno.env.get("KONNECT_WEBHOOK_SECRET") || "";

// Initialiser le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// CORS headers pour permettre l'accès depuis n'importe quelle origine
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-konnect-signature',
};

// Rate limiting - Map stockant les IP et leurs tentatives
const ipLimitCache = new Map();
const MAX_REQUESTS = 50; // Maximum de requêtes
const WINDOW_MS = 60000; // Fenêtre de 1 minute (en ms)

// Fonction pour vérifier la signature du webhook Konnect
async function verifySignature(signature: string, body: string): Promise<boolean> {
  if (!KONNECT_WEBHOOK_SECRET || !signature) return false;
  
  try {
    // Convertir la chaîne de corps en octets
    const bodyText = JSON.stringify(body);
    const bodyBytes = new TextEncoder().encode(bodyText);
    
    // Convertir la clé secrète en octets
    const keyBytes = new TextEncoder().encode(KONNECT_WEBHOOK_SECRET);
    
    // Créer une clé HMAC
    const key = await crypto.subtle.importKey(
      "raw", 
      keyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false, 
      ["verify"]
    );
    
    // Convertir la signature hex en tableau d'octets
    const signatureBytes = hexToBytes(signature);
    
    // Vérifier la signature
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      bodyBytes
    );
  } catch (error) {
    console.error("Erreur lors de la vérification de la signature:", error);
    return false;
  }
}

// Fonction helper pour convertir un hex en bytes
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// Fonction pour valider les données du webhook
function validateWebhookData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (!data.payment || typeof data.payment !== 'object') return false;
  
  const { payment } = data;
  
  // Vérifier les champs requis
  if (!payment.reference || typeof payment.reference !== 'string') return false;
  if (!payment.status || typeof payment.status !== 'string') return false;
  
  // Vérifier le format de référence (alphanumeric)
  if (!/^[a-zA-Z0-9-]+$/.test(payment.reference)) return false;
  
  // Vérifier les statuts valides
  const validStatuses = ['completed', 'failed', 'expired', 'canceled', 'pending'];
  if (!validStatuses.includes(payment.status)) return false;
  
  return true;
}

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

// Fonction servant à recevoir et traiter les webhooks de Konnect
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
    if (!KONNECT_API_KEY) {
      console.error("Configuration serveur incomplète - Clé API manquante");
      return new Response(
        JSON.stringify({ error: "Configuration serveur incomplète" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Lire la signature de la requête
    const signature = req.headers.get("x-konnect-signature");
    
    // Récupérer le corps de la requête en tant que texte brut
    const requestBody = await req.text();
    let webhookData;
    
    try {
      // Parser le corps JSON
      webhookData = JSON.parse(requestBody);
    } catch (e) {
      console.error(`Corps JSON invalide depuis ${ip}:`, requestBody);
      return new Response(
        JSON.stringify({ error: "Corps JSON invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log complet pour l'audit
    console.log(`Webhook reçu de ${ip}: ${JSON.stringify({
      timestamp: new Date().toISOString(),
      ip,
      headers: Object.fromEntries(req.headers.entries()),
      body: webhookData
    })}`);

    // Valider les données du webhook
    if (!validateWebhookData(webhookData)) {
      console.error(`Données de webhook invalides depuis ${ip}:`, webhookData);
      return new Response(
        JSON.stringify({ error: "Données de webhook invalides" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier la signature si elle est fournie
    if (signature && KONNECT_WEBHOOK_SECRET) {
      const isValid = await verifySignature(signature, requestBody);
      if (!isValid) {
        console.error(`Signature de webhook invalide depuis ${ip}`);
        return new Response(
          JSON.stringify({ error: "Signature de webhook invalide" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (KONNECT_WEBHOOK_SECRET) {
      // Si le secret est configuré mais que la signature n'est pas fournie
      console.warn(`Webhook sans signature reçu depuis ${ip}`);
    }

    const { payment } = webhookData;
    const { reference, status, orderId } = payment;

    console.log(`Webhook validé pour paiement ${reference}, statut: ${status}, orderId: ${orderId}, IP: ${ip}`);

    // Mettre à jour le statut de la facture dans la base de données
    if (orderId) {
      let newStatus;
      if (status === "completed") {
        newStatus = "payee"; // Paiement réussi
      } else if (status === "failed" || status === "expired" || status === "canceled") {
        newStatus = "envoyee"; // Paiement échoué, garder la facture en statut envoyée
      } else {
        // Autre statut, on ne change pas le statut de la facture
        newStatus = null;
      }

      // Si nous avons un nouveau statut, mettre à jour la facture
      if (newStatus) {
        // Valider l'ID de facture avant la requête
        if (!/^[a-zA-Z0-9-]+$/.test(orderId)) {
          console.error(`Format d'ID de facture invalide: ${orderId}`);
          return new Response(
            JSON.stringify({ error: "Format d'ID de facture invalide" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { data, error } = await supabase
          .from('factures')
          .update({ statut: newStatus })
          .eq('numero', orderId)
          .select();

        if (error) {
          console.error(`Erreur lors de la mise à jour de la facture ${orderId}:`, error);
        } else {
          console.log(`Facture ${orderId} mise à jour avec statut ${newStatus}`);
        }
      }
    }

    // Journal de paiement pour l'audit
    const { data, error } = await supabase
      .from('journal_paiements')
      .insert({
        reference_paiement: reference,
        statut: status,
        facture_id: orderId,
        details: webhookData,
        ip_address: ip
      });

    if (error && error.code !== "23505") { // Ignorer les erreurs de violation de contrainte d'unicité
      console.error("Erreur lors de l'enregistrement du journal de paiement:", error);
    }

    // Répondre avec succès
    return new Response(
      JSON.stringify({ success: true, message: "Webhook traité avec succès" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Gérer les erreurs générales
    console.error(`Erreur lors du traitement du webhook depuis ${ip}:`, error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
