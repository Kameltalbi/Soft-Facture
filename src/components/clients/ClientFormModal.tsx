
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
import { Save, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { createClient, updateClient, getClientById } from "./ClientsData";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Client } from "@/types";

interface ClientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  onSuccess?: () => void;
}

export function ClientFormModal({
  open,
  onOpenChange,
  clientId,
  onSuccess,
}: ClientFormModalProps) {
  const isEditing = clientId !== null;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchingClient, setFetchingClient] = useState<boolean>(false);

  const clientSchema = z.object({
    nom: z.string().min(1, t('client.form.nameRequired', 'Name is required')),
    societe: z.string().optional(),
    email: z.string().email(t('client.form.emailInvalid', 'Invalid email format')),
    telephone: z.string().optional(),
    adresse: z.string().optional(),
    tva: z.string().optional(),
  });

  type ClientFormValues = z.infer<typeof clientSchema>;

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom: "",
      societe: "",
      email: "",
      telephone: "",
      adresse: "",
      tva: "",
    },
  });

  // Fetch client data when editing
  useEffect(() => {
    if (isEditing && clientId && open) {
      setFetchingClient(true);
      getClientById(clientId)
        .then((client) => {
          if (client) {
            form.reset({
              nom: client.nom || "",
              societe: client.societe || "",
              email: client.email || "",
              telephone: client.telephone || "",
              adresse: client.adresse || "",
              tva: client.tva || "",
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching client:", error);
          toast.error(t('client.fetch.error', 'Error loading client data'));
        })
        .finally(() => {
          setFetchingClient(false);
        });
    } else if (open) {
      // Reset form when opening for new client
      form.reset({
        nom: "",
        societe: "",
        email: "",
        telephone: "",
        adresse: "",
        tva: "",
      });
    }
  }, [clientId, open, form, t, isEditing]);

  const onSubmit = async (data: ClientFormValues) => {
    setIsLoading(true);
    try {
      if (isEditing && clientId) {
        await updateClient(clientId, data);
        toast.success(t('client.update.success', 'Client updated successfully'));
      } else {
        await createClient(data as Omit<Client, 'id'>);
        toast.success(t('client.create.success', 'Client created successfully'));
      }
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(
        isEditing
          ? t('client.update.error', 'Error updating client')
          : t('client.create.error', 'Error creating client')
      );
    } finally {
      setIsLoading(false);
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

        {fetchingClient ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.form.name')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('client.form.namePlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="societe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.form.company')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('client.form.companyPlaceholder')}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.form.email')}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('client.form.emailPlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.form.phone')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('client.form.phonePlaceholder')}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client.form.vat')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('client.form.vatPlaceholder')}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  {/* This empty div maintains the grid layout */}
                </div>
              </div>

              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('client.form.address')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('client.form.addressPlaceholder')}
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  {t('client.form.cancel')}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {t('client.form.save')}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
