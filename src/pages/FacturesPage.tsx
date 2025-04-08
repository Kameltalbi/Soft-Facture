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
  XCircle,
  CheckCircle,
  CreditCard
} from "lucide-react";
import { StatutFacture } from "@/types";
import { FactureModal } from "@/components/factures/FactureModal";
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

// Données fictives pour les factures
const facturesDemo = [
  {
    id: "1",
    numero: "FAC2025-001",
    client: { id: "1", nom: "Entreprise ABC", email: "contact@abc.fr" },
    dateCreation: "2025-04-01",
    dateEcheance: "2025-05-01",
    totalTTC: 1200,
    statut: "payee" as StatutFacture,
  },
  {
    id: "2",
    numero: "FAC2025-002",
    client: { id: "2", nom: "Société XYZ", email: "info@xyz.fr" },
    dateCreation: "2025-04-03",
    dateEcheance: "2025-05-03",
    totalTTC: 850,
    statut: "envoyee" as StatutFacture,
  },
  {
    id: "3",
    numero: "FAC2025-003",
    client: { id: "3", nom: "Consulting DEF", email: "contact@def.fr" },
    dateCreation: "2025-04-05",
    dateEcheance: "2025-05-05",
    totalTTC: 2100,
    statut: "brouillon" as StatutFacture,
  },
  {
    id: "4",
    numero: "FAC2025-004",
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

const FacturesPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedFacture, setSelectedFacture] = useState<string | null>(null);
  const [invoiceDataList, setInvoiceDataList] = useState(facturesDemo);
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [openValidateDialog, setOpenValidateDialog] = useState<boolean>(false);
  const [openPayDialog, setOpenPayDialog] = useState<boolean>(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState<string | null>(null);
  const [invoiceToValidate, setInvoiceToValidate] = useState<string | null>(null);
  const [invoiceToPay, setInvoiceToPay] = useState<string | null>(null);
  const currencySymbol = getCurrencySymbol("TND"); // Default to TND
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const handleCreateInvoice = () => {
    setSelectedFacture(null);
    setOpenModal(true);
  };

  const handleEditInvoice = (id: string) => {
    // Find the invoice to edit
    const factureToEdit = invoiceDataList.find(facture => facture.id === id);
    if (factureToEdit) {
      setSelectedFacture(id);
      setOpenModal(true);
      toast({
        title: t('invoice.edit_started'),
        description: t('invoice.edit_invoice_number', { number: factureToEdit.numero }),
      });
    }
  };

  const handleCancelInvoice = (id: string) => {
    setInvoiceToCancel(id);
    setOpenCancelDialog(true);
  };

  const handleValidateInvoice = (id: string) => {
    setInvoiceToValidate(id);
    setOpenValidateDialog(true);
  };

  const handlePayInvoice = (id: string) => {
    setInvoiceToPay(id);
    setOpenPayDialog(true);
  };

  const confirmCancelInvoice = () => {
    if (invoiceToCancel) {
      // Find the invoice to cancel
      const factureToCancel = invoiceDataList.find(facture => facture.id === invoiceToCancel);
      
      if (factureToCancel) {
        // Update the invoice status to cancelled
        const updatedInvoices = invoiceDataList.map(facture => 
          facture.id === invoiceToCancel 
            ? { ...facture, statut: 'annulee' as StatutFacture } 
            : facture
        );
        
        setInvoiceDataList(updatedInvoices);
        
        // Show success toast
        toast({
          title: t('invoice.cancel_started'),
          description: t('invoice.cancel_invoice_number', { number: factureToCancel.numero }),
        });
      }
      
      // Close the dialog
      setOpenCancelDialog(false);
      setInvoiceToCancel(null);
    }
  };

  const confirmValidateInvoice = () => {
    if (invoiceToValidate) {
      // Find the invoice to validate
      const factureToValidate = invoiceDataList.find(facture => facture.id === invoiceToValidate);
      
      if (factureToValidate) {
        // Update the invoice status to paid
        const updatedInvoices = invoiceDataList.map(facture => 
          facture.id === invoiceToValidate 
            ? { ...facture, statut: 'payee' as StatutFacture } 
            : facture
        );
        
        setInvoiceDataList(updatedInvoices);
        
        // Show success toast
        toast({
          title: t('invoice.validate_started'),
          description: t('invoice.validate_invoice_number', { number: factureToValidate.numero }),
        });
      }
      
      // Close the dialog
      setOpenValidateDialog(false);
      setInvoiceToValidate(null);
    }
  };

  const confirmPayInvoice = () => {
    if (invoiceToPay) {
      // Find the invoice to pay
      const factureToPay = invoiceDataList.find(facture => facture.id === invoiceToPay);
      
      if (factureToPay) {
        // Update the invoice status to paid
        const updatedInvoices = invoiceDataList.map(facture => 
          facture.id === invoiceToPay 
            ? { ...facture, statut: 'payee' as StatutFacture } 
            : facture
        );
        
        setInvoiceDataList(updatedInvoices);
        
        // Show success toast
        toast({
          title: t('invoice.pay_started'),
          description: t('invoice.pay_invoice_number', { number: factureToPay.numero }),
        });
      }
      
      // Close the dialog
      setOpenPayDialog(false);
      setInvoiceToPay(null);
    }
  };

  const handleDownloadInvoice = (id: string) => {
    // Find the invoice to download
    const factureToDownload = invoiceDataList.find(facture => facture.id === id);
    
    if (factureToDownload) {
      // Download the invoice as PDF
      downloadInvoiceAsPDF(factureToDownload, i18n.language);
      
      // Show success toast
      toast({
        title: t('invoice.download_started'),
        description: t('invoice.download_invoice_number', { number: factureToDownload.numero }),
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
        return t('invoice.status_paid');
      case "envoyee":
        return t('invoice.status_sent');
      case "retard":
        return t('invoice.status_overdue');
      case "brouillon":
        return t('invoice.status_draft');
      case "annulee":
        return t('invoice.status_cancelled');
      default:
        return t('invoice.status_unknown');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US').format(date);
  };

  return (
    <MainLayout title={t('common.invoices')}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t('invoice.title')}</h2>
          <p className="text-muted-foreground">
            {t('invoice.subtitle')}
          </p>
        </div>
        <Button className="flex items-center" onClick={handleCreateInvoice}>
          <Plus className="mr-2 h-4 w-4" />
          {t('invoice.new')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('invoice.list')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder={t('invoice.search')}
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
                <TableHead>{t('invoice.number')}</TableHead>
                <TableHead>{t('invoice.client')}</TableHead>
                <TableHead>{t('invoice.date')}</TableHead>
                <TableHead>{t('invoice.dueDate')}</TableHead>
                <TableHead className="text-right">{t('invoice.amount')}</TableHead>
                <TableHead>{t('invoice.status')}</TableHead>
                <TableHead className="text-right">{t('invoice.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceDataList.map((facture) => (
                <TableRow key={facture.id}>
                  <TableCell className="font-medium">{facture.numero}</TableCell>
                  <TableCell>{facture.client.nom}</TableCell>
                  <TableCell>
                    {formatDate(facture.dateCreation)}
                  </TableCell>
                  <TableCell>
                    {formatDate(facture.dateEcheance)}
                  </TableCell>
                  <TableCell className="text-right">
                    {facture.totalTTC.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} {currencySymbol}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        facture.statut
                      )}`}
                    >
                      {getStatusLabel(facture.statut)}
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
                        {facture.statut !== 'annulee' && facture.statut !== 'payee' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleEditInvoice(facture.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t('invoice.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('invoice.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDownloadInvoice(facture.id)}
                            >
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              {t('invoice.download')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              {t('invoice.print')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handlePayInvoice(facture.id)}
                              className="text-invoice-status-paid"
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              {t('invoice.pay')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleValidateInvoice(facture.id)}
                              className="text-invoice-status-paid"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t('invoice.validate')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleCancelInvoice(facture.id)}
                              className="text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {t('invoice.cancel')}
                            </DropdownMenuItem>
                          </>
                        )}
                        {facture.statut === 'payee' && (
                          <>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('invoice.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDownloadInvoice(facture.id)}
                            >
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              {t('invoice.download')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              {t('invoice.print')}
                            </DropdownMenuItem>
                          </>
                        )}
                        {facture.statut === 'annulee' && (
                          <>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('invoice.view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDownloadInvoice(facture.id)}
                            >
                              <DownloadCloud className="mr-2 h-4 w-4" />
                              {t('invoice.download')}
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('invoice.delete')}
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

      <FactureModal
        open={openModal}
        onOpenChange={setOpenModal}
        factureId={selectedFacture}
      />

      <AlertDialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('invoice.cancel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('invoice.cancel_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelInvoice}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('invoice.cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openValidateDialog} onOpenChange={setOpenValidateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('invoice.validate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('invoice.validate_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmValidateInvoice}
              className="bg-invoice-status-paid hover:bg-invoice-status-paid/90"
            >
              {t('invoice.validate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openPayDialog} onOpenChange={setOpenPayDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('invoice.pay')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('invoice.pay_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPayInvoice}
              className="bg-invoice-status-paid hover:bg-invoice-status-paid/90"
            >
              {t('invoice.pay')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default FacturesPage;
