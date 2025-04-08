
import { Input } from "@/components/ui/input";

interface InvoiceTotalsProps {
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  applyTVA: boolean;
  showDiscount: boolean;
  showAdvancePayment: boolean;
  advancePaymentAmount: number;
  handleAdvancePaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  finalAmount: number;
  currencySymbol: string;
}

export function InvoiceTotals({
  subtotal,
  totalTVA,
  totalTTC,
  applyTVA,
  showDiscount,
  showAdvancePayment,
  advancePaymentAmount,
  handleAdvancePaymentChange,
  finalAmount,
  currencySymbol,
}: InvoiceTotalsProps) {
  return (
    <div className="flex justify-end">
      <div className="w-64 space-y-2">
        <div className="flex justify-between">
          <span className="w-28 text-left">Sous-total</span>
          <span>{subtotal.toLocaleString("fr-FR")} {currencySymbol}</span>
        </div>
        {applyTVA && (
          <div className="flex justify-between">
            <span className="w-28 text-left">TVA</span>
            <span>{totalTVA.toLocaleString("fr-FR")} {currencySymbol}</span>
          </div>
        )}
        {showDiscount && (
          <div className="flex justify-between">
            <span className="w-28 text-left">Remise globale</span>
            <span>0.00 {currencySymbol}</span>
          </div>
        )}
        {showAdvancePayment && (
          <div className="flex justify-between items-center">
            <span className="w-28 text-left">Avance perçue</span>
            <div className="w-24 flex items-center">
              <Input
                type="number"
                min="0"
                max={totalTTC}
                step="0.01"
                value={advancePaymentAmount}
                onChange={handleAdvancePaymentChange}
                className="w-full text-right pr-1"
              />
              <span className="ml-1">{currencySymbol}</span>
            </div>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t font-bold">
          <span className="w-28 text-left">Total TTC</span>
          <span>{showAdvancePayment ? finalAmount.toLocaleString("fr-FR") : totalTTC.toLocaleString("fr-FR")} {currencySymbol}</span>
        </div>
      </div>
    </div>
  );
}
