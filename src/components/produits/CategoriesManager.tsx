
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
import { createCategory, updateCategory, deleteCategory } from "@/services/categorieService";

interface CategoriesManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Categorie[];
}

export function CategoriesManager({
  open,
  onOpenChange,
  categories: initialCategories,
}: CategoriesManagerProps) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Categorie[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Update local categories when prop changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      setLoading(true);
      const newCategory = await createCategory({ nom: newCategoryName.trim() });
      
      if (newCategory) {
        setCategories([...categories, newCategory]);
        setNewCategoryName("");
      }
      setLoading(false);
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
    if (editValue.trim()) {
      setLoading(true);
      const updatedCategory = await updateCategory(categoryId, editValue.trim());
      
      if (updatedCategory) {
        setCategories(
          categories.map((cat) =>
            cat.id === categoryId ? updatedCategory : cat
          )
        );
        setEditingCategory(null);
        setEditValue("");
      }
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm(t('product.categories.deleteConfirm'))) {
      setLoading(true);
      const success = await deleteCategory(categoryId);
      
      if (success) {
        setCategories(categories.filter((cat) => cat.id !== categoryId));
      }
      setLoading(false);
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
                disabled={loading}
              />
              <Button 
                type="button" 
                onClick={handleAddCategory}
                disabled={loading || !newCategoryName.trim()}
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
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
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
                            autoFocus
                            disabled={loading}
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
                                disabled={loading}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancelEdit}
                                disabled={loading}
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
                                disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)} disabled={loading}>
              {t('product.categories.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
