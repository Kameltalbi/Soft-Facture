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
  Trash, 
  Search, 
  Plus, 
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";
import { BonDeSortieModal } from "@/components/bon-de-sortie/BonDeSortieModal";

const demoData = [
  {
    id: 1,
    number: "BDS2025-001",
    client: "Entreprise ABC",
    date: "2025-03-01",
    amount: 1250.00,
  },
  {
    id: 2,
    number: "BDS2025-002",
    client: "Société XYZ",
    date: "2025-03-05",
    amount: 3680.50,
  },
  {
    id: 3,
    number: "BDS2025-003",
    client: "Client Particulier",
    date: "2025-03-10",
    amount: 580.00,
  },
  {
    id: 4,
    number: "BDS2025-004",
    client: "Entreprise 123",
    date: "2025-02-15",
    amount: 2340.00,
  },
  {
    id: 5,
    number: "BDS2025-005",
    client: "Association DEF",
    date: "2025-03-20",
    amount: 4500.00,
  }
];

const BonDeSortiePage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    from: new Date(),
    to: new Date()
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBonDeSortieId, setSelectedBonDeSortieId] = useState<string | null>(null);
  
  // This function would typically filter data based on the selected period
  const handlePeriodChange = (dateRange: DateRange) => {
    setSelectedPeriod(dateRange);
    // In a real app, you would fetch or filter delivery notes for this period here
    console.log("Filtering delivery notes for period:", dateRange);
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

  // Open modal for creating new bon de sortie
  const handleNewBonDeSortie = () => {
    setSelectedBonDeSortieId(null);
    setModalOpen(true);
  };

  // Open modal for editing existing bon de sortie
  const handleEditBonDeSortie = (id: number) => {
    setSelectedBonDeSortieId(id.toString());
    setModalOpen(true);
  };
  
  // Filter delivery notes based on search query and selected period
  const filteredData = demoData.filter(item => {
    const matchesSearch = 
      item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In a real app, you would also filter by date range here
    const itemDate = new Date(item.date);
    const isInSelectedPeriod = 
      itemDate >= selectedPeriod.from && 
      itemDate <= selectedPeriod.to;
    
    return matchesSearch && isInSelectedPeriod;
  });

  return (
    <MainLayout title={t("common.bonDeSortie")}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("common.bonDeSortie")}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
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
        
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un bon de sortie..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={handleNewBonDeSortie}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau bon de sortie
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {searchQuery 
                      ? "Aucun résultat pour cette recherche" 
                      : "Aucun bon de sortie pour cette période"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.number}</TableCell>
                    <TableCell>{item.client}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{item.amount.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditBonDeSortie(item.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Télécharger</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
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
      
      <BonDeSortieModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        bonDeSortieId={selectedBonDeSortieId}
      />
    </MainLayout>
  );
};

export default BonDeSortiePage;
