
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Récupérer les clés depuis les variables d'environnement
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const KONNECT_API_KEY = Deno.env.get("KONNECT_API_KEY");

// Initialiser le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// CORS headers pour permettre l'accès depuis n'importe quelle origine
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction servant à recevoir et traiter les webhooks de Konnect
serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier la méthode HTTP
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Méthode non autorisée" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Vérifier que les clés API sont disponibles
    if (!KONNECT_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Configuration serveur incomplète" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Récupérer les données du webhook
    const webhookData = await req.json();
    console.log("Données de webhook reçues:", JSON.stringify(webhookData));

    // Vérifier les données minimales requises
    if (!webhookData.payment || !webhookData.payment.reference || !webhookData.payment.status) {
      return new Response(
        JSON.stringify({ error: "Données de webhook incomplètes" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { payment } = webhookData;
    const { reference, status, orderId } = payment;

    console.log(`Webhook reçu pour paiement ${reference}, statut: ${status}, orderId: ${orderId}`);

    // Vérifier l'authenticité du webhook (optionnel mais recommandé)
    // Vous pourriez implémenter une vérification de signature ici

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

    // Journal de paiement (optionnel)
    // Vous pourriez enregistrer tous les événements de paiement dans une table de journal
    const { data, error } = await supabase
      .from('journal_paiements')
      .insert({
        reference_paiement: reference,
        statut: status,
        facture_id: orderId,
        details: webhookData
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
    console.error("Erreur lors du traitement du webhook:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
