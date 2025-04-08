
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Save, ArrowUpRight, X } from "lucide-react";
import { DevisSettingsPanel } from "./DevisSettingsPanel";
import { montantEnLettres } from "./utils/devisUtils";
import { ProductLine } from "./components/ProductLineTable";
import { DevisForm } from "./components/DevisForm";
import { DevisPreview } from "./components/DevisPreview";

interface DevisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  devisId: string | null;
}

export function DevisModal({
  open,
  onOpenChange,
  devisId,
}: DevisModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [currency, setCurrency] = useState("TND");

  const isEditing = devisId !== null;

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
  
  // Préparer le texte des montants en lettres
  const montantTTCEnLettres = montantEnLettres(totalTTC, currency);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {isEditing ? "Modifier le devis" : "Nouveau devis"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditing
              ? "Modifiez les détails du devis existant"
              : "Créez un nouveau devis pour un client"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? "Modifier le devis" : "Nouveau devis"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Modifiez les détails du devis existant"
                : "Créez un nouveau devis pour un client"}
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
              <TabsContent value="edition">
                <DevisForm 
                  isEditing={isEditing}
                  productLines={productLines}
                  applyTVA={applyTVA}
                  showDiscount={showDiscount}
                  currency={currency}
                  subtotal={subtotal}
                  totalTVA={totalTVA}
                  totalTTC={totalTTC}
                  onAddProductLine={addProductLine}
                  onRemoveProductLine={removeProductLine}
                  onTaxChange={handleTaxChange}
                  onTaxModeChange={handleTaxModeChange}
                />
              </TabsContent>
              <TabsContent value="apercu" className="mt-4">
                <DevisPreview 
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
            <DevisSettingsPanel
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
          <Button variant="outline">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
