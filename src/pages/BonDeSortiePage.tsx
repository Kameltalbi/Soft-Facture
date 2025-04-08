
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  DownloadCloud,
  Edit,
  Filter,
  MoreHorizontal,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { StatutFacture } from "@/types";
import { BonDeSortieModal } from "@/components/bon-de-sortie/BonDeSortieModal";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

// Données fictives pour les bons de sortie
const bonDeSortieDemo = [
  {
    id: "1",
    numero: "BDS2025-001",
    client: { id: "1", nom: "Entreprise ABC", email: "contact@abc.fr" },
    dateCreation: "2025-04-01",
    dateEcheance: "2025-05-01",
    totalTTC: 1200,
    statut: "payee" as StatutFacture,
  },
  {
    id: "2",
    numero: "BDS2025-002",
    client: { id: "2", nom: "Société XYZ", email: "info@xyz.fr" },
    dateCreation: "2025-04-03",
    dateEcheance: "2025-05-03",
    totalTTC: 850,
    statut: "envoyee" as StatutFacture,
  },
  {
    id: "3",
    numero: "BDS2025-003",
    client: { id: "3", nom: "Consulting DEF", email: "contact@def.fr" },
    dateCreation: "2025-04-05",
    dateEcheance: "2025-05-05",
    totalTTC: 2100,
    statut: "brouillon" as StatutFacture,
  },
  {
    id: "4",
    numero: "BDS2025-004",
    client: { id: "4", nom: "Studio Design", email: "hello@studio.fr" },
    dateCreation: "2025-03-15",
    dateEcheance: "2025-04-15",
    totalTTC: 950,
    statut: "retard" as StatutFacture,
  },
];

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case "TND":
      return "TND";
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "CHF":
      return "CHF";
    case "CAD":
      return "C$";
    default:
      return currency;
  }
};

