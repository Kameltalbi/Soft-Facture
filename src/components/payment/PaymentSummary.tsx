
import { Card } from "@/components/ui/card";

interface PaymentSummaryProps {
  factureId: string;
  montant: number;
  nom: string;
  email: string;
}

const PaymentSummary = ({ factureId, montant, nom, email }: PaymentSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-blue-50 p-4">
        <div className="text-sm text-blue-600 font-medium mb-1">Référence</div>
        <div className="font-semibold">{factureId}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500 mb-1">Client</div>
          <div className="font-medium">{nom || "Non spécifié"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Email</div>
          <div className="font-medium">{email || "Non spécifié"}</div>
        </div>
      </div>

      <Card className="bg-gray-50 border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Montant à payer</span>
          <span className="text-xl font-bold">{montant.toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}</span>
        </div>
      </Card>

      <div className="text-sm text-gray-500 mt-4">
        <p>
          En cliquant sur "Payer maintenant", vous serez redirigé vers la plateforme 
          sécurisée Konnect pour finaliser votre paiement.
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;
