
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Save, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/hooks/use-toast";
import { CompanyInfoForm, CompanyFormValues } from "../components/CompanyInfoForm";
import { CompanyInfoDisplay } from "../components/CompanyInfoDisplay";
import { fetchCompanyData, saveCompanyData } from "../components/EntrepriseService";
import { Button } from "@/components/ui/button";

interface EntrepriseTabProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export function EntrepriseTab({ onSave, onCancel }: EntrepriseTabProps) {
  const { t } = useTranslation();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyFormValues>({
    nom_entreprise: "",
    adresse: "",
    email: "",
    telephone: "",
    rib: ""
  });
  const { toast } = useToast();

  // Load company data from Supabase
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch company info
        const data = await fetchCompanyData();
        
        if (data) {
          // Set form values
          setCompanyData({
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

    loadCompanyData();
  }, []);

  const handleSaveAll = async (values: CompanyFormValues) => {
    try {
      setIsSaving(true);
      
      // Prepare data to update
      const updateData = {
        ...values,
        logo_url: logoPreview
      };
      
      // Update in Supabase
      await saveCompanyData(updateData);
      
      // Update local state
      setCompanyData(values);
      
      toast({
        title: "Succès",
        description: "Les informations de l'entreprise ont été sauvegardées avec succès.",
      });
      
      // Call the parent onSave callback
      if (onSave) {
        onSave();
      }
      
      // Exit edit mode
      setIsEditing(false);
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
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    cancelEditing();
    if (onCancel) {
      onCancel();
    }
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave();
    }
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
          <CompanyInfoForm
            initialValues={companyData}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
            onSave={handleSaveAll}
            onCancel={cancelEditing}
            isSaving={isSaving}
          />
        ) : (
          <CompanyInfoDisplay
            companyData={companyData}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
            onEdit={startEditing}
          />
        )}
      </CardContent>
      {!isEditing && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancelClick}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSaveClick}
            className="bg-primary text-primary-foreground"
          >
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
