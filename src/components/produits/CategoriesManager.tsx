
import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('categories')
        .insert({ nom: newCategoryName.trim() });
      
      if (error) throw error;
      
      toast({
        title: t('category.created'),
        description: t('category.createSuccess'),
      });
      
      setNewCategoryName("");
      onCategoriesChange();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: t('common.error'),
        description: t('category.createError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (category: Categorie) => {
    setEditingCategory(category.id);
    setEditValue(category.nom);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditValue("");
  };

  const handleSaveEdit = async (categoryId: string) => {
    if (!editValue.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({ nom: editValue.trim() })
        .eq('id', categoryId);
      
      if (error) throw error;
      
      toast({
        title: t('category.updated'),
        description: t('category.updateSuccess'),
      });
      
      setEditingCategory(null);
      setEditValue("");
      onCategoriesChange();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: t('common.error'),
        description: t('category.updateError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsSubmitting(true);
    
    try {
      // Check if this category is used by any products
      const { data: productsWithCategory, error: checkError } = await supabase
        .from('produits')
        .select('id')
        .eq('categorie_id', categoryId);
      
      if (checkError) throw checkError;
      
      if (productsWithCategory && productsWithCategory.length > 0) {
        toast({
          title: t('category.cantDelete'),
          description: t('category.inUse'),
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      toast({
        title: t('category.deleted'),
        description: t('category.deleteSuccess'),
      });
      
      onCategoriesChange();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: t('common.error'),
        description: t('category.deleteError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('product.categories.title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newCategory">{t('product.categories.new')}</Label>
            <div className="flex space-x-2">
              <Input
                id="newCategory"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={t('product.categories.categoryNamePlaceholder')}
                disabled={isSubmitting}
              />
              <Button 
                type="button" 
                onClick={handleAddCategory}
                disabled={isSubmitting || !newCategoryName.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('product.categories.add')}
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('product.categories.categoryName')}</TableHead>
                  <TableHead className="w-[120px]">{t('product.categories.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {editingCategory === category.id ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            disabled={isSubmitting}
                          />
                        ) : (
                          category.nom
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {editingCategory === category.id ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSaveEdit(category.id)}
                                disabled={isSubmitting || !editValue.trim()}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStartEdit(category)}
                                disabled={isSubmitting}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={isSubmitting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      {t('product.categories.noCategories')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {t('product.categories.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
