
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PaiementEchouePage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Paiement échoué
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">
            Une erreur est survenue lors du traitement de votre paiement. 
            Aucun montant n'a été débité de votre compte.
          </p>
          <p className="mt-2 text-gray-600">
            Veuillez réessayer ou contacter notre service client pour obtenir de l'aide.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link to="/paiement">Réessayer</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaiementEchouePage;
