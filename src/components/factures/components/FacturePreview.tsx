
import { getCurrencySymbol } from "@/components/factures/utils/factureUtils";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/formatters";
import { FilePdf } from "@/components/ui/custom-icons";

interface FacturePreviewProps {
  productLines: any[];
  applyTVA: boolean;
  showDiscount: boolean;
  showAdvancePayment: boolean;
  advancePaymentAmount: number;
  currency: string;
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  finalAmount: number;
  montantEnLettresText: string;
  isCreated?: boolean;
  onDownload?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
}

export function FacturePreview({
  productLines,
  applyTVA,
  showDiscount,
  showAdvancePayment,
  advancePaymentAmount,
  currency,
  subtotal,
  totalTVA,
  totalTTC,
  finalAmount,
  montantEnLettresText,
  isCreated = false,
  onDownload,
  onCancel,
  onSave,
}: FacturePreviewProps) {
  const currencySymbol = getCurrencySymbol(currency);

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
      </div>

      <div className="border-t border-b py-6 my-8">
        <h2 className="text-sm font-semibold mb-1 text-muted-foreground">
          FACTURER À
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
          {showAdvancePayment && (
            <div className="flex justify-between py-1">
              <span className="w-28 text-left">Avance perçue</span>
              <span>{formatNumber(advancePaymentAmount)} {currencySymbol}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-t-gray-300 font-bold">
            <span className="w-28 text-left">Total TTC</span>
            <span>{showAdvancePayment ? formatNumber(finalAmount) : formatNumber(totalTTC)} {currencySymbol}</span>
          </div>
        </div>
      </div>

      <div className="bg-invoice-blue-50 p-4 rounded-md mb-8">
        <p className="text-sm">
          <span className="font-semibold">
            {montantEnLettresText}
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
