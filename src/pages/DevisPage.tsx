
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
  Filter,
  MoreHorizontal,
  Plus,
  Trash2,
  XCircle,
  CheckCircle,
  FilePlus
} from "lucide-react";
import { StatutFacture } from "@/types";
import { DevisModal } from "@/components/devis/DevisModal";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";

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
  const [devisDataList, setDevisDataList] = useState(devisDemo);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [openValidateDialog, setOpenValidateDialog] = useState<boolean>(false);
  const [openConvertDialog, setOpenConvertDialog] = useState<boolean>(false);
  const [devisToCancel, setDevisToCancel] = useState<string | null>(null);
  const [devisToValidate, setDevisToValidate] = useState<string | null>(null);
  const [devisToConvert, setDevisToConvert] = useState<string | null>(null);
  const currencySymbol = getCurrencySymbol("TND"); // Default to TND
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const handleCreateDevis = () => {
    setSelectedDevis(null);
    setOpenModal(true);
  };

  const handleEditDevis = (id: string) => {
    // Find the quote to edit
    const devisToEdit = devisDataList.find(devis => devis.id === id);
    if (devisToEdit) {
      setSelectedDevis(id);
      setOpenModal(true);
      toast({
        title: t('quote.edit_started'),
        description: t('quote.edit_invoice_number', { number: devisToEdit.numero }),
      });
    }
  };

  const handleCancelDevis = (id: string) => {
    setDevisToCancel(id);
    setOpenCancelDialog(true);
  };

  const handleValidateDevis = (id: string) => {
    setDevisToValidate(id);
    setOpenValidateDialog(true);
  };

  const handleConvertToInvoice = (id: string) => {
    setDevisToConvert(id);
    setOpenConvertDialog(true);
  };

  const confirmCancelDevis = () => {
    if (devisToCancel) {
      // Find the quote to cancel
      const devisToCancel = devisDataList.find(devis => devis.id === devisToCancel);
      
      if (devisToCancel) {
        // Update the quote status to cancelled
        const updatedDevis = devisDataList.map(devis => 
          devis.id === devisToCancel 
            ? { ...devis, statut: 'annulee' as StatutFacture } 
            : devis
        );
        
        setDevisDataList(updatedDevis);
        
        // Show success toast
        toast({
          title: t('quote.cancel_started'),
          description: t('quote.cancel_quote_number', { number: devisToCancel.numero }),
        });
      }
      
      // Close the dialog
      setOpenCancelDialog(false);
      setDevisToCancel(null);
    }
  };

  const confirmValidateDevis = () => {
    if (devisToValidate) {
      // Find the quote to validate
      const devisToValidate = devisDataList.find(devis => devis.id === devisToValidate);
      
      if (devisToValidate) {
        // Update the quote status to paid
        const updatedDevis = devisDataList.map(devis => 
          devis.id === devisToValidate 
            ? { ...devis, statut: 'payee' as StatutFacture } 
            : devis
        );
        
        setDevisDataList(updatedDevis);
        
        // Show success toast
        toast({
          title: t('quote.validate_started'),
          description: t('quote.validate_quote_number', { number: devisToValidate.numero }),
        });
      }
      
      // Close the dialog
      setOpenValidateDialog(false);
      setDevisToValidate(null);
    }
  };

  const confirmConvertToInvoice = () => {
    if (devisToConvert) {
      // Find the quote to convert
      const devisToConvert = devisDataList.find(devis => devis.id === devisToConvert);
      
      if (devisToConvert) {
        // In a real application, we would create a new invoice based on the quote data
        // For this demo, we just show a success message
        
        // Show success toast
        toast({
          title: t('quote.convert_started'),
          description: t('quote.convert_quote_number', { number: devisToConvert.numero }),
        });
      }
      
      // Close the dialog
      setOpenConvertDialog(false);
      setDevisToConvert(null);
    }
  };

  const handleDownloadDevis = (id: string) => {
    // Find the quote to download
    const devisToDownload = devisDataList.find(devis => devis.id === id);
    
    if (devisToDownload) {
      // Download the quote as PDF
      // Note: Using the same function as invoices, in a real app we might want a specific function for quotes
      downloadInvoiceAsPDF(devisToDownload, i18n.language);
      
      // Show success toast
      toast({
        title: t('quote.download_started'),
        description: t('quote.download_quote_number', { number: devisToDownload.numero }),
      });
    }
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
      case "annulee":
        return "bg-destructive/10 text-destructive";
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
      case "annulee":
        return t("quote.status_cancelled");
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
              {devisDataList.map((devis) => (
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
                        {devis.statut !== 'annulee' && devis.statut !== 'payee' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleEditDevis(devis.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t('quote.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDownloadDevis(devis.id)}
                            >
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              {t('quote.download')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleConvertToInvoice(devis.id)}
                              className="text-blue-600"
                            >
                              <FilePlus className="mr-2 h-4 w-4" />
                              {t('quote.convert_to_invoice')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleValidateDevis(devis.id)}
                              className="text-invoice-status-paid"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t('quote.validate')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleCancelDevis(devis.id)}
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {t('quote.cancel')}
                            </DropdownMenuItem>
                          </>
                        )}
                        {devis.statut === 'payee' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleDownloadDevis(devis.id)}
                            >
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              {t('quote.download')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleConvertToInvoice(devis.id)}
                              className="text-blue-600"
                            >
                              <FilePlus className="mr-2 h-4 w-4" />
                              {t('quote.convert_to_invoice')}
                            </DropdownMenuItem>
                          </>
                        )}
                        {devis.statut === 'annulee' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleDownloadDevis(devis.id)}
                            >
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              {t('quote.download')}
                            </DropdownMenuItem>
                          </>
                        )}
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

      <DevisModal
        open={openModal}
        onOpenChange={setOpenModal}
        devisId={selectedDevis}
      />

      <AlertDialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.cancel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.cancel_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelDevis}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('quote.cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openValidateDialog} onOpenChange={setOpenValidateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.validate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.validate_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmValidateDevis}
              className="bg-invoice-status-paid hover:bg-invoice-status-paid/90"
            >
              {t('quote.validate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openConvertDialog} onOpenChange={setOpenConvertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.convert_to_invoice')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.convert_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmConvertToInvoice}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('quote.convert')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default DevisPage;
