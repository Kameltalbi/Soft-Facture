
import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { ProduitFormModal } from "@/components/produits/ProduitFormModal";
import { CategoriesManager } from "@/components/produits/CategoriesManager";

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
  const [openProduitModal, setOpenProduitModal] = useState<boolean>(false);
  const [selectedProduit, setSelectedProduit] = useState<string | null>(null);
  const [openCategoriesModal, setOpenCategoriesModal] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleCreateProduit = () => {
    setSelectedProduit(null);
    setOpenProduitModal(true);
  };

  const handleEditProduit = (id: string) => {
    setSelectedProduit(id);
    setOpenProduitModal(true);
  };

  // Filtrer les produits par catégorie
  const filteredProduits = activeCategory === "all"
    ? produitsDemo
    : produitsDemo.filter(product => product.categorie.id === activeCategory);

  return (
    <MainLayout title="Produits et Services">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Produits et Services
          </h2>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et services.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpenCategoriesModal(true)}
          >
            Gérer les catégories
          </Button>
          <Button onClick={handleCreateProduit}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Catalogue</CardTitle>
              <Input
                placeholder="Rechercher un produit..."
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <div className="px-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              {categoriesDemo.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.nom}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <CardContent>
            <TabsContent value={activeCategory} forceMount>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Prix unitaire</TableHead>
                    <TableHead className="text-right">TVA (%)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProduits.map((produit) => (
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
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <ProduitFormModal
        open={openProduitModal}
        onOpenChange={setOpenProduitModal}
        produitId={selectedProduit}
        categories={categoriesDemo}
      />

      <CategoriesManager
        open={openCategoriesModal}
        onOpenChange={setOpenCategoriesModal}
        categories={categoriesDemo}
      />
    </MainLayout>
  );
};

export default ProduitsPage;
