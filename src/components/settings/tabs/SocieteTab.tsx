import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CompanyInfo } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function SocieteTab({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Form definition using react-hook-form
  const form = useForm<CompanyInfo>({
    defaultValues: {
      nom: "",
      adresse: "",
      code_tva: "",
      telephone: "",
      email_contact: ""
    }
  });

  // Load company info from Supabase
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await (supabase as any)
          .from('company_info')
          .select('*')
          .limit(1)
          .single();
        
        if (error) {
          console.error("Erreur lors du chargement des informations de l'entreprise:", error);
        } else if (data) {
          // Set form values with data from database
          form.reset({
            id: data.id,
            nom: data.nom,
            adresse: data.adresse,
            code_tva: data.code_tva,
            telephone: data.telephone || "",
            email_contact: data.email_contact || "",
            created_at: data.created_at,
            updated_at: data.updated_at
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des informations de l'entreprise:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyInfo();
  }, [form]);

  // Submit handler
  const onSubmit = async (values: CompanyInfo) => {
    try {
      const { id, ...updateData } = values;
      
      // If we have an id, update the record
      if (id) {
        const { error } = await (supabase as any)
          .from('company_info')
          .update({
            nom: values.nom,
            adresse: values.adresse,
            code_tva: values.code_tva,
            telephone: values.telephone,
            email_contact: values.email_contact,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Otherwise insert a new record
        const { error } = await (supabase as any)
          .from('company_info')
          .insert({
            nom: values.nom,
            adresse: values.adresse,
            code_tva: values.code_tva,
            telephone: values.telephone,
            email_contact: values.email_contact
          });
          
        if (error) throw error;
      }
      
      toast({
        title: t('settings.saveSuccess'),
        description: t('settings.companyInfoSaved'),
      });
      
      onSave();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des informations de l'entreprise:", error);
      toast({
        title: t('common.error'),
        description: t('settings.saveError'),
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="py-4">{t('common.loading')}...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('settings.companyName')} <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('settings.companyAddress')} <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="code_tva"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    {t('settings.vatCode')} <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>{t('settings.phone')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.contactEmail')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('common.save')}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
