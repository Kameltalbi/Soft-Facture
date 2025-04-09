
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Save, ArrowUpRight, X } from "lucide-react";
import { FilePdf } from "@/components/ui/custom-icons";
import { FactureSettingsPanel } from "./FactureSettingsPanel";
import { FactureModalProps } from "@/types";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";
import { StatutFacture } from "@/types";
import { FactureForm } from "./components/FactureForm";
import { FacturePreview } from "./components/FacturePreview";
import { getCurrencySymbol, getMontantEnLettresText } from "./utils/factureUtils";
import { toast } from "sonner";

export function FactureModal({
  open,
  onOpenChange,
  factureId,
}: FactureModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState(0);
  const [currency, setCurrency] = useState("TND");
  const [activeTab, setActiveTab] = useState("edition");
  const [isCreated, setIsCreated] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  
  const currencySymbol = getCurrencySymbol(currency);

  const isEditing = factureId !== null;

  // Lignes de produits avec ajout des nouveaux champs pour la TVA
  const [productLines, setProductLines] = useState([
    {
      id: "1",
      name: "Développement site web",
      quantity: 1,
      unitPrice: 1200,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true, // Par défaut, on utilise un taux de TVA
      discount: 0,
      total: 1200,
    },
  ]);

  const addProductLine = () => {
    const newLine = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true,
      discount: 0,
      total: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const removeProductLine = (id: string) => {
    setProductLines(productLines.filter((line) => line.id !== id));
  };

  // Handler for tax input changes
  const handleTaxChange = (id: string, value: number, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          tva: estTauxTVA ? value : line.tva,
          montantTVA: !estTauxTVA ? value : line.montantTVA,
          estTauxTVA: estTauxTVA
        };
      }
      return line;
    }));
  };

  // Handler for changing tax mode
  const handleTaxModeChange = (id: string, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          estTauxTVA,
          // Reset the value when changing modes to avoid confusion
          tva: estTauxTVA ? 20 : line.tva,
          montantTVA: !estTauxTVA ? 0 : line.montantTVA
        };
      }
      return line;
    }));
  };

  const subtotal = productLines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0
  );

  // Calculate TVA based on rate or fixed amount depending on the estTauxTVA flag
  const totalTVA = applyTVA
    ? productLines.reduce(
        (sum, line) => {
          if (line.estTauxTVA) {
            return sum + line.quantity * line.unitPrice * (line.tva / 100);
          } else {
            return sum + line.montantTVA;
          }
        },
        0
      )
    : 0;

  const totalTTC = subtotal + totalTVA;
  
  // Calculate the final amount due after subtracting advance payment
  const finalAmount = totalTTC - advancePaymentAmount;

  // Handle advance payment change
  const handleAdvancePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAdvancePaymentAmount(value > totalTTC ? totalTTC : value);
  };

  // Get the formatted text for the amount in words
  const montantEnLettresText = getMontantEnLettresText(
    totalTTC, 
    advancePaymentAmount, 
    finalAmount, 
    showAdvancePayment, 
    currency
  );

  // Generate a facture number
  const generateFactureNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FAC-${year}-${randomId}`;
  };

  // Handler for creating the invoice
  const handleCreate = () => {
    // Create the new invoice
    const newFacture = {
      id: isEditing ? factureId : Date.now().toString(),
      numero: isEditing ? "FAC2025-001" : generateFactureNumber(),
      client: "Entreprise ABC",
      date: new Date().toISOString(),
      montant: totalTTC,
      statut: "draft",
      products: productLines,
      currency: currency,
      subtotal: subtotal,
      totalTVA: totalTVA,
      totalTTC: totalTTC,
      montantEnLettresText: montantEnLettresText
    };

    setCurrentData(newFacture);
    setIsCreated(true);
    
    // Switch to preview tab
    setActiveTab("apercu");
    
    toast.success(isEditing ? "Facture modifiée avec succès" : "Facture créée avec succès");
  };

  // Handler for cancelling
  const handleCancel = () => {
    toast.info("La facture a été annulée");
    setIsCreated(false);
    onOpenChange(false);
  };

  // Handler for saving (without closing the modal)
  const handleSave = () => {
    toast.success("Facture enregistrée");
  };

  // Handler for downloading the invoice as PDF
  const handleDownloadPDF = () => {
    try {
      if (!currentData) {
        // If we're not in created state yet, construct the data
        const invoiceData = {
          id: factureId || "new",
          numero: isEditing ? "FAC2025-001" : "FAC2025-005",
          client: {
            id: "1",
            nom: "Entreprise ABC",
            email: "contact@abc.fr",
            adresse: "456 Avenue des Clients, 69002 Lyon, France"
          },
          dateCreation: new Date().toISOString(),
          dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
          totalTTC: totalTTC,
          statut: "brouillon" as StatutFacture,
          produits: productLines,
          applyTVA,
          showDiscount,
          currency
        };
        
        // Download the PDF
        downloadInvoiceAsPDF(invoiceData);
        return true;
      }
      
      // If created, use the current data
      const invoiceData = {
        id: currentData.id,
        numero: currentData.numero,
        client: {
          id: "client-id",
          nom: currentData.client,
          email: "client@example.com",
          adresse: "456 Avenue des Clients, 69002 Lyon, France"
        },
        dateCreation: currentData.date,
        dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        totalTTC: currentData.totalTTC,
        statut: "brouillon" as StatutFacture,
        produits: currentData.products,
        applyTVA: applyTVA,
        showDiscount: showDiscount,
        currency: currentData.currency
      };

      downloadInvoiceAsPDF(invoiceData);
      return true;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      toast.error("Erreur lors de la génération du PDF");
      return false;
    }
  };

  // Handler for downloading the PDF and closing the modal
  const handleDownloadAndClose = () => {
    const success = handleDownloadPDF();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {isEditing ? "Modifier la facture" : "Nouvelle facture"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? "Modifiez les détails de la facture existante"
              : "Créez une nouvelle facture pour un client"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? "Modifier la facture" : "Nouvelle facture"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Modifiez les détails de la facture existante"
                : "Créez une nouvelle facture pour un client"}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? (
              <X className="h-4 w-4" />
            ) : (
              <Settings className="h-4 w-4 text-red-600" />
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="edition">Édition</TabsTrigger>
                <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              </TabsList>
              <TabsContent value="edition">
                <FactureForm 
                  isEditing={isEditing}
                  productLines={productLines}
                  applyTVA={applyTVA}
                  showDiscount={showDiscount}
                  showAdvancePayment={showAdvancePayment}
                  advancePaymentAmount={advancePaymentAmount}
                  handleAdvancePaymentChange={handleAdvancePaymentChange}
                  currency={currency}
                  currencySymbol={currencySymbol}
                  subtotal={subtotal}
                  totalTVA={totalTVA}
                  totalTTC={totalTTC}
                  finalAmount={finalAmount}
                  onAddProductLine={addProductLine}
                  onRemoveProductLine={removeProductLine}
                  onTaxChange={handleTaxChange}
                  onTaxModeChange={handleTaxModeChange}
                />
                
                {!isCreated && (
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreate}>
                      Créer
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="apercu" className="mt-4">
                <FacturePreview 
                  productLines={productLines}
                  applyTVA={applyTVA}
                  showDiscount={showDiscount}
                  showAdvancePayment={showAdvancePayment}
                  advancePaymentAmount={advancePaymentAmount}
                  currency={currency}
                  subtotal={subtotal}
                  totalTVA={totalTVA}
                  totalTTC={totalTTC}
                  finalAmount={finalAmount}
                  montantEnLettresText={montantEnLettresText}
                  isCreated={isCreated}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  onDownload={handleDownloadAndClose}
                />
              </TabsContent>
            </Tabs>
          </div>

          {showSettings && (
            <FactureSettingsPanel
              applyTVA={applyTVA}
              setApplyTVA={setApplyTVA}
              showDiscount={showDiscount}
              setShowDiscount={setShowDiscount}
              showAdvancePayment={showAdvancePayment}
              setShowAdvancePayment={setShowAdvancePayment}
              currency={currency}
              setCurrency={setCurrency}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
