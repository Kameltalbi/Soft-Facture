
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

interface DevisDialogsProps {
  openCancelDialog: boolean;
  setOpenCancelDialog: (open: boolean) => void;
  openValidateDialog: boolean;
  setOpenValidateDialog: (open: boolean) => void;
  openConvertDialog: boolean;
  setOpenConvertDialog: (open: boolean) => void;
  confirmCancelDevis: () => void;
  confirmValidateDevis: () => void;
  confirmConvertToInvoice: () => void;
}

export function DevisDialogs({
  openCancelDialog,
  setOpenCancelDialog,
  openValidateDialog,
  setOpenValidateDialog,
  openConvertDialog,
  setOpenConvertDialog,
  confirmCancelDevis,
  confirmValidateDevis,
  confirmConvertToInvoice,
}: DevisDialogsProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Cancel Alert Dialog */}
      <AlertDialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.cancel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.cancel_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelDevis}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t('quote.cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Validate Alert Dialog */}
      <AlertDialog open={openValidateDialog} onOpenChange={setOpenValidateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.validate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.validate_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmValidateDevis}
              className="bg-invoice-status-paid hover:bg-invoice-status-paid/90"
            >
              {t('quote.validate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Convert to Invoice Alert Dialog */}
      <AlertDialog open={openConvertDialog} onOpenChange={setOpenConvertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quote.convert_to_invoice')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('quote.convert_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmConvertToInvoice}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('quote.convert')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
