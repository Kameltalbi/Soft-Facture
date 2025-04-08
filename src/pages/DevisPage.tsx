
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { DevisHeader } from "@/components/devis/DevisHeader";
import { DevisTable } from "@/components/devis/DevisTable";
import { DevisDialogs } from "@/components/devis/DevisDialogs";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";

// Import the demo data correctly
import { devisData } from "@/components/devis/DevisData";

const DevisPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAction, setCurrentAction] = useState("");
  const [selectedDevis, setSelectedDevis] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // Map actions to handler functions for DevisTable
  const handleEdit = (id: string) => handleActionClick("edit", filteredDevis.find(d => d.id.toString() === id));
  const handleCancel = (id: string) => handleActionClick("cancel", filteredDevis.find(d => d.id.toString() === id));
  const handleValidate = (id: string) => handleActionClick("validate", filteredDevis.find(d => d.id.toString() === id));
  const handleConvert = (id: string) => handleActionClick("convert", filteredDevis.find(d => d.id.toString() === id));
  const handleDownload = (id: string) => handleActionClick("download", filteredDevis.find(d => d.id.toString() === id));
  
  return (
    <MainLayout title="quote.title">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <DevisHeader 
            onCreateDevis={() => handleActionClick("create")} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <PeriodSelector onPeriodChange={handlePeriodChange} />
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
      </div>
    </MainLayout>
  );
};

export default DevisPage;
