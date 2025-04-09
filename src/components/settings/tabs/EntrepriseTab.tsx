
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/hooks/use-toast";
import { CompanyInfoForm, CompanyFormValues } from "../components/CompanyInfoForm";
import { CompanyInfoDisplay } from "../components/CompanyInfoDisplay";
import { fetchCompanyData, saveCompanyData } from "../components/EntrepriseService";

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
          console.log("Données entreprise chargées:", data);
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
      
      console.log("Sauvegarde des données:", updateData);
      
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
    if (onCancel) {
      onCancel();
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
    </Card>
  );
}
