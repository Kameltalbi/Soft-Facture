
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, Loader2, Save, Upload, Pencil, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EntrepriseTabProps {
  onSave: () => void;
}

interface CompanyFormValues {
  nom_entreprise: string;
  adresse: string;
  email: string;
  telephone: string;
  rib: string;
}

export function EntrepriseTab({ onSave }: EntrepriseTabProps) {
  const { t } = useTranslation();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<CompanyFormValues>({
    defaultValues: {
      nom_entreprise: "",
      adresse: "",
      email: "",
      telephone: "",
      rib: ""
    }
  });

  // Load company data from Supabase
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch company info
        const { data, error } = await supabase
          .from('parametres')
          .select('*')
          .limit(1)
          .single();
          
        if (error) {
          console.error("Erreur lors de la récupération des données:", error);
          return;
        }
        
        if (data) {
          // Set form values
          form.reset({
            nom_entreprise: data.nom_entreprise || "",
            adresse: data.adresse || "",
            email: data.email || "",
            telephone: data.telephone || "",
            rib: data.rib || ""
          });
          
          // Set logo preview if exists
          if (data.logo_url) {
            setLogoPreview(data.logo_url);
          } else {
            // Try to get from localStorage as fallback
            const storedLogo = localStorage.getItem('companyLogo');
            if (storedLogo) {
              setLogoPreview(storedLogo);
            }
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [form]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image/jpeg|image/png|image/svg+xml')) {
        toast({
          title: "Erreur",
          description: t('settings.logoFormatError'),
          variant: "destructive"
        });
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        // Store in localStorage as a backup
        localStorage.setItem('companyLogo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleSaveAll = async (values: CompanyFormValues) => {
    try {
      setIsSaving(true);
      
      // Prepare data to update
      const updateData = {
        ...values,
        logo_url: logoPreview
      };
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('parametres')
        .update(updateData)
        .eq('id', 'a55a560b-44e7-4be4-822f-42e919b1a1b2') // Use the actual UUID string
        .select();
      
      if (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les informations de l'entreprise.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Succès",
        description: "Les informations de l'entreprise ont été sauvegardées avec succès.",
      });
      
      // Call the parent onSave callback
      onSave();
      
      // Exit edit mode
      setIsEditing(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{t('settings.companyInfo')}</CardTitle>
          <CardDescription>
            {t('settings.companyInfoDesc')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveAll)} className="space-y-6">
              <div className="border rounded-md p-6 flex items-center justify-center flex-col">
                <div 
                  className="w-40 h-40 bg-muted flex items-center justify-center rounded-md relative mb-4 cursor-pointer"
                  onClick={handleLogoClick}
                >
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company Logo" 
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <>
                      <Image className="w-10 h-10 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {t('settings.logo')}
                      </span>
                    </>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-md">
                    <Button variant="secondary" size="sm" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      {t('settings.import')}
                    </Button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                />
                <p className="text-sm text-muted-foreground">
                  {t('settings.logoFormat')}
                </p>
              </div>

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
                  onClick={cancelEditing}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
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
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 bg-muted flex items-center justify-center rounded-md overflow-hidden">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Company Logo" 
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Image className="w-10 h-10 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-2">
                      {t('settings.logo')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>{t('settings.companyName')}</Label>
                <div className="p-2 border rounded-md bg-muted/10 mt-1">
                  {form.getValues().nom_entreprise || '-'}
                </div>
              </div>
              
              <div>
                <Label>{t('settings.address')}</Label>
                <div className="p-2 border rounded-md bg-muted/10 mt-1 whitespace-pre-line">
                  {form.getValues().adresse || '-'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('settings.email')}</Label>
                  <div className="p-2 border rounded-md bg-muted/10 mt-1">
                    {form.getValues().email || '-'}
                  </div>
                </div>
                <div>
                  <Label>{t('settings.phone')}</Label>
                  <div className="p-2 border rounded-md bg-muted/10 mt-1">
                    {form.getValues().telephone || '-'}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>{t('settings.rib')}</Label>
                <div className="p-2 border rounded-md bg-muted/10 mt-1">
                  {form.getValues().rib || '-'}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={startEditing} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