const BonDeSortiePage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedBonDeSortie, setSelectedBonDeSortie] = useState<string | null>(null);
  const currencySymbol = getCurrencySymbol("TND"); // Default to TND
  const { t } = useTranslation();
  const { toast } = useToast();

  // Alert dialog states
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [actionBonDeSortie, setActionBonDeSortie] = useState<{
    id: string;
    numero: string;
  } | null>(null);

  const handleCreateBonDeSortie = () => {
    setSelectedBonDeSortie(null);
    setOpenModal(true);
  };

  const handleEditBonDeSortie = (id: string) => {
    setSelectedBonDeSortie(id);
    setOpenModal(true);
    
    // Get the bon de sortie number for the toast notification
    const bonDeSortie = bonDeSortieDemo.find((item) => item.id === id);
    if (bonDeSortie) {
      toast({
        title: t('deliveryNote.edit_started'),
        description: t('deliveryNote.edit_note_number', { number: bonDeSortie.numero }),
      });
    }
  };

  const handleDownloadBonDeSortie = (id: string) => {
    // Get the bon de sortie number for the toast notification
    const bonDeSortie = bonDeSortieDemo.find((item) => item.id === id);
    if (bonDeSortie) {
      toast({
        title: t('deliveryNote.download_started'),
        description: t('deliveryNote.download_note_number', { number: bonDeSortie.numero }),
      });
    }
    // Download functionality would be implemented here
  };

  const handleCancelConfirm = () => {
    // Process the cancellation
    if (actionBonDeSortie) {
      toast({
        title: t('deliveryNote.cancel_started'),
        description: t('deliveryNote.cancel_note_number', { number: actionBonDeSortie.numero }),
      });
      // Actual cancellation functionality would be implemented here
    }
    setShowCancelDialog(false);
    setActionBonDeSortie(null);
  };

  const handleCancelBonDeSortie = (id: string) => {
    // Get the bon de sortie number for the dialog
    const bonDeSortie = bonDeSortieDemo.find((item) => item.id === id);
    if (bonDeSortie) {
      setActionBonDeSortie({
        id: bonDeSortie.id,
        numero: bonDeSortie.numero,
      });
      setShowCancelDialog(true);
    }
  };

  const handleValidateConfirm = () => {
    // Process the validation
    if (actionBonDeSortie) {
      toast({
        title: t('deliveryNote.validate_started'),
        description: t('deliveryNote.validate_note_number', { number: actionBonDeSortie.numero }),
      });
      // Actual validation functionality would be implemented here
    }
    setShowValidateDialog(false);
    setActionBonDeSortie(null);
  };

  const handleValidateBonDeSortie = (id: string) => {
    // Get the bon de sortie number for the dialog
    const bonDeSortie = bonDeSortieDemo.find((item) => item.id === id);
    if (bonDeSortie) {
      setActionBonDeSortie({
        id: bonDeSortie.id,
        numero: bonDeSortie.numero,
      });
      setShowValidateDialog(true);
    }
  };

  const getStatusColor = (statut: StatutFacture) => {
    switch (statut) {
      case "payee":
        return "bg-invoice-status-paid/10 text-invoice-status-paid";
      case "envoyee":
        return "bg-invoice-status-pending/10 text-invoice-status-pending";
      case "retard":
        return "bg-invoice-status-overdue/10 text-invoice-status-overdue";
      case "brouillon":
        return "bg-invoice-status-draft/10 text-invoice-status-draft";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (statut: StatutFacture) => {
    switch (statut) {
      case "payee":
        return t('deliveryNote.status_delivered');
      case "envoyee":
        return t('deliveryNote.status_pending');
      case "retard":
        return t('deliveryNote.status_cancelled');
      case "brouillon":
        return t('deliveryNote.status_draft');
      default:
        return t('deliveryNote.status_unknown');
    }
  };

  return (
    <MainLayout title={t('common.deliveryNotes')}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t('deliveryNote.title')}</h2>
          <p className="text-muted-foreground">
            {t('deliveryNote.subtitle')}
          </p>
        </div>
        <Button className="flex items-center" onClick={handleCreateBonDeSortie}>
          <Plus className="mr-2 h-4 w-4" />
          {t('deliveryNote.new')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('deliveryNote.list')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder={t('deliveryNote.search')}
                className="max-w-sm"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('deliveryNote.number')}</TableHead>
                <TableHead>{t('deliveryNote.client')}</TableHead>
                <TableHead>{t('deliveryNote.date')}</TableHead>
                <TableHead>{t('deliveryNote.dueDate')}</TableHead>
                <TableHead className="text-right">{t('deliveryNote.amount')}</TableHead>
                <TableHead>{t('deliveryNote.status')}</TableHead>
                <TableHead className="text-right">{t('deliveryNote.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bonDeSortieDemo.map((bonDeSortie) => (
                <TableRow key={bonDeSortie.id}>
                  <TableCell className="font-medium">{bonDeSortie.numero}</TableCell>
                  <TableCell>{bonDeSortie.client.nom}</TableCell>
                  <TableCell>
                    {new Date(bonDeSortie.dateCreation).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {new Date(bonDeSortie.dateEcheance).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    {bonDeSortie.totalTTC.toLocaleString("fr-FR")} {currencySymbol}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        bonDeSortie.statut
                      )}`}
                    >
                      {getStatusLabel(bonDeSortie.statut)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditBonDeSortie(bonDeSortie.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t('deliveryNote.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadBonDeSortie(bonDeSortie.id)}
                        >
                          <DownloadCloud className="mr-2 h-4 w-4" />
                          {t('deliveryNote.download')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleValidateBonDeSortie(bonDeSortie.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {t('deliveryNote.validate')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleCancelBonDeSortie(bonDeSortie.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('deliveryNote.cancel')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BonDeSortieModal
        open={openModal}
        onOpenChange={setOpenModal}
        bonDeSortieId={selectedBonDeSortie}
      />

      {/* Cancel Alert Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deliveryNote.cancel')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deliveryNote.cancel_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('deliveryNote.cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Validate Alert Dialog */}
      <AlertDialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deliveryNote.validate')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deliveryNote.validate_confirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleValidateConfirm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t('deliveryNote.validate')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default BonDeSortiePage;
