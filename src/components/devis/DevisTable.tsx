
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  DownloadCloud,
  Edit,
  Filter,
  MoreHorizontal,
  Trash2,
  XCircle,
  CheckCircle,
  FilePlus
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case "TND":
      return "TND";
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "CHF":
      return "CHF";
    case "CAD":
      return "C$";
    default:
      return currency;
  }
};

interface DevisTableProps {
  devisList: any[];
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  onValidate: (id: string) => void;
  onConvert: (id: string) => void;
  onDownload: (id: string) => void;
}

export function DevisTable({
  devisList,
  onEdit,
  onCancel,
  onValidate,
  onConvert,
  onDownload
}: DevisTableProps) {
  const { t, i18n } = useTranslation();
  const currencySymbol = getCurrencySymbol("TND"); // Default to TND

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("quote.list")}</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder={t("quote.search")}
              className="max-w-sm"
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("quote.number")}</TableHead>
              <TableHead>{t("quote.client")}</TableHead>
              <TableHead>{t("quote.date")}</TableHead>
              <TableHead>{t("quote.dueDate")}</TableHead>
              <TableHead className="text-right">{t("quote.amount")}</TableHead>
              <TableHead className="text-right">{t("quote.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devisList.map((devis) => (
              <TableRow key={devis.id}>
                <TableCell className="font-medium">{devis.numero}</TableCell>
                <TableCell>{devis.client.nom}</TableCell>
                <TableCell>
                  {formatDate(devis.dateCreation)}
                </TableCell>
                <TableCell>
                  {formatDate(devis.dateEcheance)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(devis.totalTTC)} {currencySymbol}
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
                        onClick={() => onEdit(devis.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('quote.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDownload(devis.id)}
                      >
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        {t('quote.download')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onConvert(devis.id)}
                        className="text-blue-600"
                      >
                        <FilePlus className="mr-2 h-4 w-4" />
                        {t('quote.convert_to_invoice')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onValidate(devis.id)}
                        className="text-invoice-status-paid"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t('quote.validate')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onCancel(devis.id)}
                        className="text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {t('quote.cancel')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('quote.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
