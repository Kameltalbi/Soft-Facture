
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RevenueChart } from "./RevenueChart";
import { RecoveryRateChart } from "./RecoveryRateChart";
import { ClientsBySectorChart } from "./ClientsBySectorChart";
import { InvoiceStatusChart } from "./InvoiceStatusChart";

interface DashboardChartsProps {
  data: {
    revenueData: {
      name: string;
      montant: number;
    }[];
    recoveryRateData: {
      name: string;
      value: number;
      fill: string;
    }[];
    pieData: {
      name: string;
      value: number;
    }[];
    invoiceStatusData: {
      name: string;
      payées: number;
      impayées: number;
    }[];
  };
}

export const DashboardCharts = ({ data }: DashboardChartsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Graphique 1: Évolution des revenus */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.revenueEvolution')}</CardTitle>
          <CardDescription>
            {t('dashboard.monthlyRevenueEvolution')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueChart data={data.revenueData} />
        </CardContent>
      </Card>

      {/* Graphique 2: Taux de recouvrement des factures */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recoveryRate')}</CardTitle>
          <CardDescription>
            {t('dashboard.recoveryRateDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecoveryRateChart data={data.recoveryRateData} />
        </CardContent>
      </Card>

      {/* Graphique 3: Répartition des clients par secteur */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.clientsBySector')}</CardTitle>
          <CardDescription>
            {t('dashboard.clientsBySectorDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsBySectorChart data={data.pieData} />
        </CardContent>
      </Card>

      {/* Graphique 4: Factures payées vs. impayées */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.invoiceStatus')}</CardTitle>
          <CardDescription>
            {t('dashboard.paidVsUnpaidInvoices')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceStatusChart data={data.invoiceStatusData} />
        </CardContent>
      </Card>
    </div>
  );
};
