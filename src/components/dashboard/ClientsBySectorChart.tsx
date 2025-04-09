
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { chartConfig } from "./chartConfig";
import { COLORS } from "@/hooks/useDashboardData";

interface ClientsBySectorChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export const ClientsBySectorChart = ({ data }: ClientsBySectorChartProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="h-80 flex flex-col">
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            // Display only the sector name without any percentage or value
            label={({ name }) => `${name}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
};
