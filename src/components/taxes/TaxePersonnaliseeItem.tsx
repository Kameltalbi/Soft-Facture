
import { Edit, Trash2 } from "lucide-react";
import { TaxePersonnalisee } from "@/types";
import { Button } from "@/components/ui/button";

interface TaxePersonnaliseeItemProps {
  taxe: TaxePersonnalisee;
  onEdit: (taxe: TaxePersonnalisee) => void;
  onDelete: (id: string) => void;
}

export function TaxePersonnaliseeItem({ taxe, onEdit, onDelete }: TaxePersonnaliseeItemProps) {
  return (
    <div
      key={taxe.id}
      className="flex items-center justify-between p-3 border rounded-md"
    >
      <div className="font-medium">{taxe.nom}</div>
      <div className="flex items-center space-x-1">
        <div className="text-muted-foreground mr-2">
          {taxe.montant}{taxe.estMontantFixe ? "€" : "%"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(taxe)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(taxe.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
