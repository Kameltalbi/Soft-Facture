
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BonDeSortieFormProps {
  isEditing: boolean;
}

export function BonDeSortieForm({ isEditing }: BonDeSortieFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          <Label htmlFor="numero">Numéro de bon de sortie</Label>
          <Input
            id="numero"
            defaultValue={isEditing ? "BDS2025-001" : "BDS2025-005"}
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
              <SelectValue placeholder="Statut du bon de sortie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brouillon">Brouillon</SelectItem>
              <SelectItem value="envoyee">Envoyé</SelectItem>
              <SelectItem value="payee">Accepté</SelectItem>
              <SelectItem value="retard">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
