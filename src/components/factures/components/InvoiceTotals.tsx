
import { formatNumber } from "@/utils/formatters";

interface InvoiceTotalsProps {
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  finalAmount: number;
  applyTVA: boolean;
  showDiscount: boolean;
  showAdvancePayment: boolean;
  advancePaymentAmount: number;
  montantEnLettresText: string;
  currency: string;
}

export function InvoiceTotals({
  subtotal,
  totalTVA,
  totalTTC,
  finalAmount,
  applyTVA,
  showDiscount,
  showAdvancePayment,
  advancePaymentAmount,
  montantEnLettresText,
  currency
}: InvoiceTotalsProps) {
  return (
    <div className="mt-6 mb-8">
      <div className="flex flex-col items-end">
        <div className="w-64 border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Sous-total:</span>
            <span>{formatNumber(subtotal)} {currency}</span>
          </div>
          
          {applyTVA && (
            <div className="flex justify-between mb-2">
              <span>TVA:</span>
              <span>{formatNumber(totalTVA)} {currency}</span>
            </div>
          )}
          
          {showDiscount && (
            <div className="flex justify-between mb-2">
              <span>Remise:</span>
              <span>0.00 {currency}</span>
            </div>
          )}
          
          <div className="flex justify-between mb-2 font-medium">
            <span>Total TTC:</span>
            <span>{formatNumber(totalTTC)} {currency}</span>
          </div>
          
          {showAdvancePayment && advancePaymentAmount > 0 && (
            <div className="flex justify-between mb-2">
              <span>Avance perçue:</span>
              <span>-{formatNumber(advancePaymentAmount)} {currency}</span>
            </div>
          )}
          
          {showAdvancePayment && advancePaymentAmount > 0 && (
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Reste à payer:</span>
              <span>{formatNumber(finalAmount)} {currency}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Montant en toutes lettres:</span> {montantEnLettresText}
        </p>
      </div>
    </div>
  );
}
