
import { TaxePersonnalisee } from "@/types";
import { TaxePersonnaliseeItem } from "./TaxePersonnaliseeItem";

interface TaxePersonnaliseeListProps {
  taxes: TaxePersonnalisee[];
  onEdit: (taxe: TaxePersonnalisee) => void;
  onDelete: (id: string) => void;
}

export function TaxePersonnaliseeList({ taxes, onEdit, onDelete }: TaxePersonnaliseeListProps) {
  if (taxes.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Aucune taxe personnalisée n'a été créée
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {taxes.map((taxe) => (
        <TaxePersonnaliseeItem
          key={taxe.id}
          taxe={taxe}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
