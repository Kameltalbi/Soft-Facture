
import { useState } from "react";
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

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Categorie = {
        id: Date.now().toString(),
        nom: newCategoryName.trim(),
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
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

  const handleSaveEdit = (categoryId: string) => {
    if (editValue.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? { ...cat, nom: editValue.trim() } : cat
        )
      );
      setEditingCategory(null);
      setEditValue("");
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
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
              />
              <Button type="button" onClick={handleAddCategory}>
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
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {editingCategory === category.id ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
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
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCancelEdit}
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
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
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
            <Button onClick={() => onOpenChange(false)}>
              {t('product.categories.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
