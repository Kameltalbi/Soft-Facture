
import { useState } from "react";
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
  Download, 
  X, 
  CheckCircle, 
  CreditCard, 
  Search, 
  Plus, 
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";
import { FactureModal } from "@/components/factures/FactureModal";

// Données factices pour la démonstration
const demoFactures = [
  {
    id: 1,
    number: "FAC2025-001",
    client: "Entreprise ABC",
    date: "2025-03-01",
    dueDate: "2025-03-31",
    amount: 1250.00,
    status: "draft"
  },
  {
    id: 2,
    number: "FAC2025-002",
    client: "Société XYZ",
    date: "2025-03-05",
    dueDate: "2025-04-05",
    amount: 3680.50,
    status: "sent"
  },
  {
    id: 3,
    number: "FAC2025-003",
    client: "Client Particulier",
    date: "2025-03-10",
    dueDate: "2025-03-25",
    amount: 580.00,
    status: "paid"
  },
  {
    id: 4,
    number: "FAC2025-004",
    client: "Entreprise 123",
    date: "2025-02-15",
    dueDate: "2025-03-15",
    amount: 2340.00,
    status: "overdue"
  },
  {
    id: 5,
    number: "FAC2025-005",
    client: "Association DEF",
    date: "2025-03-20",
    dueDate: "2025-04-20",
    amount: 4500.00,
    status: "sent"
  }
];

const FacturesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<any>(null);
  const [modalAction, setModalAction] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  
  // This function would typically filter data based on the selected period
  const handlePeriodChange = (dateRange: DateRange) => {
    setSelectedPeriod(dateRange);
    // In a real app, you would fetch or filter invoices for this period here
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
  
  // Filter invoices based on search query and selected period
  const filteredFactures = demoFactures.filter(facture => {
    const matchesSearch = 
      facture.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facture.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In a real app, you would also filter by date range here
    const factureDate = new Date(facture.date);
    const isInSelectedPeriod = 
      factureDate >= selectedPeriod.from && 
      factureDate <= selectedPeriod.to;
    
    return matchesSearch && isInSelectedPeriod;
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
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-invoice-status-paid/10 text-invoice-status-paid";
      case "sent":
        return "bg-invoice-status-pending/10 text-invoice-status-pending";
      case "overdue":
        return "bg-invoice-status-overdue/10 text-invoice-status-overdue";
      case "draft":
        return "bg-invoice-status-draft/10 text-invoice-status-draft";
      case "cancelled":
        return "bg-invoice-status-cancelled/10 text-invoice-status-cancelled";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };
  
  const renderStatusText = (status: string) => {
    return t(`invoice.status_${status}`) || status;
  };
  
  return (
    <MainLayout title={t("invoice.title")}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("invoice.title")}
            </h1>
            {/* Subtitle removed as requested */}
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
            
            <PeriodSelector onPeriodChange={handlePeriodChange} />
            
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
              {filteredFactures.length === 0 ? (
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
                    <TableCell className="font-medium">{facture.number}</TableCell>
                    <TableCell>{facture.client}</TableCell>
                    <TableCell>{new Date(facture.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(facture.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{facture.amount.toFixed(2)} €</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(facture.status)}`}>
                        {renderStatusText(facture.status)}
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
                          onClick={() => openModal("download", facture)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.download")}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openModal("cancel", facture)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.cancel")}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openModal("validate", facture)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">{t("invoice.validate")}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openModal("pay", facture)}
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
          onOpenChange={setIsModalOpen}
          factureId={selectedFacture?.id || null}
        />
      )}
    </MainLayout>
  );
};

export default FacturesPage;
