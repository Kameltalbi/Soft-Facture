
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { useTranslation } from "react-i18next";

const ParametresPage = () => {
  const { t } = useTranslation();

  // Check for currency settings on page load
  useEffect(() => {
    // In a real app, you might load settings from an API or more robust storage
    const storedCurrency = localStorage.getItem('defaultCurrency');
    
    // Set the global currency in local storage if it's not already set
    if (!storedCurrency) {
      localStorage.setItem('defaultCurrency', 'TND'); // Default
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
