
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Save, ArrowUpRight, X } from "lucide-react";
import { BonDeSortieSettingsPanel } from "./BonDeSortieSettingsPanel";
import { toast } from "sonner";
import { BonDeSortieModalProps } from "@/types";
import { BonDeSortiePreview } from "./components/BonDeSortiePreview";
import { ProductLineEditor, ProductLine } from "./components/ProductLineEditor";
import { BonDeSortieForm } from "./components/BonDeSortieForm";
import { NotesSection } from "./components/NotesSection";
import { montantEnLettres } from "./utils/bonDeSortieUtils";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";

export function BonDeSortieModal({
  open,
  onOpenChange,
  bonDeSortieId,
}: BonDeSortieModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [currency, setCurrency] = useState("TND");
  const [isCreated, setIsCreated] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("edition");

  const isEditing = bonDeSortieId !== null;

  // Lignes de produits avec ajout des nouveaux champs pour la TVA
  const [productLines, setProductLines] = useState<ProductLine[]>([
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

  // Calculate totals when product lines change
  useEffect(() => {
    const updatedLines = productLines.map(line => {
      const lineTotal = line.quantity * line.unitPrice;
      return {
        ...line,
        total: lineTotal
      };
    });
    setProductLines(updatedLines);
  }, []);

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
  
  // Préparer le texte des montants en lettres
  const montantTTCEnLettres = montantEnLettres(totalTTC, currency);

  // Générer un numéro de bon de sortie au format BDS-YYYY-XXX
  const generateBonDeSortieNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BDS-${year}-${randomId}`;
  };

  // Handler pour créer un bon de sortie
  const handleCreate = () => {
    // Créer le nouveau bon de sortie
    const newBonDeSortie = {
      id: isEditing ? bonDeSortieId : Date.now().toString(),
      numero: isEditing ? "BDS-2023-XXX" : generateBonDeSortieNumber(),
      client: "Client Exemple",
      date: new Date().toISOString(),
      montant: totalTTC,
      statut: "draft",
      products: productLines,
      currency: currency,
      subtotal: subtotal,
      totalTVA: totalTVA,
      totalTTC: totalTTC,
      montantTTCEnLettres: montantTTCEnLettres
    };

    setCurrentData(newBonDeSortie);
    setIsCreated(true);
    
    // Switcher sur l'onglet aperçu
    setActiveTab("apercu");
    
    toast.success(isEditing ? "Bon de sortie modifié avec succès" : "Bon de sortie créé avec succès");
  };

  // Handler pour annuler
  const handleCancel = () => {
    toast.info("Le bon de sortie a été annulé");
    setIsCreated(false);
    onOpenChange(false);
  };

  // Handler pour télécharger le PDF
  const handleDownloadPDF = () => {
    try {
      if (!currentData) return false;
      
      // On adapte les données au format attendu par le générateur de PDF
      const invoiceData = {
        id: currentData.id,
        numero: currentData.numero,
        client: {
          id: "client-id",
          nom: currentData.client,
          email: "client@example.com",
          adresse: "Adresse du client"
        },
        dateCreation: currentData.date,
        dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        totalTTC: currentData.totalTTC,
        statut: "brouillon" as const,
        produits: currentData.products,
        applyTVA: applyTVA,
        showDiscount: showDiscount,
        currency: currentData.currency
      };

      downloadInvoiceAsPDF(invoiceData, "fr");
      return true;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      toast.error("Erreur lors de la génération du PDF");
      return false;
    }
  };

  // Handler pour enregistrer (sans fermer le modal)
  const handleSave = () => {
    toast.success("Bon de sortie enregistré");
  };

  // Handler pour télécharger le PDF et revenir à la liste
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
            {isEditing ? "Modifier le bon de sortie" : "Nouveau bon de sortie"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? "Modifiez les détails du bon de sortie existant"
              : "Créez un nouveau bon de sortie pour un client"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? "Modifier le bon de sortie" : "Nouveau bon de sortie"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Modifiez les détails du bon de sortie existant"
                : "Créez un nouveau bon de sortie pour un client"}
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
              <TabsContent value="edition" className="space-y-6 mt-4">
                <BonDeSortieForm isEditing={isEditing} />

                <ProductLineEditor
                  productLines={productLines}
                  applyTVA={applyTVA}
                  showDiscount={showDiscount}
                  currency={currency}
                  subtotal={subtotal}
                  totalTVA={totalTVA}
                  totalTTC={totalTTC}
                  onProductLineChange={setProductLines}
                />

                <NotesSection />

                {!isCreated && (
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={handleCancel}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreate}>
                      Créer
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="apercu" className="mt-4">
                <BonDeSortiePreview
                  productLines={productLines}
                  applyTVA={applyTVA}
                  showDiscount={showDiscount}
                  currency={currency}
                  subtotal={subtotal}
                  totalTVA={totalTVA}
                  totalTTC={totalTTC}
                  montantTTCEnLettres={montantTTCEnLettres}
                  isCreated={isCreated}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  onDownload={handleDownloadAndClose}
                />
              </TabsContent>
            </Tabs>
          </div>

          {showSettings && (
            <BonDeSortieSettingsPanel
              applyTVA={applyTVA}
              setApplyTVA={setApplyTVA}
              showDiscount={showDiscount}
              setShowDiscount={setShowDiscount}
              currency={currency}
              setCurrency={setCurrency}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
