
import MainLayout from "@/components/layout/MainLayout";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

const ParametresPage = () => {
  return (
    <MainLayout title="Paramètres">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">
            Configurez les paramètres de votre application
          </p>
        </div>
      </div>

      <SettingsTabs />
    </MainLayout>
  );
};

export default ParametresPage;
