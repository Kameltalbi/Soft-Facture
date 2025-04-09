
import { useTranslation } from "react-i18next";
import { FileExcel, FileCsv } from "@/components/ui/custom-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

interface ClientImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: () => void;
}

export const ClientImportDialog = ({ open, onOpenChange, onImportSuccess }: ClientImportDialogProps) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
      toast.error(t('import.error.invalidFormat', 'Only Excel (.xlsx) or CSV files are supported'));
      return;
    }

    setIsUploading(true);

    // Here you would typically process the file
    // For demo purposes, we'll just simulate a delay and show a success toast
    setTimeout(() => {
      setIsUploading(false);
      toast.success(t('import.success', 'File imported successfully'));
      if (onImportSuccess) {
        onImportSuccess();
      }
      onOpenChange(false);
      
      // Reset the input
      event.target.value = '';
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('import.clients.title', 'Import Clients')}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">{t('import.clients.description', 'Select an Excel (.xlsx) or CSV file to import clients.')}</p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FileExcel className="w-10 h-10" />
              <FileCsv className="w-10 h-10" />
              <span>{t('import.supportedFormats', 'Supported formats: Excel & CSV')}</span>
            </div>
            <Input 
              type="file" 
              accept=".xlsx,.csv" 
              onChange={handleFileUpload}
              className="cursor-pointer"
              disabled={isUploading}
            />
            {isUploading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">{t('import.uploading', 'Uploading...')}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
