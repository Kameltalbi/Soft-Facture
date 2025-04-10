
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { 
  Edit, 
  X, 
  CheckCircle, 
  CreditCard, 
  Search, 
  Plus, 
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react";
import { FilePdf } from "@/components/ui/custom-icons";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";
import { FactureModal } from "@/components/factures/FactureModal";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const FacturesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<any>(null);
  const [modalAction, setModalAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [factures, setFactures] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Premier jour du mois courant
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) // Dernier jour du mois courant
  });
  
  // Charger les factures depuis Supabase
  useEffect(() => {
    const fetchFactures = async () => {
      setLoading(true);
      
      try {
        // Convertir les dates en format ISO pour la requête
        const fromDate = selectedPeriod.from.toISOString();
        const toDate = selectedPeriod.to.toISOString();
        
        const { data, error } = await supabase
          .from('factures')
          .select('*')
          .gte('date_creation', fromDate)
          .lte('date_creation', toDate)
          .order('date_creation', { ascending: false });
          
        if (error) throw error;
        
        setFactures(data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des factures:", error);
        toast.error("Erreur lors du chargement des factures");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFactures();
  }, [selectedPeriod]);
  
  // This function would typically filter data based on the selected period
  const handlePeriodChange = (dateRange: DateRange) => {
    setSelectedPeriod(dateRange);
    console.log("Filtering invoices for period:", dateRange);
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newFrom = new Date(selectedPeriod.from);
    newFrom.setMonth(newFrom.getMonth() - 1);
    
    const newTo = new Date(newFrom);
    newTo.setMonth(newTo.getMonth() + 1);
    newTo.setDate(0); // Set to last day of month
    
    const newPeriod = { from: newFrom, to: newTo };
    setSelectedPeriod(newPeriod);
    handlePeriodChange(newPeriod);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    const newFrom = new Date(selectedPeriod.from);
    newFrom.setMonth(newFrom.getMonth() + 1);
    
    const newTo = new Date(newFrom);
    newTo.setMonth(newTo.getMonth() + 1);
    newTo.setDate(0); // Set to last day of month
    
    const newPeriod = { from: newFrom, to: newTo };
    setSelectedPeriod(newPeriod);
    handlePeriodChange(newPeriod);
  };
  
  // Filter invoices based on search query
  const filteredFactures = factures.filter(facture => {
    return (
      facture.numero?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facture.client_nom?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const openModal = (action: string, facture?: any) => {
    setModalAction(action);
    setSelectedFacture(facture || null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFacture(null);
    setModalAction("");
    
    // Rafraîchir la liste des factures
    const refreshFactures = async () => {
      setLoading(true);
      
      try {
        const fromDate = selectedPeriod.from.toISOString();
        const toDate = selectedPeriod.to.toISOString();
        
        const { data, error } = await supabase
          .from('factures')
          .select('*')
          .gte('date_creation', fromDate)
          .lte('date_creation', toDate)
          .order('date_creation', { ascending: false });
          
        if (error) throw error;
        
        setFactures(data || []);
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des factures:", error);
      } finally {
        setLoading(false);
      }
    };
    
    refreshFactures();
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
      case "payee":
        return "bg-invoice-status-paid/10 text-invoice-status-paid";
      case "sent":
      case "envoyee":
        return "bg-invoice-status-pending/10 text-invoice-status-pending";
      case "overdue":
      case "retard":
        return "bg-invoice-status-overdue/10 text-invoice-status-overdue";
      case "draft":
      case "brouillon":
        return "bg-invoice-status-draft/10 text-invoice-status-draft";
      case "cancelled":
      case "annulee":
        return "bg-invoice-status-cancelled/10 text-invoice-status-cancelled";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };
  
  const renderStatusText = (status: string) => {
    const statusKey = status.replace('-', '_');
    return t(`invoice.status_${statusKey}`) || status;
  };
  
  const handleDownloadPDF = async (facture: any) => {
    setLoading(true);
    
    try {
      // Récupérer les lignes de facture
      const { data: lignesFacture, error: lignesError } = await supabase
        .from('lignes_facture')
        .select('*')
        .eq('facture_id', facture.id);
        
      if (lignesError) throw lignesError;
      
      // Convertir les lignes de facture au format attendu par le PDF
      const productLines = lignesFacture?.map(line => ({
        name: line.nom,
        quantity: line.quantite,
        unitPrice: line.prix_unitaire,
        tva: line.taux_tva,
        montantTVA: line.montant_tva,
        estTauxTVA: line.est_taux_tva,
        discount: line.remise || 0,
        total: line.sous_total
      })) || [];
      
      // Construire les données pour la génération du PDF
      const invoiceData = {
        id: facture.id,
        numero: facture.numero,
        client: {
          id: facture.client_id || "1",
          nom: facture.client_nom || "Client",
          email: "contact@client.fr",
          adresse: facture.client_adresse
        },
        dateCreation: facture.date_creation,
        dateEcheance: facture.date_echeance,
        totalTTC: facture.total_ttc,
        statut: facture.statut,
        produits: productLines,
        applyTVA: facture.appliquer_tva !== false,
        showDiscount: !!facture.remise_globale,
        showAdvancePayment: !!facture.avance_percue,
        advancePaymentAmount: facture.avance_percue || 0,
        currency: facture.devise || "TND"
      };
      
      // Télécharger le PDF
      await downloadInvoiceAsPDF(invoiceData);
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF:", error);
      toast.error("Erreur lors du téléchargement du PDF");
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour mettre à jour le statut d'une facture
  const updateInvoiceStatus = async (factureId: string, newStatus: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('factures')
        .update({ statut: newStatus })
        .eq('id', factureId);
        
      if (error) throw error;
      
      // Mise à jour de l'état local
      setFactures(factures.map(facture => 
        facture.id === factureId 
          ? { ...facture, statut: newStatus } 
          : facture
      ));
      
      toast.success(`Statut de la facture mis à jour: ${renderStatusText(newStatus)}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout title={t("invoice.title")}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("invoice.title")}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <PeriodSelector 
              value={selectedPeriod}
              onChange={handlePeriodChange} 
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={() => openModal("new")} 
            className="ml-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("invoice.new")}
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("invoice.search")}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("invoice.number")}</TableHead>
                <TableHead>{t("invoice.client")}</TableHead>
                <TableHead>{t("invoice.date")}</TableHead>
                <TableHead>{t("invoice.dueDate")}</TableHead>
                <TableHead className="text-right">{t("invoice.amount")}</TableHead>
                <TableHead>{t("invoice.status")}</TableHead>
                <TableHead className="text-right">{t("invoice.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                      {t("common.loading")}
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredFactures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchQuery 
                      ? t("common.no_results") 
                      : t("invoice.no_invoices_period")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFactures.map((facture) => (
                  <TableRow key={facture.id}>
                    <TableCell className="font-medium">{facture.numero}</TableCell>
                    <TableCell>{facture.client_nom || "Client"}</TableCell>
                    <TableCell>{new Date(facture.date_creation).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(facture.date_echeance).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{facture.total_ttc.toFixed(2)} {facture.devise || "€"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(facture.statut)}`}>
                        {renderStatusText(facture.statut)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openModal("edit", facture)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.edit")}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDownloadPDF(facture)}
                        >
                          <FilePdf className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.download")}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => updateInvoiceStatus(facture.id, 'annulee')}
                          disabled={facture.statut === 'annulee'}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.cancel")}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => updateInvoiceStatus(facture.id, 'envoyee')}
                          disabled={facture.statut === 'payee' || facture.statut === 'annulee'}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.validate")}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => updateInvoiceStatus(facture.id, 'payee')}
                          disabled={facture.statut === 'annulee'}
                        >
                          <CreditCard className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.pay")}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {isModalOpen && (
        <FactureModal
          open={isModalOpen}
          onOpenChange={closeModal}
          factureId={selectedFacture?.id || null}
        />
      )}
    </MainLayout>
  );
};

export default FacturesPage;
