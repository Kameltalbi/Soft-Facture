
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { InvoiceTotalsPreview } from "./InvoiceTotalsPreview";
import { formatNumber } from "@/utils/formatters";
import { useProducts } from "@/hooks/useProducts";
import { ProductCombobox } from "./ProductCombobox";

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
  onQuantityChange: (id: string, value: number) => void;
  onPriceChange: (id: string, value: number) => void;
  onProductNameChange: (id: string, value: string, prix?: number, taux_tva?: number) => void;
  clientName: string;
  setClientName: (value: string) => void;
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
  onProductNameChange,
  clientName,
  setClientName
}: FactureFormProps) {
  // État local pour gérer le type de saisie de TVA
  const [taxInputType, setTaxInputType] = useState<Record<string, "percentage" | "amount">>({});
  
  // Récupérer la liste des produits
  const { products, loading: productsLoading } = useProducts();
  console.log('FactureForm - Products:', products);
  console.log('FactureForm - Loading:', productsLoading);

  // Fonction pour basculer entre les types de saisie de TVA
  const toggleTaxInputType = (id: string) => {
    const newType = taxInputType[id] === "percentage" ? "amount" : "percentage";
    setTaxInputType({ ...taxInputType, [id]: newType });
    onTaxModeChange(id, newType === "percentage");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <Label htmlFor="client-name">Nom du client</Label>
            <Input 
              id="client-name" 
              value={clientName} 
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nom ou société du client"
            />
          </div>
        </div>

        <h3 className="text-lg font-medium">Produits et services</h3>

        {productLines.map((line, index) => (
          <div key={line.id} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-md bg-white">
            {/* Nom du produit */}
            <div className="col-span-12 md:col-span-5">
              <Label htmlFor={`product-${line.id}`} className="sr-only">
                Produit ou service
              </Label>
              <ProductCombobox
                products={products}
                value={line.name}
                onChange={(value, product) => {
                  onProductNameChange(
                    line.id,
                    value,
                    product?.prix,
                    product?.taux_tva
                  );
                }}
                disabled={productsLoading}
              />
            </div>

            {/* Quantité */}
            <div className="col-span-3 md:col-span-1">
              <Label htmlFor={`quantity-${line.id}`} className="sr-only">
                Quantité
              </Label>
              <Input
                id={`quantity-${line.id}`}
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => onQuantityChange(line.id, Number(e.target.value))}
              />
            </div>

            {/* Prix unitaire */}
            <div className="col-span-5 md:col-span-2">
              <Label htmlFor={`price-${line.id}`} className="sr-only">
                Prix unitaire
              </Label>
              <div className="relative">
                <Input
                  id={`price-${line.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.unitPrice}
                  onChange={(e) => onPriceChange(line.id, Number(e.target.value))}
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  {currencySymbol}
                </div>
              </div>
            </div>

            {/* TVA (conditionnelle) */}
            {applyTVA && (
              <div className="col-span-4 md:col-span-2">
                <Label htmlFor={`tax-${line.id}`} className="sr-only">
                  TVA
                </Label>
                <div className="flex">
                  <Input
                    id={`tax-${line.id}`}
                    type="number"
                    min="0"
                    step={line.estTauxTVA ? "1" : "0.01"}
                    value={line.estTauxTVA ? line.tva : line.montantTVA}
                    onChange={(e) => onTaxChange(line.id, Number(e.target.value), line.estTauxTVA)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-1 px-2"
                    onClick={() => toggleTaxInputType(line.id)}
                  >
                    {line.estTauxTVA ? "%" : currencySymbol}
                  </Button>
                </div>
              </div>
            )}

            {/* Sous-total */}
            <div className="col-span-5 md:col-span-1">
              <div className="flex items-center h-10 px-3 text-sm border border-input rounded-md bg-muted/50">
                {formatNumber(line.quantity * line.unitPrice)} {currencySymbol}
              </div>
            </div>

            {/* Bouton supprimer */}
            <div className="col-span-3 md:col-span-1 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-red-500"
                onClick={() => onRemoveProductLine(line.id)}
                disabled={productLines.length === 1}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={onAddProductLine}
          className="w-full mt-2"
        >
          Ajouter une ligne
        </Button>
      </div>

      {/* Avance (conditionnel) */}
      {showAdvancePayment && (
        <div className="border p-4 rounded-md">
          <Label htmlFor="advance-payment">Avance perçue</Label>
          <div className="relative mt-1">
            <Input
              id="advance-payment"
              type="number"
              min="0"
              max={totalTTC}
              step="0.01"
              value={advancePaymentAmount}
              onChange={handleAdvancePaymentChange}
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              {currencySymbol}
            </div>
          </div>
        </div>
      )}

      {/* Totaux */}
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
    </div>
  );
}
