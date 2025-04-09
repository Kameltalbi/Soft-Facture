
import { getCurrencySymbol } from "@/components/factures/utils/factureUtils";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceTotalsPreview } from "./InvoiceTotalsPreview";
import { InvoiceActions } from "./InvoiceActions";

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
      <InvoiceHeader 
        isCreated={isCreated} 
        onDownload={onDownload} 
        currency={currency}
      />
      
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

      <InvoiceTable 
        productLines={productLines} 
        applyTVA={applyTVA} 
        showDiscount={showDiscount}
        currencySymbol={currencySymbol}
      />

      <InvoiceTotalsPreview
        subtotal={subtotal}
        totalTVA={totalTVA}
        totalTTC={totalTTC}
        finalAmount={finalAmount}
        applyTVA={applyTVA}
        showDiscount={showDiscount}
        showAdvancePayment={showAdvancePayment}
        advancePaymentAmount={advancePaymentAmount}
        currencySymbol={currencySymbol}
      />

      <div className="bg-invoice-blue-50 p-4 rounded-md mb-8">
        <p className="text-sm">
          <span className="font-semibold">
            {montantEnLettresText}
          </span>
        </p>
      </div>

      <InvoiceActions
        isCreated={isCreated}
        onCancel={onCancel}
        onSave={onSave}
        onDownload={onDownload}
      />
    </div>
  );
}
