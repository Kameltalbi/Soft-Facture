
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

  // Check for currency, user settings on page load
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

        // Check for billing settings
        const { data: billingData, error: billingError } = await (supabase as any)
          .from('billing_settings')
          .select('*')
          .limit(1);

        if (billingError) {
          console.error("Erreur lors de la récupération des paramètres de facturation:", billingError);
        } else if (!billingData || billingData.length === 0) {
          // Initialize billing settings if they don't exist
          const { error: billingInsertError } = await (supabase as any)
            .from('billing_settings')
            .insert({});
              
          if (billingInsertError) {
            console.error("Erreur lors de l'initialisation des paramètres de facturation:", billingInsertError);
          }
        }

        // Check for tax settings
        const { data: taxData, error: taxError } = await (supabase as any)
          .from('tax_settings')
          .select('*')
          .limit(1);

        if (taxError) {
          console.error("Erreur lors de la récupération des paramètres de taxes:", taxError);
        } else if (!taxData || taxData.length === 0) {
          // Initialize tax settings if they don't exist
          const { error: taxInsertError } = await (supabase as any)
            .from('tax_settings')
            .insert({});
              
          if (taxInsertError) {
            console.error("Erreur lors de l'initialisation des paramètres de taxes:", taxInsertError);
          }
        }

        // Check for currency settings
        const { data: currencyData, error: currencyError } = await (supabase as any)
          .from('currency_settings')
          .select('*')
          .limit(1);

        if (currencyError) {
          console.error("Erreur lors de la récupération des paramètres de devise:", currencyError);
        } else if (!currencyData || currencyData.length === 0) {
          // Initialize currency settings if they don't exist
          const { error: currencyInsertError } = await (supabase as any)
            .from('currency_settings')
            .insert({});
              
          if (currencyInsertError) {
            console.error("Erreur lors de l'initialisation des paramètres de devise:", currencyInsertError);
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
