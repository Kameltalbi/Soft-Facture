
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DownloadCloud,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Printer,
  Trash2,
} from "lucide-react";
import { StatutFacture } from "@/types";
import { DevisModal } from "@/components/devis/DevisModal";
import { useTranslation } from "react-i18next";

// Données fictives pour les devis
const devisDemo = [
  {
    id: "1",
    numero: "DEV2025-001",
    client: { id: "1", nom: "Entreprise ABC", email: "contact@abc.fr" },
    dateCreation: "2025-04-01",
    dateEcheance: "2025-05-01",
    totalTTC: 1200,
    statut: "payee" as StatutFacture,
  },
  {
    id: "2",
    numero: "DEV2025-002",
    client: { id: "2", nom: "Société XYZ", email: "info@xyz.fr" },
    dateCreation: "2025-04-03",
    dateEcheance: "2025-05-03",
    totalTTC: 850,
    statut: "envoyee" as StatutFacture,
  },
  {
    id: "3",
    numero: "DEV2025-003",
    client: { id: "3", nom: "Consulting DEF", email: "contact@def.fr" },
    dateCreation: "2025-04-05",
    dateEcheance: "2025-05-05",
    totalTTC: 2100,
    statut: "brouillon" as StatutFacture,
  },
  {
    id: "4",
    numero: "DEV2025-004",
    client: { id: "4", nom: "Studio Design", email: "hello@studio.fr" },
    dateCreation: "2025-03-15",
    dateEcheance: "2025-04-15",
    totalTTC: 950,
    statut: "retard" as StatutFacture,
  },
];

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

const DevisPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedDevis, setSelectedDevis] = useState<string | null>(null);
  const currencySymbol = getCurrencySymbol("TND"); // Default to TND
  const { t, i18n } = useTranslation();

  const handleCreateDevis = () => {
    setSelectedDevis(null);
    setOpenModal(true);
  };

  const handleEditDevis = (id: string) => {
    setSelectedDevis(id);
    setOpenModal(true);
  };

  const getStatusColor = (statut: StatutFacture) => {
    switch (statut) {
      case "payee":
        return "bg-invoice-status-paid/10 text-invoice-status-paid";
      case "envoyee":
        return "bg-invoice-status-pending/10 text-invoice-status-pending";
      case "retard":
        return "bg-invoice-status-overdue/10 text-invoice-status-overdue";
      case "brouillon":
        return "bg-invoice-status-draft/10 text-invoice-status-draft";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (statut: StatutFacture) => {
    switch (statut) {
      case "payee":
        return t("quote.status_paid");
      case "envoyee":
        return t("quote.status_sent");
      case "retard":
        return t("quote.status_overdue");
      case "brouillon":
        return t("quote.status_draft");
      default:
        return t("quote.status_unknown");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US');
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US');
  };

  return (
    <MainLayout title={t("common.quotes")}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t("quote.title")}</h2>
          <p className="text-muted-foreground">
            {t("quote.subtitle")}
          </p>
        </div>
        <Button className="flex items-center" onClick={handleCreateDevis}>
          <Plus className="mr-2 h-4 w-4" />
          {t("quote.new")}
        </Button>
      </div>

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
                <TableHead>{t("quote.status")}</TableHead>
                <TableHead className="text-right">{t("quote.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devisDemo.map((devis) => (
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
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        devis.statut
                      )}`}
                    >
                      {getStatusLabel(devis.statut)}
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
                          onClick={() => handleEditDevis(devis.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("quote.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("quote.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DownloadCloud className="mr-2 h-4 w-4" />
                          {t("quote.download")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          {t("quote.print")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("quote.delete")}
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

      <DevisModal
        open={openModal}
        onOpenChange={setOpenModal}
        devisId={selectedDevis}
      />
    </MainLayout>
  );
};

export default DevisPage;
