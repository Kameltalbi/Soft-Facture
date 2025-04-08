
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import PaymentSummary from "@/components/payment/PaymentSummary";

const PaiementPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer les paramètres de l'URL
  const factureId = searchParams.get("id") || "";
  const montant = searchParams.get("montant") || "0";
  const nom = searchParams.get("nom") || "";
  const email = searchParams.get("email") || "";
  const description = searchParams.get("description") || `Paiement facture #${factureId}`;
  
  // Convertir le montant en millimes (centimes)
  const montantEnMillimes = Math.round(parseFloat(montant) * 1000);

  const handlePayment = async () => {
    if (!factureId || !montant || montantEnMillimes <= 0) {
      toast.error("Informations de paiement incomplètes");
      return;
    }

    setIsLoading(true);

    try {
      // Appeler la fonction Edge pour initialiser le paiement
      const { data, error } = await supabase.functions.invoke("init-payment", {
        body: {
          amount: montantEnMillimes,
          description,
          firstName: nom.split(" ")[0] || "",
          lastName: nom.split(" ").slice(1).join(" ") || "",
          email,
          orderId: factureId
        }
      });

      if (error) {
        console.error("Erreur lors de l'initialisation du paiement:", error);
        toast.error("Erreur lors de l'initialisation du paiement");
        setIsLoading(false);
        return;
      }

      // Rediriger vers l'URL de paiement Konnect
      if (data && data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        toast.error("URL de paiement non disponible");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Paiement en ligne</CardTitle>
          <CardDescription className="text-center">
            Paiement sécurisé via Konnect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentSummary 
            factureId={factureId}
            montant={parseFloat(montant)}
            nom={nom}
            email={email}
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
