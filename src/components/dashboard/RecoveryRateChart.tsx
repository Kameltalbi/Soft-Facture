
import { useTranslation } from "react-i18next";
import { RadialBarChart, RadialBar } from "recharts";

interface RecoveryRateData {
  name: string;
  value: number;
  fill: string;
}

interface RecoveryRateChartProps {
  data: RecoveryRateData[];
}

export const RecoveryRateChart = ({ data }: RecoveryRateChartProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="h-80 w-full flex flex-col items-center">
      <RadialBarChart 
        width={320} 
        height={250} 
        innerRadius="60%" 
        outerRadius="100%" 
        data={data} 
        startAngle={180} 
        endAngle={0}
        barSize={30}
        cx="50%"
        cy="100%"
      >
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
          label={{
            position: 'insideStart',
            fill: '#fff',
            fontWeight: 'bold',
            // Return empty string to completely remove values from the chart
            formatter: () => '',
          }}
        />
      </RadialBarChart>
      
      <div className="flex justify-center items-center gap-6 mt-6">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.fill }}></div>
            <span className="text-sm font-medium">
              {t(`dashboard.${entry.name === 'payees' ? 'paidInvoices' : entry.name === 'en_attente' ? 'pendingInvoices' : 'unpaidInvoices'}`)} 
              {` ${entry.value}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
