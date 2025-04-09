
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { DevisSettingsPanel } from "./DevisSettingsPanel";
import { DevisForm } from "./components/DevisForm";
import { DevisPreview } from "./components/DevisPreview";
import { useDevisState } from "./hooks/useDevisState";

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
  const devisState = useDevisState(devisId);
  
  // Destructure all the values from our hook
  const {
    showSettings,
    setShowSettings,
    applyTVA,
    setApplyTVA,
    showDiscount,
    setShowDiscount,
    currency,
    setCurrency,
    isCreated,
    isEditing,
    productLines,
    subtotal,
    totalTVA,
    totalTTC,
    montantTTCEnLettres,
    addProductLine,
    removeProductLine,
    handleTaxChange,
    handleTaxModeChange,
    handleCreateDevis,
    handleCancelDevis,
    handleSaveDevis,
    handleDownloadPDF
  } = devisState;

  // Handler for downloading the PDF and closing the modal
  const handleDownloadAndClose = () => {
    const success = handleDownloadPDF();
    if (success) {
      onOpenChange(false);
    }
  };

  // Handler for canceling and closing the modal
  const handleCancelAndClose = () => {
    handleCancelDevis();
    onOpenChange(false);
  };

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
            {isCreated ? (
              <DevisPreview 
                productLines={productLines}
                applyTVA={applyTVA}
                showDiscount={showDiscount}
                currency={currency}
                subtotal={subtotal}
                totalTVA={totalTVA}
                totalTTC={totalTTC}
                montantTTCEnLettres={montantTTCEnLettres}
                isCreated={isCreated}
                onCancel={handleCancelAndClose}
                onSave={handleSaveDevis}
                onDownload={handleDownloadAndClose}
              />
            ) : (
              <>
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
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateDevis}>
                    Créer
                  </Button>
                </div>
              </>
            )}
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
      </DialogContent>
    </Dialog>
  );
}
