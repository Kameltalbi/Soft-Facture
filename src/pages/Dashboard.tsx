
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import PeriodSelector, { DateRange } from "@/components/common/PeriodSelector";
import { RequireAuth } from "@/contexts/auth-context";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

const DashboardContent = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1), // Premier jour de l'année courante
    to: new Date()
  });
  
  const { data, loading, error } = useDashboardData(selectedPeriod);
  
  const handlePeriodChange = (dateRange: DateRange) => {
    setSelectedPeriod(dateRange);
  };
  
  return (
    <MainLayout title={t('common.dashboard')}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome')}</h2>
        <PeriodSelector onPeriodChange={handlePeriodChange} />
      </div>
      
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="text-xl text-muted-foreground">{t('common.loading')}</div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-40">
          <div className="text-xl text-destructive">{error}</div>
        </div>
      )}
      
      {data && (
        <>
          <DashboardStats summary={data.summary} />
          <DashboardCharts data={data} />
        </>
      )}
    </MainLayout>
  );
};

// Wrapper qui utilise RequireAuth pour protéger cette page
const Dashboard = () => {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
};

export default Dashboard;
