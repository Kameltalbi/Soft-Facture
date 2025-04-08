
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Récupérer les clés depuis les variables d'environnement
const API_KEY = Deno.env.get("KONNECT_API_KEY");
const WALLET_ID = Deno.env.get("KONNECT_WALLET_ID");

// CORS headers pour permettre l'accès depuis n'importe quelle origine
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fonction servant à initialiser un paiement via l'API Konnect
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
    if (!API_KEY || !WALLET_ID) {
      return new Response(
        JSON.stringify({ error: "Configuration serveur incomplète" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Récupérer les données du corps de la requête
    const requestData = await req.json();
    const { amount, description, firstName, lastName, email, phoneNumber, orderId } = requestData;

    // Vérifier que toutes les données nécessaires sont présentes
    if (!amount || !orderId) {
      return new Response(
        JSON.stringify({ error: "Données de paiement incomplètes" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Initialisation de paiement pour ${orderId}: ${amount} millimes`);

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
      webhook: "https://softfacture.tn/api/konnect/webhook", // À remplacer par votre webhook
      silentWebhook: true,
      successUrl: "https://softfacture.tn/paiement-reussi", // À remplacer par votre URL de succès
      failUrl: "https://softfacture.tn/paiement-echoue", // À remplacer par votre URL d'échec
      theme: "light"
    };

    console.log("Appel API Konnect avec corps:", JSON.stringify(konnectRequestBody));
    
    // URL corrigée de l'API Konnect
    const apiUrl = "https://api.konnect.network/api/v2/payments/init-payment";
    console.log("URL de l'API Konnect:", apiUrl);

    // Appel à l'API Konnect
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(konnectRequestBody)
    });

    console.log(`Réponse API Konnect status: ${response.status}`);

    // Récupérer la réponse de l'API en gérant séparément les cas JSON et non-JSON
    if (!response.ok) {
      // En cas d'erreur, on clone la réponse avant de la traiter
      // pour éviter le problème de "Body already consumed"
      const clonedResponse = response.clone();
      
      let errorDetails;
      try {
        errorDetails = await clonedResponse.json();
        console.error("Erreur API Konnect (JSON):", errorDetails);
      } catch (e) {
        const text = await response.text();
        console.error("Erreur API Konnect (texte brut):", text);
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

    // Si la réponse est OK, on la parse en JSON
    try {
      const responseData = await response.json();
      console.log("Réponse API Konnect (JSON réussi):", JSON.stringify(responseData));
      
      // Retourner la réponse de l'API
      return new Response(
        JSON.stringify(responseData),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (e) {
      console.error("Erreur parsing JSON réponse:", e);
      const text = await response.text();
      return new Response(
        JSON.stringify({ error: "Réponse non JSON", raw: text }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    // Gérer les erreurs générales
    console.error("Erreur générale:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
