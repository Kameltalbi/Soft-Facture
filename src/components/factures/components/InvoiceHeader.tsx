
import { getCurrencySymbol } from "@/components/factures/utils/factureUtils";
import { Button } from "@/components/ui/button";
import { FilePdf } from "@/components/ui/custom-icons";

interface InvoiceHeaderProps {
  isCreated: boolean;
  onDownload?: () => void;
  currency: string;
}

export function InvoiceHeader({
  isCreated,
  onDownload,
  currency
}: InvoiceHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <div className="w-52 h-14 bg-invoice-blue-100 flex items-center justify-center rounded">
          <p className="font-bold text-invoice-blue-700">
            VOTRE LOGO
          </p>
        </div>
        <div className="mt-4 text-sm">
          <p className="font-semibold">Votre Entreprise</p>
          <p>123 Rue de Paris</p>
          <p>75001 Paris, France</p>
          <p>Tél: 01 23 45 67 89</p>
          <p>Email: contact@votreentreprise.fr</p>
        </div>
      </div>
      <div className="text-right">
        <h1 className="text-2xl font-bold text-invoice-blue-600 mb-2">
          FACTURE
        </h1>
        <div className="text-sm">
          <p>
            <span className="font-medium">№ :</span> FAC2025-005
          </p>
          <p>
            <span className="font-medium">Date d'émission :</span>{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </p>
          <p>
            <span className="font-medium">
              Date d'échéance :
            </span>{" "}
            {new Date(
              new Date().setDate(new Date().getDate() + 30)
            ).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>
      
      {!isCreated && onDownload && (
        <div className="absolute top-4 right-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDownload}
            className="bg-white/80 hover:bg-white"
          >
            <FilePdf className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>
      )}
    </div>
  );
}
