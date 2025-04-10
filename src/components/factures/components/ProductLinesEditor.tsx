
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { TaxeInput } from "../TaxeInput";

interface ProductLinesEditorProps {
  productLines: any[];
  onAddProductLine: () => void;
  onRemoveProductLine: (id: string) => void;
  onTaxChange: (id: string, value: number, estTauxTVA: boolean) => void;
  onTaxModeChange: (id: string, estTauxTVA: boolean) => void;
  onQuantityChange?: (id: string, value: number) => void;
  onPriceChange?: (id: string, value: number) => void;
  onProductNameChange?: (id: string, value: string) => void;
  applyTVA: boolean;
  showDiscount: boolean;
  currencySymbol: string;
}

export function ProductLinesEditor({
  productLines,
  onAddProductLine,
  onRemoveProductLine,
  onTaxChange,
  onTaxModeChange,
  onQuantityChange,
  onPriceChange,
  onProductNameChange,
  applyTVA,
  showDiscount,
  currencySymbol,
}: ProductLinesEditorProps) {
  return (
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                Produit / Service
              </TableHead>
              <TableHead className="text-center">Quantité</TableHead>
              <TableHead className="text-center">
                Prix unitaire
              </TableHead>
              {applyTVA && (
                <TableHead className="text-center">
                  TVA
                </TableHead>
              )}
              {showDiscount && (
                <TableHead className="text-center">
                  Remise (%)
                </TableHead>
              )}
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productLines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  <Input
                    placeholder="Description"
                    defaultValue={line.name}
                    onChange={(e) => onProductNameChange && onProductNameChange(line.id, e.target.value)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => onQuantityChange && onQuantityChange(line.id, parseInt(e.target.value) || 1)}
                    className="w-16 mx-auto text-center"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitPrice}
                      onChange={(e) => onPriceChange && onPriceChange(line.id, parseFloat(e.target.value) || 0)}
                      className="w-24 text-center"
                    />
                    <span className="ml-1">{currencySymbol}</span>
                  </div>
                </TableCell>
                {applyTVA && (
                  <TableCell className="text-center">
                    <TaxeInput 
                      value={line.estTauxTVA ? line.tva : line.montantTVA}
                      onChange={(value, estTauxTVA) => 
                        onTaxChange(line.id, value, estTauxTVA)
                      }
                      estTauxTVA={line.estTauxTVA}
                      onModeChange={(estTauxTVA) => 
                        onTaxModeChange(line.id, estTauxTVA)
                      }
                    />
                  </TableCell>
                )}
                {showDiscount && (
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={line.discount.toString()}
                      className="w-16 mx-auto text-center"
                    />
                  </TableCell>
                )}
                <TableCell className="text-right font-medium">
                  {line.total.toLocaleString("fr-FR")} {currencySymbol}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveProductLine(line.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
