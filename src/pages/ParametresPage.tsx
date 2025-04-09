
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { useTranslation } from "react-i18next";
import { availablePermissions } from "@/components/users/permissions/permissionsData";
import { UserPermissions } from "@/types/permissions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ParametresPage = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for currency, user settings and company info on page load
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsLoading(true);
        
        // Check if default currency exists in localStorage
        const storedCurrency = localStorage.getItem('defaultCurrency');
        if (!storedCurrency) {
          localStorage.setItem('defaultCurrency', 'TND'); // Default
        }
        
        // Check for users in localStorage
        const storedUsers = localStorage.getItem('users');
        if (!storedUsers) {
          // Create default admin with all permissions
          const allPermissions: UserPermissions = {};
          availablePermissions.forEach(permission => {
            allPermissions[permission.id] = true;
          });
          
          const adminUser = {
            id: "1",
            nom: "Admin Système",
            email: "admin@example.com",
            telephone: "+216 XX XXX XXX",
            motDePasse: "admin123", // In a real app, this would be hashed
            permissions: allPermissions
          };
          
          localStorage.setItem('users', JSON.stringify([adminUser]));
        }

        // Fetch company info from Supabase
        const { data: parametresData, error } = await supabase
          .from('parametres')
          .select('*')
          .limit(1);

        if (error) {
          console.error("Erreur lors de la récupération des paramètres:", error);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les paramètres de l'entreprise.",
            variant: "destructive"
          });
          return;
        }
          
        // If no data found, initialize with default values in Supabase
        if (!parametresData || parametresData.length === 0) {
          const defaultCompanyInfo = {
            nom_entreprise: "Votre Entreprise",
            adresse: "123 Rue de Paris, 75001 Paris, France",
            email: "contact@votreentreprise.fr",
            telephone: "01 23 45 67 89",
            rib: ""
          };
            
          const { error: insertError } = await supabase
            .from('parametres')
            .insert(defaultCompanyInfo);
              
          if (insertError) {
            console.error("Erreur lors de l'initialisation des paramètres:", insertError);
            toast({
              title: "Erreur",
              description: "Impossible d'initialiser les paramètres de l'entreprise.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des paramètres:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, [toast]);

  return (
    <MainLayout title="Paramètres">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h2>
          <p className="text-muted-foreground">
            {t('settings.subtitle')}
          </p>
        </div>
      </div>

      {!isLoading && <SettingsTabs />}
    </MainLayout>
  );
};

export default ParametresPage;
