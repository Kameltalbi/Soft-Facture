
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  changePercentage?: number;
  changeMessage?: string;
  icon: ReactNode;
  progressValue?: number;
  secondaryValue?: string | ReactNode;
}

export const StatCard = ({
  title,
  value,
  changePercentage,
  changeMessage,
  icon,
  progressValue = 0,
  secondaryValue
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(changePercentage || changeMessage) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {changePercentage && (
              <span className="text-invoice-blue-500 flex items-center font-medium">
                <ChevronUp className="h-3 w-3 mr-0.5" />
                {changePercentage}%
              </span>
            )}
            {changeMessage && <span>{changeMessage}</span>}
          </div>
        )}
        {secondaryValue && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {secondaryValue}
          </div>
        )}
        <div className="mt-4">
          <Progress value={progressValue} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
};
