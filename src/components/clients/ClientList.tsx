
import { useState } from "react";
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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Client } from "@/types";
import { clientsDemo } from "./ClientsData";

interface ClientListProps {
  onEditClient: (id: string, e: React.MouseEvent) => void;
  onViewClient: (client: Client) => void;
}

export const ClientList = ({ onEditClient, onViewClient }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { t } = useTranslation();

  const filteredClients = clientsDemo.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.societe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
  );
};
