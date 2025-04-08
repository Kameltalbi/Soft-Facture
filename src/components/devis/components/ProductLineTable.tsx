
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaxeInput } from "@/components/factures/TaxeInput";

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

interface ProductLineTableProps {
  productLines: ProductLine[];
  currencySymbol: string;
  applyTVA: boolean;
  showDiscount: boolean;
  onRemoveLine: (id: string) => void;
  onTaxChange: (id: string, value: number, estTauxTVA: boolean) => void;
  onTaxModeChange: (id: string, estTauxTVA: boolean) => void;
}

export function ProductLineTable({
  productLines,
  currencySymbol,
  applyTVA,
  showDiscount,
  onRemoveLine,
  onTaxChange,
  onTaxModeChange
}: ProductLineTableProps) {
  return (
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
                />
              </TableCell>
              <TableCell className="text-center">
                <Input
                  type="number"
                  min="1"
                  defaultValue={line.quantity.toString()}
                  className="w-16 mx-auto text-center"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={line.unitPrice.toString()}
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
                  onClick={() => onRemoveLine(line.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
