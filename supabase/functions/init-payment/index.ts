
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Récupérer les clés depuis les variables d'environnement
const API_KEY = Deno.env.get("KONNECT_API_KEY");
const WALLET_ID = Deno.env.get("KONNECT_WALLET_ID");

// Fonction servant à initialiser un paiement via l'API Konnect
serve(async (req) => {
  try {
    // Vérifier la méthode HTTP
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Méthode non autorisée" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // Récupérer les données du corps de la requête
    const requestData = await req.json();
    const { amount, description, firstName, lastName, email, phoneNumber, orderId } = requestData;

    // Vérifier que toutes les données nécessaires sont présentes
    if (!amount || !orderId) {
      return new Response(
        JSON.stringify({ error: "Données de paiement incomplètes" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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

    // Appel à l'API Konnect
    const response = await fetch("https://gateway.konnect.network/api/payments/init-payment", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(konnectRequestBody)
    });

    // Récupérer la réponse de l'API avec gestion des erreurs non-JSON
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      const text = await response.text();
      return new Response(
        JSON.stringify({ error: "Réponse non JSON", raw: text }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Vérifier si la réponse contient une erreur
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'initialisation du paiement", details: responseData }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Retourner la réponse de l'API
    return new Response(
      JSON.stringify(responseData),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Gérer les erreurs
    return new Response(
      JSON.stringify({ error: "Erreur serveur", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
