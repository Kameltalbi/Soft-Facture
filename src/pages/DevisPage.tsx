
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { DevisHeader } from "@/components/devis/DevisHeader";
import { DevisTable } from "@/components/devis/DevisTable";
import { DevisDialogs } from "@/components/devis/DevisDialogs";
import { DevisModal } from "@/components/devis/DevisModal";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Import the demo data correctly
import { devisData } from "@/components/devis/DevisData";

const DevisPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAction, setCurrentAction] = useState("");
  const [selectedDevis, setSelectedDevis] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevisId, setSelectedDevisId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  
  // This function would typically filter data based on the selected period
  const handlePeriodChange = (dateRange: DateRange) => {
    setSelectedPeriod(dateRange);
    // In a real app, you would fetch or filter quotes for this period here
    console.log("Filtering quotes for period:", dateRange);
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
  
  // Filter quotes based on search query and selected period
  const filteredDevis = devisData.filter(devis => {
    const matchesSearch = 
      devis.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      devis.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In a real app, you would also filter by date range here
    const devisDate = new Date(devis.date);
    const isInSelectedPeriod = 
      devisDate >= selectedPeriod.from && 
      devisDate <= selectedPeriod.to;
    
    return matchesSearch && isInSelectedPeriod;
  });
  
  const handleActionClick = (action: string, devis?: any) => {
    setCurrentAction(action);
    setSelectedDevis(devis || null);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDevis(null);
    setCurrentAction("");
  };

  // Open modal for creating new devis
  const handleNewDevis = () => {
    setSelectedDevisId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing devis
  const handleEditDevis = (id: string) => {
    setSelectedDevisId(id);
    setIsModalOpen(true);
  };

  // Map actions to handler functions for DevisTable
  const handleEdit = (id: string) => handleEditDevis(id);
  const handleCancel = (id: string) => handleActionClick("cancel", filteredDevis.find(d => d.id.toString() === id));
  const handleValidate = (id: string) => handleActionClick("validate", filteredDevis.find(d => d.id.toString() === id));
  const handleConvert = (id: string) => handleActionClick("convert", filteredDevis.find(d => d.id.toString() === id));
  const handleDownload = (id: string) => handleActionClick("download", filteredDevis.find(d => d.id.toString() === id));
  
  return (
    <MainLayout title="quote.title">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <DevisHeader 
            onCreateDevis={handleNewDevis} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
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
        </div>
        
        <DevisTable 
          devisList={filteredDevis} 
          onEdit={handleEdit}
          onCancel={handleCancel}
          onValidate={handleValidate}
          onConvert={handleConvert}
          onDownload={handleDownload}
        />
        
        <DevisDialogs 
          isOpen={isDialogOpen}
          action={currentAction}
          devis={selectedDevis}
          onClose={handleCloseDialog}
        />

        <DevisModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          devisId={selectedDevisId}
        />
      </div>
    </MainLayout>
  );
};

export default DevisPage;
