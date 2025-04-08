
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { ProduitFormModal } from "@/components/produits/ProduitFormModal";
import { ProduitList } from "@/components/produits/ProduitList";
import { ProduitImportDialog } from "@/components/produits/ProduitImportDialog";
import { produitsDemo, categoriesDemo } from "@/components/produits/ProduitsData";

const ProduitsPage = () => {
  const { t } = useTranslation();
  const [openProduitModal, setOpenProduitModal] = useState<boolean>(false);
  const [selectedProduit, setSelectedProduit] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleCreateProduit = () => {
    setSelectedProduit(null);
    setOpenProduitModal(true);
  };

  const handleEditProduit = (id: string) => {
    setSelectedProduit(id);
    setOpenProduitModal(true);
  };

  const filteredProducts = searchTerm 
    ? produitsDemo.filter(p => 
        p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categorie.nom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : produitsDemo;

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
          <ProduitList 
            produits={filteredProducts} 
            onEdit={handleEditProduit} 
          />
        </CardContent>
      </Card>

      <ProduitFormModal
        open={openProduitModal}
        onOpenChange={setOpenProduitModal}
        produitId={selectedProduit}
        categories={categoriesDemo}
      />
    </MainLayout>
  );
};

export default ProduitsPage;
