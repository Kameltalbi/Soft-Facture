
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
}: FactureFormProps) {
  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <Label htmlFor="numero">Numéro de facture</Label>
          <Input
            id="numero"
            defaultValue={isEditing ? "FAC2025-001" : "FAC2025-005"}
            readOnly
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="date">Date d'émission</Label>
          <Input
            id="date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="echeance">Date d'échéance</Label>
          <Input
            id="echeance"
            type="date"
            defaultValue={
              new Date(
                new Date().setDate(new Date().getDate() + 30)
              )
                .toISOString()
                .split("T")[0]
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="client">Client</Label>
          <Select defaultValue="1">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Entreprise ABC</SelectItem>
              <SelectItem value="2">Société XYZ</SelectItem>
              <SelectItem value="3">Consulting DEF</SelectItem>
              <SelectItem value="4">Studio Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label htmlFor="statut">Statut</Label>
          <Select defaultValue="brouillon">
            <SelectTrigger>
              <SelectValue placeholder="Statut de la facture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brouillon">Brouillon</SelectItem>
              <SelectItem value="envoyee">Envoyée</SelectItem>
              <SelectItem value="payee">Payée</SelectItem>
              <SelectItem value="retard">En retard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductLinesEditor 
        productLines={productLines}
        onAddProductLine={onAddProductLine}
        onRemoveProductLine={onRemoveProductLine}
        onTaxChange={onTaxChange}
        onTaxModeChange={onTaxModeChange}
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
