import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import { Client } from "@/types";
import { fetchClients, deleteClient } from "./ClientsData";
import { ClientDeleteDialog } from "./ClientDeleteDialog";
import { toast } from "sonner";

interface ClientListProps {
  clients?: Client[];
  onEditClient: (id: string, e: React.MouseEvent) => void;
  onViewClient: (client: Client) => void;
}

export const ClientList = ({ clients: propClients, onEditClient, onViewClient }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clientToDelete, setClientToDelete] = useState<{id: string, name: string} | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    // If clients are provided as props, use them
    if (propClients) {
      setClients(propClients);
      setIsLoading(false);
    } else {
      // Otherwise fetch them
      loadClients();
    }
  }, [propClients]);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error(t('client.load.error', 'Error loading clients'));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.societe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setClientToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      // Refresh client list
      if (propClients) {
        // If clients are provided via props, let the parent component handle refresh
        onViewClient({ id: "", nom: "", email: "" }); // Trigger a refresh in the parent
      } else {
        loadClients();
      }
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  };

  return (
    <>
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
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
                    onClick={() => onViewClient(client)}
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
                            onClick={(e) => onEditClient(client.id, e)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('invoice.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={(e) => handleDeleteClick(client.id, client.nom, e)}
                          >
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
          )}
        </CardContent>
      </Card>

      <ClientDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        clientId={clientToDelete?.id || null}
        clientName={clientToDelete?.name || ""}
        onDelete={handleDeleteClient}
      />
    </>
  );
};
