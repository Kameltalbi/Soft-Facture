
import { useTranslation } from 'react-i18next';
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { CompanyLogo } from "./CompanyLogo";

export interface CompanyFormValues {
  nom_entreprise: string;
  adresse: string;
  email: string;
  telephone: string;
  rib: string;
}

interface CompanyInfoFormProps {
  initialValues: CompanyFormValues;
  logoPreview: string | null;
  setLogoPreview: (logo: string | null) => void;
  onSave: (values: CompanyFormValues) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function CompanyInfoForm({
  initialValues,
  logoPreview,
  setLogoPreview,
  onSave,
  onCancel,
  isSaving
}: CompanyInfoFormProps) {
  const { t } = useTranslation();
  
  const form = useForm<CompanyFormValues>({
    defaultValues: initialValues
  });

  const handleSubmit = async (values: CompanyFormValues) => {
    await onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CompanyLogo 
          logoPreview={logoPreview} 
          setLogoPreview={setLogoPreview} 
          isEditing={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom_entreprise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.companyName')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('settings.companyName')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rib"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.rib')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('settings.rib')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="adresse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.address')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('settings.address')}
                  rows={3}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('settings.email')}
                    {...field}
                  />
                </FormControl>
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
                  <Input
                    placeholder={t('settings.phone')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel')}
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-primary text-primary-foreground"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {t('settings.save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
