
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
}

export function ClientFormModal({
  open,
  onOpenChange,
  clientId,
}: ClientFormModalProps) {
  const isEditing = clientId !== null;
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour sauvegarder le client
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('client.edit') : t('client.new')}
          </DialogTitle>
          <DialogDescription>
            {t('client.form.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">{t('client.form.name')}</Label>
              <Input
                id="nom"
                placeholder={t('client.form.name')}
                defaultValue={isEditing ? "Jean Dupont" : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="societe">{t('client.form.company')}</Label>
              <Input
                id="societe"
                placeholder={t('client.form.company')}
                defaultValue={isEditing ? "Société XYZ" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('client.form.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                defaultValue={isEditing ? "jean.dupont@xyz.fr" : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">{t('client.form.phone')}</Label>
              <Input
                id="telephone"
                placeholder="06 XX XX XX XX"
                defaultValue={isEditing ? "06 12 34 56 78" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tva">{t('client.form.vatNumber')}</Label>
              <Input
                id="tva"
                placeholder="FR12345678900"
                defaultValue={isEditing ? "FR12345678901" : ""}
              />
            </div>
            <div className="space-y-2">
              {/* This empty div maintains the grid layout */}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">{t('client.form.address')}</Label>
            <Textarea
              id="adresse"
              placeholder={t('client.form.address')}
              rows={3}
              defaultValue={
                isEditing ? "456 Avenue des Clients, 69002 Lyon" : ""
              }
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('client.form.cancel')}
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {t('client.form.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
