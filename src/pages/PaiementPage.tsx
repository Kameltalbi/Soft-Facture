
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldAlert } from "lucide-react";
import PaymentSummary from "@/components/payment/PaymentSummary";
import { useAuth } from "@/contexts/auth-context";
import { SubscriptionPlan } from "@/hooks/use-subscription";

const PaiementPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { session, authStatus, hasActiveSubscription, updateSubscription } = useAuth();

  // Récupérer les paramètres de l'URL
  const factureId = searchParams.get("id") || "";
  const montant = searchParams.get("montant") || "0";
  const nom = searchParams.get("nom") || "";
  const email = searchParams.get("email") || "";
  const plan = searchParams.get("plan") as SubscriptionPlan || null;
  const description = searchParams.get("description") || plan === 'annual' 
    ? "Abonnement annuel" 
    : factureId 
      ? `Paiement facture #${factureId}`
      : "Paiement";
  
  // Convertir le montant en millimes (centimes)
  const montantEnMillimes = Math.round(parseFloat(montant) * 1000);

  // S'assurer que l'utilisateur est connecté pour accéder à cette page
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigate('/login');
    }
  }, [authStatus, navigate]);

  // Ajout de logs pour débugger
  useEffect(() => {
    console.log("PaiementPage - État initial:", {
      plan,
      montant,
      montantEnMillimes,
      authStatus,
      hasActiveSubscription,
      factureId
    });
  }, [plan, montant, montantEnMillimes, authStatus, hasActiveSubscription, factureId]);

  // Valider les paramètres d'entrée
  useEffect(() => {
    setIsValidating(true);
    
    console.log("Validation des paramètres commencée");
    
    // Si c'est un paiement d'abonnement, vérifier seulement le plan et le montant
    if (plan) {
      console.log("Validation pour plan:", plan);
      
      if (plan !== 'annual' && plan !== 'trial') {
        setValidationError("Plan d'abonnement invalide");
        setIsValidating(false);
        return;
      }
      
      if (plan === 'annual' && montantEnMillimes !== 390000) { // 390 DT
        setValidationError("Montant invalide pour l'abonnement annuel");
        setIsValidating(false);
        return;
      }
      
      if (plan === 'trial') {
        console.log("Plan d'essai détecté, redirection vers dashboard");
        // Pour le plan d'essai, rediriger directement vers le tableau de bord
        updateSubscription('trial').then(() => {
          navigate('/dashboard');
        });
        return;
      }
      
      // Si l'utilisateur a déjà un abonnement actif
      if (hasActiveSubscription) {
        setValidationError("Vous avez déjà un abonnement actif");
        setIsValidating(false);
        return;
      }
      
      setValidationError(null);
      setIsValidating(false);
      return;
    }
    
    // Pour les factures, vérifier l'ID et le montant
    if (!factureId) {
      setValidationError("Identifiant de facture manquant");
      setIsValidating(false);
      return;
    }
    
    if (montantEnMillimes <= 0) {
      setValidationError("Montant invalide");
      setIsValidating(false);
      return;
    }
    
    // Vérifier le format de l'e-mail si fourni
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Format d'email invalide");
      setIsValidating(false);
      return;
    }
    
    // Limites de sécurité sur le montant
    if (montantEnMillimes > 10000000) { // 10,000 TND
      setValidationError("Montant supérieur à la limite autorisée");
      setIsValidating(false);
      return;
    }
    
    console.log("Validation réussie");
    setValidationError(null);
    setIsValidating(false);
  }, [factureId, montantEnMillimes, email, plan, hasActiveSubscription, navigate, updateSubscription]);

  const handlePayment = async () => {
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if ((!factureId && !plan) || montantEnMillimes <= 0) {
      toast.error("Informations de paiement incomplètes");
      return;
    }

    setIsLoading(true);
    console.log("Début du processus de paiement");

    try {
      // Utiliser l'e-mail de l'utilisateur connecté si disponible
      const userEmail = session?.user.email || email;
      
      console.log("Paramètres envoyés à init-payment:", {
        amount: montantEnMillimes,
        description,
        email: userEmail,
        orderId: factureId || `SUB-${plan}-${Date.now()}`,
        plan
      });
      
      // Appeler la fonction Edge pour initialiser le paiement
      const { data, error } = await supabase.functions.invoke("init-payment", {
        body: {
          amount: montantEnMillimes,
          description,
          firstName: nom.split(" ")[0] || "",
          lastName: nom.split(" ").slice(1).join(" ") || "",
          email: userEmail,
          orderId: factureId || `SUB-${plan}-${Date.now()}`, // Pour les abonnements, générer un ID unique
          plan: plan // Passer le plan pour traitement dans la fonction webhook
        }
      });

      console.log("Réponse de init-payment:", { data, error });

      if (error) {
        console.error("Erreur lors de l'initialisation du paiement:", error);
        
        // Message d'erreur plus convivial
        if (error.message?.includes('429')) {
          toast.error("Trop de tentatives de paiement. Veuillez réessayer dans quelques minutes.");
        } else {
          toast.error(`Erreur: ${error.message || "Erreur lors de l'initialisation du paiement"}`);
        }
        
        setIsLoading(false);
        return;
      }

      // Si c'est un paiement d'abonnement, mettre à jour l'abonnement dans la base de données
      if (plan && data?.paymentRef) {
        await updateSubscription(plan, data.paymentRef);
      }

      // Rediriger vers l'URL de paiement Konnect
      if (data && data.payUrl) {
        console.log("Redirection vers l'URL de paiement:", data.payUrl);
        window.location.href = data.payUrl;
      } else {
        toast.error("URL de paiement non disponible");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(`Une erreur est survenue: ${error.message || "Erreur de connexion au service de paiement"}`);
      setIsLoading(false);
    }
  };

  // Afficher un message d'erreur si la validation échoue
  if (validationError) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
            <CardTitle className="text-2xl font-bold text-center">Paramètres de paiement invalides</CardTitle>
            <CardDescription className="text-center text-red-500">
              {validationError}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="secondary" 
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Afficher un spinner pendant la validation
  if (isValidating) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {plan === 'annual' ? "Abonnement annuel" : "Paiement en ligne"}
          </CardTitle>
          <CardDescription className="text-center">
            Paiement sécurisé via Konnect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentSummary 
            factureId={factureId}
            montant={parseFloat(montant)}
            nom={nom || (session?.user?.user_metadata?.nom as string) || ""}
            email={email || session?.user?.email || ""}
            description={plan === 'annual' ? "Abonnement annuel - Accès complet pendant 1 an" : undefined}
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator className="mb-4" />
          <Button 
            onClick={handlePayment} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              "Payer maintenant"
            )}
          </Button>
          <Button
            variant="ghost" 
            className="mt-2 w-full"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Annuler
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaiementPage;
