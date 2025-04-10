
import { formatNumber } from "@/utils/formatters";

interface InvoiceTotalsPreviewProps {
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  finalAmount: number;
  applyTVA: boolean;
  showDiscount: boolean;
  showAdvancePayment: boolean;
  advancePaymentAmount: number;
  currencySymbol: string;
}

export function InvoiceTotalsPreview({
  subtotal,
  totalTVA,
  totalTTC,
  finalAmount,
  applyTVA,
  showDiscount,
  showAdvancePayment,
  advancePaymentAmount,
  currencySymbol
}: InvoiceTotalsPreviewProps) {
  return (
    <div className="flex justify-end mb-8">
      <div className="w-80 border-t border-b py-2">
        <div className="flex justify-between py-1">
          <span className="w-32 text-left">Sous-total:</span>
          <span className="font-medium">{formatNumber(subtotal)} {currencySymbol}</span>
        </div>
        {applyTVA && (
          <div className="flex justify-between py-1">
            <span className="w-32 text-left">TVA:</span>
            <span className="font-medium">{formatNumber(totalTVA)} {currencySymbol}</span>
          </div>
        )}
        {showDiscount && (
          <div className="flex justify-between py-1">
            <span className="w-32 text-left">Remise globale:</span>
            <span className="font-medium">0.00 {currencySymbol}</span>
          </div>
        )}
        {showAdvancePayment && advancePaymentAmount > 0 && (
          <div className="flex justify-between py-1">
            <span className="w-32 text-left">Avance perçue:</span>
            <span className="font-medium">-{formatNumber(advancePaymentAmount)} {currencySymbol}</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-t mt-1 font-bold">
          <span className="w-32 text-left">
            {showAdvancePayment && advancePaymentAmount > 0 ? "Reste à payer:" : "Total TTC:"}
          </span>
          <span className="text-right">{formatNumber(showAdvancePayment ? finalAmount : totalTTC)} {currencySymbol}</span>
        </div>
      </div>
    </div>
  );
}
