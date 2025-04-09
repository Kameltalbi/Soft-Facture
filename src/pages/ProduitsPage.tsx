
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
import { fetchCategories } from "@/services/categorieService";
import { fetchProduits, ProduitWithCategorie } from "@/services/produitService";
import { Categorie } from "@/types";

const ProduitsPage = () => {
  const { t } = useTranslation();
  const [openProduitModal, setOpenProduitModal] = useState<boolean>(false);
  const [selectedProduit, setSelectedProduit] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [produits, setProduits] = useState<ProduitWithCategorie[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [produitsData, categoriesData] = await Promise.all([
        fetchProduits(),
        fetchCategories()
      ]);
      setProduits(produitsData);
      setCategories(categoriesData);
      setLoading(false);
    };
    
    loadData();
  }, [openProduitModal]); // Reload when modal is closed

  const handleCreateProduit = () => {
    setSelectedProduit(null);
    setOpenProduitModal(true);
  };

  const handleEditProduit = (id: string) => {
    setSelectedProduit(id);
    setOpenProduitModal(true);
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
          <Button 
            variant="outline" 
            onClick={() => setImportDialogOpen(true)}
          >
            {t('common.import')}
          </Button>
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
          {loading ? (
            <div className="py-8 text-center">{t('common.loading')}</div>
          ) : (
            <ProduitList 
              produits={filteredProducts} 
              onEdit={handleEditProduit} 
            />
          )}
        </CardContent>
      </Card>

      <ProduitImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />

      <ProduitFormModal
        open={openProduitModal}
        onOpenChange={setOpenProduitModal}
        produitId={selectedProduit}
        categories={categories}
      />
    </MainLayout>
  );
};

export default ProduitsPage;
