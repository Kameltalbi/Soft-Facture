
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { SubscriptionPlan } from "@/hooks/use-subscription";

const PaiementReussiPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateSubscription, authStatus } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  const ref = searchParams.get("ref") || "";
  const plan = searchParams.get("plan") as SubscriptionPlan || null;

  useEffect(() => {
    if (!authStatus || authStatus === 'loading') return;

    if (authStatus === 'unauthenticated') {
      navigate('/login');
      return;
    }

    // Si c'est un paiement d'abonnement, mettre à jour l'abonnement
    async function processPaiement() {
      if (plan === 'annual' && ref) {
        try {
          await updateSubscription('annual', ref);
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'abonnement:", error);
        }
      }
      setIsProcessing(false);
    }

    processPaiement();
  }, [authStatus, navigate, plan, ref, updateSubscription]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto animate-pulse">
              <CheckCircle2 className="h-16 w-16 text-gray-300" />
            </div>
            <CardTitle className="text-2xl mt-4">Traitement en cours...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Paiement réussi !</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-gray-600">
            {plan === 'annual' 
              ? "Votre abonnement annuel a été activé avec succès." 
              : "Votre paiement a été traité avec succès."}
          </p>
          <p className="text-sm text-gray-500">
            Référence: {ref}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full" 
            size="lg"
            asChild
          >
            <Link to="/dashboard">
              Accéder à votre tableau de bord
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            asChild
          >
            <Link to="/">
              Retour à l'accueil
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaiementReussiPage;
