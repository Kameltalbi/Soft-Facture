
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaxeInput } from "@/components/factures/TaxeInput";
import { toast } from "sonner";
import { getCurrencySymbol } from "../utils/bonDeSortieUtils";

export interface ProductLine {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tva: number;
  montantTVA: number;
  estTauxTVA: boolean;
  discount: number;
  total: number;
}

interface ProductLineEditorProps {
  productLines: ProductLine[];
  applyTVA: boolean;
  showDiscount: boolean;
  currency: string;
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  onProductLineChange: (productLines: ProductLine[]) => void;
}

export function ProductLineEditor({
  productLines,
  applyTVA,
  showDiscount,
  currency,
  subtotal,
  totalTVA,
  totalTTC,
  onProductLineChange
}: ProductLineEditorProps) {
  const currencySymbol = getCurrencySymbol(currency);

  const handleQuantityChange = (id: string, value: number) => {
    const updatedLines = productLines.map(line => {
      if (line.id === id) {
        const newTotal = value * line.unitPrice;
        return { ...line, quantity: value, total: newTotal };
      }
      return line;
    });
    onProductLineChange(updatedLines);
  };

  const handlePriceChange = (id: string, value: number) => {
    const updatedLines = productLines.map(line => {
      if (line.id === id) {
        const newTotal = line.quantity * value;
        return { ...line, unitPrice: value, total: newTotal };
      }
      return line;
    });
    onProductLineChange(updatedLines);
  };

  const handleProductNameChange = (id: string, value: string) => {
    const updatedLines = productLines.map(line => {
      if (line.id === id) {
        return { ...line, name: value };
      }
      return line;
    });
    onProductLineChange(updatedLines);
  };

  const addProductLine = () => {
    const newLine = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true,
      discount: 0,
      total: 0,
    };
    onProductLineChange([...productLines, newLine]);
  };

  const removeProductLine = (id: string) => {
    if (productLines.length > 1) {
      onProductLineChange(productLines.filter((line) => line.id !== id));
    } else {
      toast.error("Vous devez avoir au moins une ligne de produit");
    }
  };

  const handleTaxChange = (id: string, value: number, estTauxTVA: boolean) => {
    const updatedLines = productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          tva: estTauxTVA ? value : line.tva,
          montantTVA: !estTauxTVA ? value : line.montantTVA,
          estTauxTVA: estTauxTVA
        };
      }
      return line;
    });
    onProductLineChange(updatedLines);
  };

  const handleTaxModeChange = (id: string, estTauxTVA: boolean) => {
    const updatedLines = productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          estTauxTVA,
          tva: estTauxTVA ? 20 : line.tva,
          montantTVA: !estTauxTVA ? 0 : line.montantTVA
        };
      }
      return line;
    });
    onProductLineChange(updatedLines);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">
          Produits et services
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={addProductLine}
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
                    value={line.name}
                    onChange={(e) => handleProductNameChange(line.id, e.target.value)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => handleQuantityChange(line.id, parseInt(e.target.value) || 1)}
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
                      onChange={(e) => handlePriceChange(line.id, parseFloat(e.target.value) || 0)}
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
                        handleTaxChange(line.id, value, estTauxTVA)
                      }
                      estTauxTVA={line.estTauxTVA}
                      onModeChange={(estTauxTVA) => 
                        handleTaxModeChange(line.id, estTauxTVA)
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
                      value={line.discount}
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
                    onClick={() => removeProductLine(line.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </div>
  );
}
