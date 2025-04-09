
import { useTranslation } from "react-i18next";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { chartConfig } from "./chartConfig";

interface RevenueChartProps {
  data: {
    name: string;
    montant: number;
  }[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="h-80">
      <ChartContainer config={chartConfig}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="montant" 
            name={t('dashboard.revenue')} 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
