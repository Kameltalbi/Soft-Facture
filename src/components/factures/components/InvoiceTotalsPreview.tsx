
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
  );
}
