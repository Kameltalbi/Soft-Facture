import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Import, MoreHorizontal, Plus, Trash2, Tags } from "lucide-react";
import { ProduitFormModal } from "@/components/produits/ProduitFormModal";

// Données fictives pour les produits
const produitsDemo = [
  {
    id: "1",
    nom: "Développement site web",
    categorie: { id: "1", nom: "Services Web" },
    prix: 1200,
    tauxTVA: 20,
    description: "Conception et développement d'un site web responsive",
  },
  {
    id: "2",
    nom: "Logo et identité visuelle",
    categorie: { id: "2", nom: "Design" },
    prix: 450,
    tauxTVA: 20,
    description: "Création d'un logo et d'une charte graphique complète",
  },
  {
    id: "3",
    nom: "Maintenance mensuelle",
    categorie: { id: "1", nom: "Services Web" },
    prix: 80,
    tauxTVA: 20,
    description: "Service de maintenance et mise à jour mensuelle",
  },
  {
    id: "4",
    nom: "Hébergement Premium",
    categorie: { id: "3", nom: "Hébergement" },
    prix: 120,
    tauxTVA: 20,
    description: "Hébergement haute performance avec sauvegarde quotidienne",
  },
];

// Données fictives pour les catégories
const categoriesDemo = [
  { id: "1", nom: "Services Web" },
  { id: "2", nom: "Design" },
  { id: "3", nom: "Hébergement" },
  { id: "4", nom: "Marketing" },
];

const ProduitsPage = () => {
  const { t } = useTranslation();
  const [openProduitModal, setOpenProduitModal] = useState<boolean>(false);
  const [selectedProduit, setSelectedProduit] = useState<string | null>(null);

  const handleCreateProduit = () => {
    setSelectedProduit(null);
    setOpenProduitModal(true);
  };

  const handleEditProduit = (id: string) => {
    setSelectedProduit(id);
    setOpenProduitModal(true);
  };

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
          <Button variant="outline">
            <Import className="mr-2 h-4 w-4" />
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
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('product.table.name')}</TableHead>
                <TableHead>{t('product.table.category')}</TableHead>
                <TableHead className="text-right">{t('product.table.unitPrice')}</TableHead>
                <TableHead className="text-right">{t('product.table.vatRate')}</TableHead>
                <TableHead className="text-right">{t('product.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produitsDemo.map((produit) => (
                <TableRow key={produit.id}>
                  <TableCell className="font-medium">
                    <div>
                      {produit.nom}
                      {produit.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {produit.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{produit.categorie.nom}</TableCell>
                  <TableCell className="text-right">
                    {produit.prix.toLocaleString("fr-FR")} €
                  </TableCell>
                  <TableCell className="text-right">
                    {produit.tauxTVA}%
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditProduit(produit.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t('product.table.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('product.table.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
