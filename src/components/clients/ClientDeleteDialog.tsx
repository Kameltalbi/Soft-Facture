
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
import { toast } from "sonner";

interface ClientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  clientName: string;
  onDelete: (id: string) => void;
}

export const ClientDeleteDialog = ({
  open,
  onOpenChange,
  clientId,
  clientName,
  onDelete,
}: ClientDeleteDialogProps) => {
  const { t } = useTranslation();

  const handleDelete = () => {
    if (!clientId) return;
    
    try {
      onDelete(clientId);
      toast.success(t('client.delete.success', 'Client deleted successfully'));
      onOpenChange(false);
    } catch (error) {
      toast.error(t('client.delete.error', 'Failed to delete client'));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('client.delete.title', 'Delete Client')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('client.delete.confirmation', 'Are you sure you want to delete this client?')} <strong>{clientName}</strong>
            <br />
            {t('client.delete.warning', 'This action cannot be undone.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
