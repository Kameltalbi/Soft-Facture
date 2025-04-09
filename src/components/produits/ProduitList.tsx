
import { useTranslation } from "react-i18next";
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
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

// Product and category types for the demo data
interface Produit {
  id: string;
  nom: string;
  categorie: { id: string; nom: string };
  prix: number;
  tauxTVA: number;
  description?: string;
}

interface ProduitListProps {
  produits: Produit[];
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

export const ProduitList = ({ produits, onEdit, onRefresh }: ProduitListProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('id', productToDelete);
      
      if (error) throw error;
      
      toast({
        title: t('product.deleted'),
        description: t('product.deleteSuccess'),
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: t('common.error'),
        description: t('product.deleteError'),
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
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
          {produits.length > 0 ? (
            produits.map((produit) => (
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
                        onClick={() => onEdit(produit.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('product.table.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(produit.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('product.table.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                {t('product.noProducts')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('product.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('product.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
