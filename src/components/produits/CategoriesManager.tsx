
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { Categorie } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CategoriesManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Categorie[];
  onCategoriesChange: () => void;
}

export function CategoriesManager({
  open,
  onOpenChange,
  categories,
  onCategoriesChange,
}: CategoriesManagerProps) {
  const { t } = useTranslation();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  // Add a new category
  const handleAddCategory = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('Adding new category:', newCategoryName);
      const { error } = await supabase
        .from('categories')
        .insert({ nom: newCategoryName.trim() });
      
      if (error) throw error;
      
      console.log('Category added successfully');
      toast.success(t('category.created'), {
        description: t('category.createSuccess')
      });
      
      setNewCategoryName("");
      onCategoriesChange();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(t('category.createError'), {
        description: t('errors.try_again')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing a category
  const handleEditStart = (category: Categorie) => {
    setEditingCategory(category.id);
    setEditValue(category.nom);
  };

  // Save the edited category
  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({ nom: editValue.trim() })
        .eq('id', editingCategory);
      
      if (error) throw error;
      
      toast.success(t('category.updated'), {
        description: t('category.updateSuccess')
      });
      
      setEditingCategory(null);
      onCategoriesChange();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(t('category.updateError'), {
        description: t('errors.try_again')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  // Confirm category deletion
  const handleConfirmDelete = async (id: string) => {
    setDeletingCategory(id);
    
    try {
      // Check if any products use this category
      const { data: products } = await supabase
        .from('produits')
        .select('id')
        .eq('categorie_id', id)
        .limit(1);
      
      if (products && products.length > 0) {
        toast.error(t('category.deleteError'), {
          description: t('category.inUseError')
        });
        return;
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(t('category.deleted'), {
        description: t('category.deleteSuccess')
      });
      
      onCategoriesChange();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(t('category.deleteError'), {
        description: t('errors.try_again')
      });
    } finally {
      setDeletingCategory(null);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('product.categories.manage')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex space-x-2">
            <Input
              placeholder={t('product.categories.newCategoryPlaceholder')}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddCategory} 
              disabled={!newCategoryName.trim() || isSubmitting}
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('common.add')}
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('product.categories.categoryName')}</TableHead>
                <TableHead className="w-24 text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                    {t('product.categories.noCategories')}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {editingCategory === category.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        category.nom
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingCategory === category.id ? (
                        <div className="flex space-x-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSaveEdit}
                            disabled={!editValue.trim() || isSubmitting}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStart(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleConfirmDelete(category.id)}
                            disabled={deletingCategory === category.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
