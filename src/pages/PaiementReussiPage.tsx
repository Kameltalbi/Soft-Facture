
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PaiementReussiPage = () => {
  // Effet pour enregistrer le succès du paiement
  useEffect(() => {
    // Ici, vous pourriez appeler une API pour confirmer le paiement côté serveur
    console.log("Paiement réussi");
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Paiement réussi !
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            Votre paiement a été traité avec succès. Un email de confirmation
            avec votre facture vous sera envoyé sous peu.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaiementReussiPage;
