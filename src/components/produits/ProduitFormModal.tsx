
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
            {isEditing ? t('product.edit') : t('product.new')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nom">{t('product.form.productName')}</Label>
            <Input
              id="nom"
              placeholder={t('product.form.productNamePlaceholder')}
              defaultValue={isEditing ? "Développement site web" : ""}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categorie">{t('product.form.category')}</Label>
              <Select defaultValue={isEditing ? "1" : undefined}>
                <SelectTrigger>
                  <SelectValue placeholder={t('product.form.selectCategory')} />
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
              <Label htmlFor="prix">{t('product.form.unitPrice')}</Label>
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
              <Label htmlFor="tva">{t('product.form.vatRate')}</Label>
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
              <Label htmlFor="unite">{t('product.form.unit')}</Label>
              <Select defaultValue="unite">
                <SelectTrigger>
                  <SelectValue placeholder={t('product.form.unit')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unite">{t('product.form.unitType')}</SelectItem>
                  <SelectItem value="heure">{t('product.form.hourType')}</SelectItem>
                  <SelectItem value="jour">{t('product.form.dayType')}</SelectItem>
                  <SelectItem value="mois">{t('product.form.monthType')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('product.form.description')}</Label>
            <Textarea
              id="description"
              placeholder={t('product.form.descriptionPlaceholder')}
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
              {t('product.form.cancel')}
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {t('product.form.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
