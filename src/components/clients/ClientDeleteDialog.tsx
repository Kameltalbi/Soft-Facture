
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
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ClientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  clientName: string;
  onDelete: (id: string) => Promise<boolean>;
}

export const ClientDeleteDialog = ({
  open,
  onOpenChange,
  clientId,
  clientName,
  onDelete,
}: ClientDeleteDialogProps) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!clientId) return;
    
    setIsDeleting(true);
    try {
      const success = await onDelete(clientId);
      if (success) {
        toast.success(t('client.delete.success', 'Client deleted successfully'));
      } else {
        toast.error(t('client.delete.error', 'Failed to delete client'));
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error(t('client.delete.error', 'Failed to delete client'));
    } finally {
      setIsDeleting(false);
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
          <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
