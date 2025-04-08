
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { DevisHeader } from "@/components/devis/DevisHeader";
import { DevisTable } from "@/components/devis/DevisTable";
import { DevisDialogs } from "@/components/devis/DevisDialogs";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";

// Import the demo data correctly
// Assuming DevisData is exported from DevisData.ts
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
          devis={filteredDevis} 
          onEditClick={(devis) => handleActionClick("edit", devis)}
          onDeleteClick={(devis) => handleActionClick("delete", devis)}
          onViewClick={(devis) => handleActionClick("view", devis)}
          onDownloadClick={(devis) => handleActionClick("download", devis)}
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
