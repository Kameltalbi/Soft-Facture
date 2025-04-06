
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { Categorie } from "@/types";

interface ProduitFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produitId: string | null;
  categories: Categorie[];
}

export function ProduitFormModal({
  open,
  onOpenChange,
  produitId,
  categories,
}: ProduitFormModalProps) {
  const isEditing = produitId !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour sauvegarder le produit
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le produit" : "Nouveau produit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du produit</Label>
            <Input
              id="nom"
              placeholder="Nom du produit ou service"
              defaultValue={isEditing ? "Développement site web" : ""}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie</Label>
              <Select defaultValue={isEditing ? "1" : undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prix">Prix unitaire (€)</Label>
              <Input
                id="prix"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                defaultValue={isEditing ? "1200" : ""}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tva">Taux de TVA (%)</Label>
              <Input
                id="tva"
                type="number"
                min="0"
                max="100"
                placeholder="20"
                defaultValue={isEditing ? "20" : "20"}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unite">Unité</Label>
              <Select defaultValue="unite">
                <SelectTrigger>
                  <SelectValue placeholder="Unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unite">Unité</SelectItem>
                  <SelectItem value="heure">Heure</SelectItem>
                  <SelectItem value="jour">Jour</SelectItem>
                  <SelectItem value="mois">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description du produit ou service"
              rows={3}
              defaultValue={
                isEditing
                  ? "Conception et développement d'un site web responsive"
                  : ""
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
