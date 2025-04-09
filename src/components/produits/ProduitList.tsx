
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
import { ProduitWithCategorie, deleteProduit } from "@/services/produitService";
import { toast } from "sonner";

interface ProduitListProps {
  produits: ProduitWithCategorie[];
  onEdit: (id: string) => void;
}

export const ProduitList = ({ produits, onEdit }: ProduitListProps) => {
  const { t } = useTranslation();

  const handleDelete = async (id: string) => {
    if (window.confirm(t('product.deleteConfirm'))) {
      const success = await deleteProduit(id);
      if (success) {
        toast.success(t('product.deleted'));
        // Refresh will be handled by parent component
      }
    }
  };

  return (
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
        {produits.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              {t('product.noProducts')}
            </TableCell>
          </TableRow>
        ) : (
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
        )}
      </TableBody>
    </Table>
  );
};
