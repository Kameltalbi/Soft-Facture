
import { useTranslation } from "react-i18next";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { chartConfig } from "./chartConfig";

interface InvoiceStatusChartProps {
  data: {
    name: string;
    payées: number;
    impayées: number;
  }[];
}

export const InvoiceStatusChart = ({ data }: InvoiceStatusChartProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="h-80">
      <ChartContainer config={chartConfig}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="payées" 
            name={t('dashboard.paidInvoices')} 
            stroke="#10B981" 
            dot={{ r: 3 }} 
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="impayées" 
            name={t('dashboard.unpaidInvoices')} 
            stroke="#EF4444" 
            dot={{ r: 3 }} 
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
