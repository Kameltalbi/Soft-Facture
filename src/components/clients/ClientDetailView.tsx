
import { useState } from "react";
import { Client } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadCloud, Edit, MoreHorizontal, Trash2, XCircle, CheckCircle, CreditCard } from "lucide-react";
import { FilePdf } from "@/components/ui/custom-icons";
import { StatutFacture } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";

// Import from demo data
import { devisDemo } from "../devis/DevisData";

// Demo data for invoices
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

interface ClientDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ClientDetailView({
  open,
  onOpenChange,
  client,
}: ClientDetailViewProps) {
  const { t, i18n } = useTranslation();
  const currencySymbol = "€"; // Default to Euro

  // Filter invoices for this client
  const clientInvoices = client 
    ? facturesDemo.filter((invoice) => invoice.client.id === client.id)
    : [];

  // Calculate total revenue
  const totalRevenue = clientInvoices.reduce((sum, invoice) => {
    return sum + invoice.totalTTC;
  }, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language === 'fr' ? 'fr-FR' : 'en-US').format(date);
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

  // Handler for downloading the invoice as PDF
  const handleDownloadPDF = (invoice: any) => {
    // Construct invoice data for PDF generation
    const invoiceData = {
      id: invoice.id,
      numero: invoice.numero,
      client: {
        id: client?.id || "1",
        nom: client?.nom || "Client",
        email: client?.email || "email@client.fr",
      },
      dateCreation: invoice.dateCreation,
      dateEcheance: invoice.dateEcheance,
      totalTTC: invoice.totalTTC,
      statut: invoice.statut,
    };
    
    // Download the PDF
    downloadInvoiceAsPDF(invoiceData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {client && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {client.nom}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('client.information')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.form.company')}</p>
                      <p>{client.societe || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.form.email')}</p>
                      <p>{client.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.form.phone')}</p>
                      <p>{client.telephone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.form.vat')}</p>
                      <p>{client.tva || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('client.form.address')}</p>
                    <p>{client.adresse || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('client.summary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.invoices_count')}</p>
                      <p className="text-xl font-bold">{clientInvoices.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.total_revenue')}</p>
                      <p className="text-xl font-bold text-invoice-status-paid">
                        {totalRevenue.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} {currencySymbol}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.first_invoice')}</p>
                      <p>
                        {clientInvoices.length > 0
                          ? formatDate(clientInvoices.sort((a, b) => 
                              new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime()
                            )[0].dateCreation)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t('client.last_invoice')}</p>
                      <p>
                        {clientInvoices.length > 0
                          ? formatDate(clientInvoices.sort((a, b) => 
                              new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
                            )[0].dateCreation)
                          : "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="invoices">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="invoices">{t('common.invoices')}</TabsTrigger>
                <TabsTrigger value="quotes">{t('common.quotes')}</TabsTrigger>
              </TabsList>
              <TabsContent value="invoices" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('client.invoices')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {clientInvoices.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('invoice.number')}</TableHead>
                            <TableHead>{t('invoice.date')}</TableHead>
                            <TableHead>{t('invoice.dueDate')}</TableHead>
                            <TableHead className="text-right">{t('invoice.amount')}</TableHead>
                            <TableHead>{t('invoice.status')}</TableHead>
                            <TableHead className="text-right">{t('invoice.actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-medium">{invoice.numero}</TableCell>
                              <TableCell>{formatDate(invoice.dateCreation)}</TableCell>
                              <TableCell>{formatDate(invoice.dateEcheance)}</TableCell>
                              <TableCell className="text-right">
                                {invoice.totalTTC.toLocaleString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')} {currencySymbol}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                    invoice.statut
                                  )}`}
                                >
                                  {getStatusLabel(invoice.statut)}
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
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      {t('invoice.edit')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                                      <FilePdf className="mr-2 h-4 w-4" />
                                      {t('invoice.download')}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {t('client.no_invoices')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="quotes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('client.quotes')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      {t('client.no_quotes')}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.close')}
              </Button>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                {t('client.edit')}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
