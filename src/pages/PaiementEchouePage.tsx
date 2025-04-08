
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";

const PaiementEchouePage = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref") || "";
  const plan = searchParams.get("plan") || null;

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-red-100 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Paiement non complété</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-gray-600">
            {plan === 'annual' 
              ? "Le paiement de votre abonnement n'a pas pu être traité." 
              : "Votre paiement n'a pas pu être traité."}
          </p>
          {ref && (
            <p className="text-sm text-gray-500">
              Référence: {ref}
            </p>
          )}
          <p className="mt-4 text-gray-600">
            Vous pouvez réessayer ou contacter notre support si le problème persiste.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            className="w-full" 
            size="lg"
            asChild
          >
            <Link to={plan === 'annual' ? "/paiement?plan=annual&montant=390" : "/"}>
              {plan === 'annual' ? "Réessayer le paiement" : "Retour à l'accueil"}
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            asChild
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaiementEchouePage;
