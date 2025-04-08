
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

export function BonDeSortieModal({
  open,
  onOpenChange,
  bonDeSortieId,
}: BonDeSortieModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [currency, setCurrency] = useState("TND");

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

  const handleSave = () => {
    // Here you would typically save the bon de sortie data
    toast.success("Bon de sortie enregistré avec succès");
    onOpenChange(false);
  };

  const handleSend = () => {
    // Here you would typically send the bon de sortie to the client
    toast.success("Bon de sortie envoyé avec succès");
    onOpenChange(false);
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
            <Tabs defaultValue="edition" className="mb-6">
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

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="outline" onClick={handleSend}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
