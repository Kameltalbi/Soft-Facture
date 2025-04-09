
import { Button } from "@/components/ui/button";

interface InvoiceActionsProps {
  isCreated: boolean;
  onCancel?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
}

export function InvoiceActions({
  isCreated,
  onCancel,
  onSave,
  onDownload
}: InvoiceActionsProps) {
  if (!isCreated) return null;
  
  return (
    <div className="flex gap-2 justify-end mt-8 border-t pt-6">
      <Button 
        variant="destructive" 
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button 
        variant="outline" 
        onClick={onSave}
      >
        Enregistrer
      </Button>
      <Button 
        onClick={onDownload}
      >
        Télécharger (PDF)
      </Button>
    </div>
  );
}
