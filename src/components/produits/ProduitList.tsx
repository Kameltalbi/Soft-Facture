
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
}

export const ProduitList = ({ produits, onEdit }: ProduitListProps) => {
  const { t } = useTranslation();

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
        {produits.map((produit) => (
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
  );
};
