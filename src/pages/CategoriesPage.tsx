
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoriesManager } from "@/components/produits/CategoriesManager";

// Using the same demo categories from the Products page
const categoriesDemo = [
  { id: "1", nom: "Services Web" },
  { id: "2", nom: "Design" },
  { id: "3", nom: "Hébergement" },
  { id: "4", nom: "Marketing" },
];

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [openCategoriesModal, setOpenCategoriesModal] = useState<boolean>(true);

  return (
    <MainLayout title={t('product.categories.title')}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('product.categories.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('product.categories.subtitle', 'Manage your product categories')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setOpenCategoriesModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('product.categories.add')}
          </Button>
        </div>
      </div>

      <CategoriesManager
        open={openCategoriesModal}
        onOpenChange={setOpenCategoriesModal}
        categories={categoriesDemo}
      />
    </MainLayout>
  );
};

export default CategoriesPage;
