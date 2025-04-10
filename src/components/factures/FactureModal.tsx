
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { FactureSettingsPanel } from "./FactureSettingsPanel";
import { FactureModalProps } from "@/types";
import { FactureForm } from "./components/FactureForm";
import { FacturePreview } from "./components/FacturePreview";
import { useFactureState } from "./hooks/useFactureState";

export function FactureModal({
  open,
  onOpenChange,
  factureId,
}: FactureModalProps) {
  const factureState = useFactureState(factureId);
  
  // Destructure all the values from our hook
  const {
    showSettings,
    setShowSettings,
    applyTVA,
    setApplyTVA,
    showDiscount,
    setShowDiscount,
    showAdvancePayment,
    setShowAdvancePayment,
    advancePaymentAmount,
    currency,
    setCurrency,
    isCreated,
    isEditing,
    isLoading,
    productLines,
    currencySymbol,
    subtotal,
    totalTVA,
    totalTTC,
    finalAmount,
    montantEnLettresText,
    clientName,
    setClientName,
    addProductLine,
    removeProductLine,
    handleTaxChange,
    handleTaxModeChange,
    handleQuantityChange,
    handlePriceChange,
    handleProductNameChange,
    handleAdvancePaymentChange,
    handleCreate,
    handleCancel,
    handleSave,
    handleDownloadPDF
  } = factureState;

  // Handler for downloading the PDF and closing the modal
  const handleDownloadAndClose = () => {
    const success = handleDownloadPDF();
    if (success) {
      onOpenChange(false);
    }
  };

  const handleCancelAndClose = () => {
    handleCancel();
    onOpenChange(false);
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
            {isCreated ? (
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
                onCancel={handleCancelAndClose}
                onSave={handleSave}
                onDownload={handleDownloadAndClose}
                clientName={clientName}
              />
            ) : (
              <>
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
                  onQuantityChange={handleQuantityChange}
                  onPriceChange={handlePriceChange}
                  onProductNameChange={handleProductNameChange}
                  clientName={clientName}
                  setClientName={setClientName}
                />
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreate} disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                </div>
              </>
            )}
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
