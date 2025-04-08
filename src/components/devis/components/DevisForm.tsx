
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { ProductLine, ProductLineTable } from "./ProductLineTable";
import { getCurrencySymbol } from "../utils/devisUtils";

interface DevisFormProps {
  isEditing: boolean;
  productLines: ProductLine[];
  applyTVA: boolean;
  showDiscount: boolean;
  currency: string;
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  onAddProductLine: () => void;
  onRemoveProductLine: (id: string) => void;
  onTaxChange: (id: string, value: number, estTauxTVA: boolean) => void;
  onTaxModeChange: (id: string, estTauxTVA: boolean) => void;
}

export function DevisForm({
  isEditing,
  productLines,
  applyTVA,
  showDiscount,
  currency,
  subtotal,
  totalTVA,
  totalTTC,
  onAddProductLine,
  onRemoveProductLine,
  onTaxChange,
  onTaxModeChange
}: DevisFormProps) {
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <Label htmlFor="numero">Numéro de devis</Label>
          <Input
            id="numero"
            defaultValue={isEditing ? "DEV2025-001" : "DEV2025-005"}
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">
            Produits et services
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddProductLine}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une ligne
          </Button>
        </div>

        <ProductLineTable 
          productLines={productLines}
          currencySymbol={currencySymbol}
          applyTVA={applyTVA}
          showDiscount={showDiscount}
          onRemoveLine={onRemoveProductLine}
          onTaxChange={onTaxChange}
          onTaxModeChange={onTaxModeChange}
        />
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{subtotal.toLocaleString("fr-FR")} {currencySymbol}</span>
          </div>
          {applyTVA && (
            <div className="flex justify-between">
              <span>TVA</span>
              <span>{totalTVA.toLocaleString("fr-FR")} {currencySymbol}</span>
            </div>
          )}
          {showDiscount && (
            <div className="flex justify-between">
              <span>Remise globale</span>
              <span>0.00 {currencySymbol}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-bold">
            <span>Total TTC</span>
            <span>{totalTTC.toLocaleString("fr-FR")} {currencySymbol}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          placeholder="Ajouter des notes ou des conditions particulières"
        />
      </div>
    </div>
  );
}
