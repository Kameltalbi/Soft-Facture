import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CompanyInfo } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Upload } from "lucide-react";

export function SocieteTab({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Form definition using react-hook-form
  const form = useForm<CompanyInfo>({
    defaultValues: {
      nom: "",
      adresse: "",
      code_tva: "",
      telephone: "",
      email_contact: "",
      logo_url: null
    }
  });

  // Load company info from Supabase
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
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
            logo_url: data.logo_url,
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

  // Handle logo upload
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: t('common.error'),
        description: "Le logo doit être inférieur à 2 Mo",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('common.error'),
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Upload the file directly - no need to check for bucket existence since we created it in SQL
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, {
          upsert: true
        });
      
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);
      
      // Update the form
      form.setValue('logo_url', publicUrlData.publicUrl);
      
      toast({
        title: "Succès",
        description: "Logo téléchargé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement du logo:", error);
      toast({
        title: t('common.error'),
        description: "Erreur lors du téléchargement du logo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Submit handler
  const onSubmit = async (values: CompanyInfo) => {
    try {
      const { id, ...updateData } = values;
      
      // If we have an id, update the record
      if (id) {
        const { error } = await supabase
          .from('company_info')
          .update({
            nom: values.nom,
            adresse: values.adresse,
            code_tva: values.code_tva,
            telephone: values.telephone,
            email_contact: values.email_contact,
            logo_url: values.logo_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Otherwise insert a new record
        const { error } = await supabase
          .from('company_info')
          .insert({
            nom: values.nom,
            adresse: values.adresse,
            code_tva: values.code_tva,
            telephone: values.telephone,
            email_contact: values.email_contact,
            logo_url: values.logo_url
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
            {/* Company Logo */}
            <div className="flex flex-col items-center mb-6">
              <FormLabel className="mb-2">Logo de l'entreprise</FormLabel>
              <div className="relative mb-4">
                <Avatar className="w-32 h-32 border-2 border-border">
                  {form.watch('logo_url') ? (
                    <AvatarImage src={form.watch('logo_url')} alt="Logo de l'entreprise" />
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <Building className="w-10 h-10 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button 
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full"
                  disabled={isUploading}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <FormDescription className="text-center text-xs max-w-xs">
                Téléchargez un logo de taille 500x500px pour une meilleure qualité (maximum 2 Mo)
              </FormDescription>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
            </div>
            
            {/* Other form fields */}
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
