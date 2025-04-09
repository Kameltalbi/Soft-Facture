
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

interface KonnectPayment {
  amount: number;
  description: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  orderId: string;
  plan?: 'trial' | 'annual';
}

// Entêtes CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  // Vérifier la méthode
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 405 
      }
    );
  }

  try {
    // Récupérer les paramètres de paiement
    let payload: KonnectPayment | null = null;
    try {
      payload = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }

    // Vérifier les paramètres obligatoires
    if (!payload || !payload.amount || !payload.orderId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // Initialiser Supabase Admin Client pour stocker les infos de paiement
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Initialiser le paiement avec Konnect
    const konnectWalletId = Deno.env.get("KONNECT_WALLET_ID");
    const konnectApiKey = Deno.env.get("KONNECT_API_KEY");

    if (!konnectWalletId || !konnectApiKey) {
      throw new Error("Konnect configuration is missing");
    }

    // URL de l'API Konnect
    const apiUrl = "https://api.konnect.network/api/v2/payments/init-payment";

    // URL de base pour les redirections
    const baseUrl = req.headers.get("origin") || "https://votre-domaine.com";

    // Construire les URLs de callback
    const successUrl = `${baseUrl}/paiement-reussi?ref=${payload.orderId}${payload.plan ? `&plan=${payload.plan}` : ''}`;
    const failUrl = `${baseUrl}/paiement-echoue?ref=${payload.orderId}${payload.plan ? `&plan=${payload.plan}` : ''}`;

    // Construire la requête Konnect - Utiliser receiverWalletId au lieu de receiver
    const konnectPayload = {
      receiverWalletId: konnectWalletId,
      amount: payload.amount,
      accept_currency: false,
      orderId: payload.orderId,
      successUrl,
      failUrl,
      first_name: payload.firstName || "",
      last_name: payload.lastName || "",
      email: payload.email || "",
      webhook: "https://effaassdrpabvpgoulrq.supabase.co/functions/v1/payment-webhook",
    };

    console.log("Initialisation du paiement Konnect:", konnectPayload);

    // Appeler l'API Konnect
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": konnectApiKey,
      },
      body: JSON.stringify(konnectPayload),
    });

    // Analyser la réponse
    const responseData = await response.json();

    if (!response.ok || responseData.status !== "success") {
      console.error("Erreur Konnect:", responseData);
      throw new Error(`Konnect API error: ${responseData.message || "Unknown error"}`);
    }

    // Récupérer l'URL de paiement et la référence
    const payUrl = responseData.payUrl;
    const paymentRef = responseData.paymentRef;

    console.log("Paiement initialisé avec succès:", {
      payUrl,
      paymentRef,
      orderId: payload.orderId,
    });

    try {
      // Essayer de stocker la référence pour vérification future
      // Utiliser une RPC pour éviter les problèmes de typage
      await supabaseAdmin.rpc('store_transaction', {
        p_reference: paymentRef,
        p_order_id: payload.orderId,
        p_amount: payload.amount,
        p_type: payload.plan || "facture",
        p_metadata: payload
      });
    } catch (error) {
      // Si l'opération échoue, on continue quand même car ce n'est pas critique
      console.error("Erreur lors de l'enregistrement de la transaction:", error);
    }

    // Retourner l'URL de paiement au client
    return new Response(
      JSON.stringify({ 
        payUrl, 
        paymentRef
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur:", error);
    
    // Retourner l'erreur au client
    return new Response(
      JSON.stringify({ 
        error: error.message || "Une erreur est survenue" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
