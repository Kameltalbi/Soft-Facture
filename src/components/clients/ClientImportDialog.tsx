
import { useTranslation } from "react-i18next";
import { FileExcel, FileCsv } from "@/components/ui/custom-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ClientImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientImportDialog = ({ open, onOpenChange }: ClientImportDialogProps) => {
  const { t } = useTranslation();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
      toast.error(t('import.error.invalidFormat', 'Only Excel (.xlsx) or CSV files are supported'));
      return;
    }

    // Here you would typically process the file
    // For demo purposes, we'll just show a success toast
    toast.success(t('import.success', 'File imported successfully'));
    onOpenChange(false);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          {t('common.import')}
        </Button>
      </DialogTrigger>
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
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
