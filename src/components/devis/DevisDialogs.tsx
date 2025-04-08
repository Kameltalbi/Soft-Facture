
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DevisDialogsProps {
  action: string;
  devis: any;
  isOpen: boolean; 
  onClose: () => void;
}

export function DevisDialogs({
  action,
  devis,
  isOpen,
  onClose
}: DevisDialogsProps) {
  const { t } = useTranslation();

  // Separate states for different dialogs that will be derived from props
  const isViewOpen = isOpen && action === "view";
  const isDeleteOpen = isOpen && action === "delete";
  const isDownloadOpen = isOpen && action === "download";
  const isValidateOpen = isOpen && action === "validate";
  const isCancelOpen = isOpen && action === "cancel";
  const isConvertOpen = isOpen && action === "convert";
  
  const handleConfirmAction = () => {
    console.log(`Confirmed action: ${action} for devis:`, devis);
    onClose();
  };

  return (
    <>
      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={() => isViewOpen && onClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <h2 className="text-lg font-semibold">{t('quote.view')}</h2>
          {devis && (
            <div className="py-4">
              <p><strong>{t('quote.number')}:</strong> {devis.numero}</p>
              <p><strong>{t('quote.client')}:</strong> {devis.client}</p>
              <p><strong>{t('quote.date')}:</strong> {new Date(devis.date).toLocaleDateString()}</p>
              <p><strong>{t('quote.amount')}:</strong> {devis.montant}</p>
              <p><strong>{t('quote.status')}:</strong> {t(`quote.status.${devis.statut}`)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={() => isDeleteOpen && onClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.delete_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('quote.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Validate Alert Dialog */}
      <AlertDialog open={isValidateOpen} onOpenChange={() => isValidateOpen && onClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.validate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.validate_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className="bg-invoice-status-paid hover:bg-invoice-status-paid/90"
            >
              {t('quote.validate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Alert Dialog */}
      <AlertDialog open={isCancelOpen} onOpenChange={() => isCancelOpen && onClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.cancel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.cancel_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('quote.cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Convert to Invoice Alert Dialog */}
      <AlertDialog open={isConvertOpen} onOpenChange={() => isConvertOpen && onClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.convert_to_invoice')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.convert_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('quote.convert')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Download Alert Dialog */}
      <AlertDialog open={isDownloadOpen} onOpenChange={() => isDownloadOpen && onClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.download')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.download_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
            >
              {t('quote.download')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
