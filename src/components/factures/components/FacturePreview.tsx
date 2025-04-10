
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceTable } from "./InvoiceTable";
import { InvoiceTotals } from "./InvoiceTotals";
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
  isCreated: boolean;
  onCancel?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  clientName: string;
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
  isCreated,
  onCancel,
  onSave,
  onDownload,
  clientName
}: FacturePreviewProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <InvoiceHeader 
        clientName={clientName}
      />
      
      <InvoiceTable 
        productLines={productLines}
        currency={currency}
        applyTVA={applyTVA}
      />
      
      <InvoiceTotals 
        subtotal={subtotal}
        totalTVA={totalTVA}
        totalTTC={totalTTC}
        finalAmount={finalAmount}
        applyTVA={applyTVA}
        showDiscount={showDiscount}
        showAdvancePayment={showAdvancePayment}
        advancePaymentAmount={advancePaymentAmount}
        montantEnLettresText={montantEnLettresText}
        currency={currency}
      />
      
      <InvoiceActions 
        isCreated={isCreated}
        onCancel={onCancel}
        onSave={onSave}
        onDownload={onDownload}
      />
    </div>
  );
}
