
import { useState, useEffect } from "react";
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
import { createClient, updateClient, getClientById } from "@/services/clientService";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: "",
    societe: "",
    email: "",
    telephone: "",
    tva: "",
    adresse: ""
  });

  useEffect(() => {
    if (isEditing && open && clientId) {
      const loadClient = async () => {
        setLoading(true);
        const client = await getClientById(clientId);
        if (client) {
          setFormData({
            nom: client.nom,
            societe: client.societe || "",
            email: client.email || "",
            telephone: client.telephone || "",
            tva: client.tva || "",
            adresse: client.adresse || ""
          });
        }
        setLoading(false);
      };
      
      loadClient();
    } else if (!isEditing) {
      // Reset form for new client
      setFormData({
        nom: "",
        societe: "",
        email: "",
        telephone: "",
        tva: "",
        adresse: ""
      });
    }
  }, [clientId, isEditing, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && clientId) {
        await updateClient(clientId, formData);
      } else {
        await createClient(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error(t('client.form.errorSaving'));
    } finally {
      setLoading(false);
    }
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

        {loading ? (
          <div className="py-8 text-center">{t('common.loading')}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">{t('client.form.name')}</Label>
                <Input
                  id="nom"
                  placeholder={t('client.form.namePlaceholder')}
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="societe">{t('client.form.company')}</Label>
                <Input
                  id="societe"
                  placeholder={t('client.form.companyPlaceholder')}
                  value={formData.societe}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('client.form.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('client.form.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">{t('client.form.phone')}</Label>
                <Input
                  id="telephone"
                  placeholder={t('client.form.phonePlaceholder')}
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tva">{t('client.form.vat')}</Label>
                <Input
                  id="tva"
                  placeholder={t('client.form.vatPlaceholder')}
                  value={formData.tva}
                  onChange={handleChange}
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
                placeholder={t('client.form.addressPlaceholder')}
                rows={3}
                value={formData.adresse}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t('client.form.cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {t('client.form.save')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
