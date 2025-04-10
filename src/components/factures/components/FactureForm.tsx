
import { InvoiceHeader } from "./InvoiceHeader";
import { ProductLinesEditor } from "./ProductLinesEditor";
import { InvoiceTotals } from "./InvoiceTotals";

interface FactureFormProps {
  isEditing: boolean;
  productLines: any[];
  applyTVA: boolean;
  showDiscount: boolean;
  showAdvancePayment: boolean;
  advancePaymentAmount: number;
  handleAdvancePaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currency: string;
  currencySymbol: string;
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  finalAmount: number;
  onAddProductLine: () => void;
  onRemoveProductLine: (id: string) => void;
  onTaxChange: (id: string, value: number, estTauxTVA: boolean) => void;
  onTaxModeChange: (id: string, estTauxTVA: boolean) => void;
  onQuantityChange?: (id: string, value: number) => void;
  onPriceChange?: (id: string, value: number) => void;
  onProductNameChange?: (id: string, value: string) => void;
}

export function FactureForm({
  isEditing,
  productLines,
  applyTVA,
  showDiscount,
  showAdvancePayment,
  advancePaymentAmount,
  handleAdvancePaymentChange,
  currency,
  currencySymbol,
  subtotal,
  totalTVA,
  totalTTC,
  finalAmount,
  onAddProductLine,
  onRemoveProductLine,
  onTaxChange,
  onTaxModeChange,
  onQuantityChange,
  onPriceChange,
  onProductNameChange
}: FactureFormProps) {
  return (
    <div className="space-y-6">
      <InvoiceHeader 
        isCreated={false}
        onDownload={undefined}
        currency={currency}
      />
      
      <ProductLinesEditor 
        productLines={productLines}
        onAddProductLine={onAddProductLine}
        onRemoveProductLine={onRemoveProductLine}
        onTaxChange={onTaxChange}
        onTaxModeChange={onTaxModeChange}
        onQuantityChange={onQuantityChange}
        onPriceChange={onPriceChange}
        onProductNameChange={onProductNameChange}
        applyTVA={applyTVA}
        showDiscount={showDiscount}
        currencySymbol={currencySymbol}
      />
      
      <InvoiceTotals 
        subtotal={subtotal}
        totalTVA={totalTVA}
        totalTTC={totalTTC}
        applyTVA={applyTVA}
        showDiscount={showDiscount}
        showAdvancePayment={showAdvancePayment}
        advancePaymentAmount={advancePaymentAmount}
        handleAdvancePaymentChange={handleAdvancePaymentChange}
        finalAmount={finalAmount}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
