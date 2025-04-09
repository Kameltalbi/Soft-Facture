
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ProduitFormModal } from "@/components/produits/ProduitFormModal";
import { ProduitList } from "@/components/produits/ProduitList";
import { ProduitImportDialog } from "@/components/produits/ProduitImportDialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Categorie } from "@/types";
import { getDefaultDeviseCode } from "@/utils/formatters";

interface Produit {
  id: string;
  nom: string;
  categorie: { id: string; nom: string };
  prix: number;
  tauxTVA: number;
  description?: string;
}

const ProduitsPage = () => {
  const { t } = useTranslation();
  const [openProduitModal, setOpenProduitModal] = useState<boolean>(false);
  const [selectedProduit, setSelectedProduit] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState(getDefaultDeviseCode());

  useEffect(() => {
    // Load the currency from localStorage
    const storedCurrency = localStorage.getItem('defaultCurrency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('nom');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('produits')
        .select(`
          id,
          nom,
          prix,
          taux_tva,
          description,
          categorie_id,
          categories(id, nom)
        `)
        .order('nom');
      
      if (error) throw error;

      // Transform data structure to match the expected format
      const formattedProducts: Produit[] = (data || []).map(item => ({
        id: item.id,
        nom: item.nom,
        prix: item.prix,
        tauxTVA: item.taux_tva,
        description: item.description,
        categorie: item.categories 
          ? { id: item.categories.id, nom: item.categories.nom } 
          : { id: '', nom: t('product.noCategory') }
      }));
      
      setProduits(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduit = () => {
    setSelectedProduit(null);
    setOpenProduitModal(true);
  };

  const handleEditProduit = (id: string) => {
    setSelectedProduit(id);
    setOpenProduitModal(true);
  };

  const handleRefresh = () => {
    fetchProducts();
    fetchCategories();
  };

  const filteredProducts = searchTerm 
    ? produits.filter(p => 
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categorie.nom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : produits;

  return (
    <MainLayout title={t('common.products')}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('common.products')}
          </h2>
          <p className="text-muted-foreground">
            {t('product.subtitle')}
          </p>
        </div>
        <div className="flex space-x-2">
          <ProduitImportDialog 
            open={importDialogOpen} 
            onOpenChange={setImportDialogOpen} 
          />
          <Button onClick={handleCreateProduit}>
            <Plus className="mr-2 h-4 w-4" />
            {t('product.new')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('product.list')}</CardTitle>
            <div className="flex space-x-2">
              <Input
                placeholder={t('product.search')}
                className="max-w-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProduitList 
              produits={filteredProducts} 
              onEdit={handleEditProduit}
              onRefresh={handleRefresh}
              currency={currency}
            />
          )}
        </CardContent>
      </Card>

      <ProduitFormModal
        open={openProduitModal}
        onOpenChange={setOpenProduitModal}
        produitId={selectedProduit}
        categories={categories}
        onSuccess={handleRefresh}
      />
    </MainLayout>
  );
};

export default ProduitsPage;
