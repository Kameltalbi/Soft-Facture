
import { Button } from "@/components/ui/button";
import { FilePdf } from "@/components/ui/custom-icons";
import { getCurrencySymbol } from "../utils/devisUtils";
import { ProductLine } from "./ProductLineTable";
import { DocumentHeader } from "@/components/documents/DocumentHeader";

interface DevisPreviewProps {
  productLines: ProductLine[];
  applyTVA: boolean;
  showDiscount: boolean;
  currency: string;
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  montantTTCEnLettres: string;
  isCreated?: boolean;
  onDownload?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  numero?: string;
  dateCreation?: string;
  dateEcheance?: string;
}

export function DevisPreview({
  productLines,
  applyTVA,
  showDiscount,
  currency,
  subtotal,
  totalTVA,
  totalTTC,
  montantTTCEnLettres,
  isCreated = false,
  onDownload,
  onCancel,
  onSave,
  numero = "DEV2025-005",
  dateCreation = new Date().toLocaleDateString("fr-FR"),
  dateEcheance = new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString("fr-FR")
}: DevisPreviewProps) {
  const currencySymbol = getCurrencySymbol(currency);
  
  // Helper function to format numbers with proper thousand separator
  const formatNumber = (number: number): string => {
    // Use French locale which uses spaces as thousand separators
    return number.toLocaleString("fr-FR", {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="relative invoice-paper animate-fade-in py-8 px-10">
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
      
      <DocumentHeader 
        title="DEVIS"
        documentNumber={numero}
        emissionDate={dateCreation}
        dueDate={dateEcheance}
        variant="devis"
      />

      <div className="border-t border-b py-6 my-8">
        <h2 className="text-sm font-semibold mb-1 text-muted-foreground">
          CLIENT
        </h2>
        <div>
          <p className="font-semibold">Entreprise ABC</p>
          <p>456 Avenue des Clients</p>
          <p>69002 Lyon, France</p>
          <p>Email: contact@abc.fr</p>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-semibold">
                Description
              </th>
              <th className="text-center py-2 font-semibold">
                Quantité
              </th>
              <th className="text-right py-2 font-semibold">
                Prix unitaire
              </th>
              {applyTVA && (
                <th className="text-right py-2 font-semibold">
                  TVA
                </th>
              )}
              {showDiscount && (
                <th className="text-right py-2 font-semibold">
                  Remise (%)
                </th>
              )}
              <th className="text-right py-2 font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {productLines.map((line) => (
              <tr key={line.id} className="border-b">
                <td className="py-3">{line.name}</td>
                <td className="py-3 text-center">
                  {line.quantity}
                </td>
                <td className="py-3 text-right">
                  {formatNumber(line.unitPrice)} {currencySymbol}
                </td>
                {applyTVA && (
                  <td className="py-3 text-right">
                    {line.estTauxTVA 
                      ? `${line.tva}%` 
                      : `${formatNumber(line.montantTVA)} ${currencySymbol}`
                    }
                  </td>
                )}
                {showDiscount && (
                  <td className="py-3 text-right">
                    {line.discount}%
                  </td>
                )}
                <td className="py-3 text-right">
                  {formatNumber(line.total)} {currencySymbol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="flex justify-between py-1">
            <span className="w-28 text-left">Sous-total</span>
            <span>{formatNumber(subtotal)} {currencySymbol}</span>
          </div>
          {applyTVA && (
            <div className="flex justify-between py-1">
              <span className="w-28 text-left">TVA</span>
              <span>{formatNumber(totalTVA)} {currencySymbol}</span>
            </div>
          )}
          {showDiscount && (
            <div className="flex justify-between py-1">
              <span className="w-28 text-left">Remise globale</span>
              <span>0.00 {currencySymbol}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-t-gray-300 font-bold">
            <span className="w-28 text-left">Total TTC</span>
            <span>{formatNumber(totalTTC)} {currencySymbol}</span>
          </div>
        </div>
      </div>

      <div className="bg-invoice-blue-50 p-4 rounded-md mb-8">
        <p className="text-sm">
          <span className="font-semibold">
            Montant à payer en toutes lettres: {montantTTCEnLettres}
          </span>
        </p>
      </div>
      
      {isCreated && (
        <div className="flex gap-2 justify-end mt-8 border-t pt-6">
          <Button 
            variant="destructive" 
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button 
            variant="outline" 
            onClick={onSave}
          >
            Enregistrer
          </Button>
          <Button 
            onClick={onDownload}
          >
            Télécharger (PDF)
          </Button>
        </div>
      )}
    </div>
  );
}
