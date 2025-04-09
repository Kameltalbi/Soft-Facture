
import { useEffect, useState } from "react";
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
import { createProduit, getProduitById, updateProduit } from "@/services/produitService";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: "",
    categorieId: "",
    prix: "",
    tauxTVA: "20",
    unite: "unite",
    description: ""
  });

  useEffect(() => {
    if (isEditing && open && produitId) {
      const loadProduit = async () => {
        setLoading(true);
        const produit = await getProduitById(produitId);
        if (produit) {
          setFormData({
            nom: produit.nom,
            categorieId: produit.categorie.id,
            prix: produit.prix.toString(),
            tauxTVA: produit.tauxTVA.toString(),
            unite: "unite", // This should come from the database if you add a unit field
            description: produit.description || ""
          });
        }
        setLoading(false);
      };
      
      loadProduit();
    } else if (!isEditing) {
      // Reset form for new product
      setFormData({
        nom: "",
        categorieId: "",
        prix: "",
        tauxTVA: "20",
        unite: "unite",
        description: ""
      });
    }
  }, [produitId, isEditing, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const produitData = {
        nom: formData.nom,
        categorieId: formData.categorieId,
        prix: parseFloat(formData.prix),
        tauxTVA: parseFloat(formData.tauxTVA),
        description: formData.description || undefined
      };
      
      if (isEditing && produitId) {
        await updateProduit(produitId, produitData);
      } else {
        await createProduit(produitData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(t('product.form.errorSaving'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('product.edit') : t('product.new')}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">{t('common.loading')}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom">{t('product.form.productName')}</Label>
              <Input
                id="nom"
                placeholder={t('product.form.productNamePlaceholder')}
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categorie">{t('product.form.category')}</Label>
                <Select
                  value={formData.categorieId}
                  onValueChange={(value) => handleSelectChange("categorieId", value)}
                >
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
                  value={formData.prix}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tauxTVA">{t('product.form.vatRate')}</Label>
                <Input
                  id="tauxTVA"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="20"
                  value={formData.tauxTVA}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unite">{t('product.form.unit')}</Label>
                <Select
                  value={formData.unite}
                  onValueChange={(value) => handleSelectChange("unite", value)}
                >
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
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t('product.form.cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {t('product.form.save')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
