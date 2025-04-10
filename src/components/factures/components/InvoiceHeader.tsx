
import { getCurrencySymbol } from "@/components/factures/utils/factureUtils";
import { Button } from "@/components/ui/button";
import { FilePdf } from "@/components/ui/custom-icons";
import { DocumentHeader } from "@/components/documents/DocumentHeader";

interface InvoiceHeaderProps {
  isCreated: boolean;
  onDownload?: () => void;
  currency: string;
  numero?: string;
  dateEmission?: string;
  dateEcheance?: string;
  statut?: string;
}

export function InvoiceHeader({
  isCreated,
  onDownload,
  currency,
  numero = "FAC2025-005",
  dateEmission = new Date().toLocaleDateString("fr-FR"),
  dateEcheance = new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString("fr-FR"),
  statut = "Brouillon"
}: InvoiceHeaderProps) {
  return (
    <div className="relative mb-4">
      <DocumentHeader 
        title="FACTURE"
        documentNumber={numero}
        emissionDate={dateEmission}
        dueDate={dateEcheance}
        variant="facture"
        hideStatus={true}
      />
      
      {!isCreated && onDownload && (
        <div className="absolute top-0 right-0">
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
