
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { useTranslation } from "react-i18next";
import { availablePermissions } from "@/components/users/permissions/permissionsData";
import { UserPermissions } from "@/types/permissions";

const ParametresPage = () => {
  const { t } = useTranslation();

  // Check for currency, user settings and company info on page load
  useEffect(() => {
    // In a real app, you might load settings from an API or more robust storage
    const storedCurrency = localStorage.getItem('defaultCurrency');
    
    // Set the global currency in local storage if it's not already set
    if (!storedCurrency) {
      localStorage.setItem('defaultCurrency', 'TND'); // Default
    }
    
    // Initialize admin user with all permissions if not already in localStorage
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

    // Initialize company info if not already in localStorage
    const storedCompanyInfo = localStorage.getItem('companyInfo');
    if (!storedCompanyInfo) {
      const defaultCompanyInfo = {
        name: "Votre Entreprise",
        address: "123 Rue de Paris, 75001 Paris, France",
        email: "contact@votreentreprise.fr",
        phone: "01 23 45 67 89",
        iban: "FR76 1234 5678 9101 1121 3141 5161",
        swift: "BFRPFRPP",
        rib: ""
      };
      
      localStorage.setItem('companyInfo', JSON.stringify(defaultCompanyInfo));
    }
  }, []);

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

      <SettingsTabs />
    </MainLayout>
  );
};

export default ParametresPage;
