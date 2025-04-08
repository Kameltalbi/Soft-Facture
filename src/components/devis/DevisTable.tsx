
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
        <CardTitle>{t("quote.list")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("quote.number")}</TableHead>
              <TableHead>{t("quote.client")}</TableHead>
              <TableHead>{t("quote.date")}</TableHead>
              <TableHead>{t("quote.amount")}</TableHead>
              <TableHead>{t("quote.status")}</TableHead>
              <TableHead className="text-right">{t("quote.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devisList.map((devis) => (
              <TableRow key={devis.id}>
                <TableCell className="font-medium">{devis.numero}</TableCell>
                <TableCell>{devis.client}</TableCell>
                <TableCell>{formatDate(devis.date)}</TableCell>
                <TableCell>{formatCurrency(devis.montant)} {currencySymbol}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    devis.statut === 'accepted' ? 'bg-invoice-status-paid/10 text-invoice-status-paid' :
                    devis.statut === 'rejected' ? 'bg-destructive/10 text-destructive' :
                    devis.statut === 'sent' ? 'bg-invoice-status-pending/10 text-invoice-status-pending' :
                    'bg-invoice-status-draft/10 text-invoice-status-draft'
                  }`}>
                    {t(`quote.status.${devis.statut}`)}
                  </span>
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
