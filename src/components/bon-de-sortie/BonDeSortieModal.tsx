
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { BonDeSortieSettingsPanel } from "./BonDeSortieSettingsPanel";
import { BonDeSortieModalProps } from "@/types";
import { BonDeSortiePreview } from "./components/BonDeSortiePreview";
import { ProductLineEditor } from "./components/ProductLineEditor";
import { BonDeSortieForm } from "./components/BonDeSortieForm";
import { NotesSection } from "./components/NotesSection";
import { useBonDeSortieState } from "./hooks/useBonDeSortieState";

export function BonDeSortieModal({
  open,
  onOpenChange,
  bonDeSortieId,
}: BonDeSortieModalProps) {
  const bonDeSortieState = useBonDeSortieState(bonDeSortieId);

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
    setProductLines,
    subtotal,
    totalTVA,
    totalTTC,
    montantTTCEnLettres,
    handleCreate,
    handleCancel,
    handleSave,
    handleDownloadPDF
  } = bonDeSortieState;

  // Handler for downloading the PDF and closing the modal
  const handleDownloadAndClose = () => {
    const success = handleDownloadPDF();
    if (success) {
      onOpenChange(false);
    }
  };

  // Handler for canceling and closing the modal
  const handleCancelAndClose = () => {
    handleCancel();
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
            {isCreated ? (
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
                onCancel={handleCancelAndClose}
                onSave={handleSave}
                onDownload={handleDownloadAndClose}
              />
            ) : (
              <>
                <div className="space-y-6 mt-4">
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

                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreate}>
                      Créer
                    </Button>
                  </div>
                </div>
              </>
            )}
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
