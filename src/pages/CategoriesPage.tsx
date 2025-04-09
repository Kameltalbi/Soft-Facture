
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { FileExcel, FileCsv } from "@/components/ui/custom-icons";
import { CategoriesManager } from "@/components/produits/CategoriesManager";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Categorie } from "@/types";
import { Loader2 } from "lucide-react";

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [openCategoriesModal, setOpenCategoriesModal] = useState<boolean>(false);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('nom');
      
      console.log('Categories fetched:', data);
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(t('category.loadError', 'Error loading categories'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
      toast.error(t('import.error.invalidFormat', 'Only Excel (.xlsx) or CSV files are supported'));
      return;
    }

    // Here you would typically process the file
    // For demo purposes, we'll just show a success toast
    toast.success(t('import.success', 'File imported successfully'));
    setImportDialogOpen(false);
    
    // Reset the input
    event.target.value = '';
  };

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
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                {t('common.import')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('import.categories.title', 'Import Categories')}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="mb-4">{t('import.categories.description', 'Select an Excel (.xlsx) or CSV file to import categories.')}</p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <FileExcel className="w-10 h-10" />
                    <FileCsv className="w-10 h-10" />
                    <span>{t('import.supportedFormats', 'Supported formats: Excel & CSV')}</span>
                  </div>
                  <Input 
                    type="file" 
                    accept=".xlsx,.csv" 
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setOpenCategoriesModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('product.categories.add')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {categories.length > 0 ? (
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">{t('product.categories.categoryName')}</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b">
                      <td className="py-3 px-4">{category.nom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {t('product.categories.noCategories', 'No categories found. Create your first category.')}
            </div>
          )}
        </>
      )}

      <CategoriesManager
        open={openCategoriesModal}
        onOpenChange={setOpenCategoriesModal}
        categories={categories}
        onCategoriesChange={fetchCategories}
      />
    </MainLayout>
  );
};

export default CategoriesPage;
