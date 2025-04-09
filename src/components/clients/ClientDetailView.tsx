
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Client } from "@/types";

interface ClientDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onEdit?: () => void;
}

export function ClientDetailView({
  open,
  onOpenChange,
  client,
  onEdit,
}: ClientDetailViewProps) {
  const { t } = useTranslation();

  if (!client) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{client.nom}</span>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit();
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('client.edit')}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {client.societe && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('client.form.company')}
              </h3>
              <p className="text-base">{client.societe}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.email && (
              <div className="flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('client.form.email')}
                  </h3>
                  <a
                    href={`mailto:${client.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
              </div>
            )}

            {client.telephone && (
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {t('client.form.phone')}
                  </h3>
                  <a
                    href={`tel:${client.telephone}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {client.telephone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {client.tva && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('client.form.vat')}
              </h3>
              <p className="text-base">{client.tva}</p>
            </div>
          )}

          {client.adresse && (
            <>
              <Separator />
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {t('client.form.address')}
                  </h3>
                  <p className="text-sm whitespace-pre-line">{client.adresse}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
