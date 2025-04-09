
import { useTranslation } from "react-i18next";
import { CircleDollarSign, Users, ReceiptText, AlertTriangle } from "lucide-react";
import { StatCard } from "./StatCard";

interface DashboardStatsProps {
  summary: {
    revenue: number;
    revenueGrowth: number;
    clients: number;
    clientsGrowth: number;
    invoices: number;
    invoicesGrowth: number;
    unpaidAmount: number;
    unpaidCount: number;
  };
}

export const DashboardStats = ({ summary }: DashboardStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t('dashboard.revenue')}
        value={`${summary.revenue.toLocaleString()} €`}
        changePercentage={summary.revenueGrowth}
        changeMessage={t('dashboard.vsLastMonth')}
        icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
        progressValue={65}
      />
      
      <StatCard
        title={t('dashboard.activeClients')}
        value={summary.clients}
        changePercentage={summary.clientsGrowth}
        changeMessage={t('dashboard.vsLastMonth')}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        progressValue={48}
      />
      
      <StatCard
        title={t('dashboard.issuedInvoices')}
        value={summary.invoices}
        changePercentage={summary.invoicesGrowth}
        changeMessage={t('dashboard.vsLastMonth')}
        icon={<ReceiptText className="h-4 w-4 text-muted-foreground" />}
        progressValue={72}
      />
      
      <StatCard
        title={t('dashboard.unpaidInvoices')}
        value={`${summary.unpaidAmount.toLocaleString()} €`}
        secondaryValue={(
          <span className="text-invoice-status-pending flex items-center font-medium">
            {summary.unpaidCount} {t('invoice.status.pending')}
          </span>
        )}
        icon={<AlertTriangle className="h-4 w-4 text-invoice-status-pending" />}
        progressValue={35}
      />
    </div>
  );
};
