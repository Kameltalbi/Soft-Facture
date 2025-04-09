
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getCurrencySymbol, getDefaultDeviseCode } from "@/utils/formatters";

interface ProduitFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produitId: string | null;
  categories: Categorie[];
  onSuccess: () => void;
}

export function ProduitFormModal({
  open,
  onOpenChange,
  produitId,
  categories,
  onSuccess,
}: ProduitFormModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isEditing = produitId !== null;
  const [currency, setCurrency] = useState<string>(getDefaultDeviseCode());
  
  const [formData, setFormData] = useState({
    nom: "",
    categorie_id: "",
    prix: "",
    taux_tva: "20",
    description: "",
    unite: "unite",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load the default currency from localStorage
    const storedCurrency = localStorage.getItem('defaultCurrency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    
    if (produitId && open) {
      fetchProductDetails();
    } else if (!produitId) {
      resetForm();
    }
  }, [produitId, open]);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .eq('id', produitId)
        .single();

      if (error) throw error;

      if (data) {
        // Get unite from database if it exists, otherwise use default
        const unite = data.unite || "unite";
        
        setFormData({
          nom: data.nom || "",
          categorie_id: data.categorie_id || "",
          prix: data.prix.toString() || "",
          taux_tva: data.taux_tva.toString() || "20",
          description: data.description || "",
          unite: unite
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: t('common.error'),
        description: t('product.loadError'),
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      categorie_id: "",
      prix: "",
      taux_tva: "20",
      description: "",
      unite: "unite"
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        nom: formData.nom,
        categorie_id: formData.categorie_id || null,
        prix: parseFloat(formData.prix),
        taux_tva: parseFloat(formData.taux_tva),
        description: formData.description || null,
        unite: formData.unite,
      };

      let result;

      if (isEditing) {
        result = await supabase
          .from('produits')
          .update(productData)
          .eq('id', produitId);
      } else {
        result = await supabase
          .from('produits')
          .insert(productData);
      }

      if (result.error) throw result.error;

      toast({
        title: isEditing ? t('product.updated') : t('product.created'),
        description: isEditing ? t('product.updateSuccess') : t('product.createSuccess'),
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: t('common.error'),
        description: isEditing ? t('product.updateError') : t('product.createError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get the currency symbol for display
  const currencySymbol = getCurrencySymbol(currency);

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
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categorie_id">{t('product.form.category')}</Label>
              <Select 
                value={formData.categorie_id} 
                onValueChange={(value) => handleSelectChange('categorie_id', value)}
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
              <Label htmlFor="prix">
                {t('product.form.unitPrice')} ({currencySymbol})
              </Label>
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
              <Label htmlFor="taux_tva">{t('product.form.vatRate')}</Label>
              <Input
                id="taux_tva"
                type="number"
                min="0"
                max="100"
                placeholder="20"
                value={formData.taux_tva}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unite">{t('product.form.unit')}</Label>
              <Select 
                value={formData.unite}
                onValueChange={(value) => handleSelectChange('unite', value)}
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
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              disabled={loading}
            >
              {t('product.form.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.saving')}
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t('product.form.save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
