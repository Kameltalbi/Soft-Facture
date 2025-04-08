
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
import { Edit, Upload, MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import { FileExcel, FileCsv } from "@/components/ui/custom-icons";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { ClientDetailView } from "@/components/clients/ClientDetailView";
import { useTranslation } from "react-i18next";
import { Client } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Données fictives pour les clients
const clientsDemo = [
  {
    id: "1",
    nom: "Entreprise ABC",
    societe: "ABC SAS",
    email: "contact@abc.fr",
    telephone: "01 23 45 67 89",
    adresse: "123 Rue de Paris, 75001 Paris",
    tva: "FR 12 345 678 901",
  },
  {
    id: "2",
    nom: "Jean Dupont",
    societe: "Société XYZ",
    email: "jean.dupont@xyz.fr",
    telephone: "06 12 34 56 78",
    adresse: "456 Avenue des Clients, 69002 Lyon",
    tva: "FR 98 765 432 109",
  },
  {
    id: "3",
    nom: "Marie Martin",
    societe: "Consulting DEF",
    email: "marie.martin@def.fr",
    telephone: "07 98 76 54 32",
    adresse: "789 Boulevard Central, 33000 Bordeaux",
    tva: "FR 45 678 901 234",
  },
  {
    id: "4",
    nom: "Pierre Durand",
    societe: "Studio Design",
    email: "pierre.durand@studio.fr",
    telephone: "06 54 32 10 98",
    adresse: "10 Rue de la Création, 44000 Nantes",
    tva: "FR 23 456 789 012",
  },
];

const ClientsPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDetailView, setOpenDetailView] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDetailClient, setSelectedDetailClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleCreateClient = () => {
    setSelectedClient(null);
    setOpenModal(true);
  };

  const handleEditClient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedClient(id);
    setOpenModal(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedDetailClient(client);
    setOpenDetailView(true);
  };

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
    setImportDialogOpen(false);
    
    // Reset the input
    event.target.value = '';
  };

  const filteredClients = clientsDemo.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.societe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout title={t('common.clients')}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('client.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('client.subtitle')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
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
          <Button className="flex items-center" onClick={handleCreateClient}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t('client.new')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('client.list')}</CardTitle>
            <Input
              placeholder={t('client.search')}
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('client.form.name')}</TableHead>
                <TableHead>{t('client.form.company')}</TableHead>
                <TableHead>{t('client.form.email')}</TableHead>
                <TableHead>{t('client.form.phone')}</TableHead>
                <TableHead className="text-right">{t('invoice.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleViewClient(client)}
                >
                  <TableCell className="font-medium">{client.nom}</TableCell>
                  <TableCell>{client.societe}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.telephone}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => e.stopPropagation()} // Prevent row click
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => handleEditClient(client.id, e)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t('invoice.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('invoice.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    {t('client.no_results')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ClientFormModal
        open={openModal}
        onOpenChange={setOpenModal}
        clientId={selectedClient}
      />

      <ClientDetailView
        open={openDetailView}
        onOpenChange={setOpenDetailView}
        client={selectedDetailClient}
      />
    </MainLayout>
  );
};

export default ClientsPage;
