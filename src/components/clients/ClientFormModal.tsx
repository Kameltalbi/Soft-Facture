
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
}

export function ClientFormModal({
  open,
  onOpenChange,
  clientId,
}: ClientFormModalProps) {
  const isEditing = clientId !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour sauvegarder le client
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le client" : "Nouveau client"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                placeholder="Nom du client"
                defaultValue={isEditing ? "Jean Dupont" : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="societe">Société</Label>
              <Input
                id="societe"
                placeholder="Nom de la société"
                defaultValue={isEditing ? "Société XYZ" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                defaultValue={isEditing ? "jean.dupont@xyz.fr" : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                placeholder="06 XX XX XX XX"
                defaultValue={isEditing ? "06 12 34 56 78" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Textarea
              id="adresse"
              placeholder="Adresse complète"
              rows={3}
              defaultValue={
                isEditing ? "456 Avenue des Clients, 69002 Lyon" : ""
              }
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
