
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { StatutFacture } from "@/types";
import { DevisModal } from "@/components/devis/DevisModal";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";
import { DevisHeader } from "@/components/devis/DevisHeader";
import { DevisTable } from "@/components/devis/DevisTable";
import { DevisDialogs } from "@/components/devis/DevisDialogs";
import { devisDemo } from "@/components/devis/DevisData";

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

  return (
    <MainLayout title={t("common.quotes")}>
      <DevisHeader onCreateDevis={handleCreateDevis} />
      
      <DevisTable 
        devisList={devisDataList}
        onEdit={handleEditDevis}
        onCancel={handleCancelDevis}
        onValidate={handleValidateDevis}
        onConvert={handleConvertToInvoice}
        onDownload={handleDownloadDevis}
      />

      <DevisModal
        open={openModal}
        onOpenChange={setOpenModal}
        devisId={selectedDevis}
      />

      <DevisDialogs
        openCancelDialog={openCancelDialog}
        setOpenCancelDialog={setOpenCancelDialog}
        openValidateDialog={openValidateDialog}
        setOpenValidateDialog={setOpenValidateDialog}
        openConvertDialog={openConvertDialog}
        setOpenConvertDialog={setOpenConvertDialog}
        confirmCancelDevis={confirmCancelDevis}
        confirmValidateDevis={confirmValidateDevis}
        confirmConvertToInvoice={confirmConvertToInvoice}
      />
    </MainLayout>
  );
};

export default DevisPage;
