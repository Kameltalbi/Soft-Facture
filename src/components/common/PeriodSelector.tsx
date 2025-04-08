
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DateRange {
  from: Date;
  to: Date;
}

interface PeriodSelectorProps {
  onPeriodChange: (dateRange: DateRange) => void;
}

const PeriodSelector = ({ onPeriodChange }: PeriodSelectorProps) => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current-month");
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  
  // Set up locale for date formatting
  const locale = i18n.language === "fr" ? fr : enUS;
  
  useEffect(() => {
    // Default to current month on initial load
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setCustomDateRange({
      from: firstDayOfMonth,
      to: lastDayOfMonth,
    });
    
    onPeriodChange({
      from: firstDayOfMonth,
      to: lastDayOfMonth,
    });
  }, [onPeriodChange]);
  
  useEffect(() => {
    if (selectedPeriod === "custom") {
      onPeriodChange(customDateRange);
      return;
    }
    
    const today = new Date();
    let dateRange: DateRange = { from: new Date(), to: new Date() };
    
    switch (selectedPeriod) {
      case "current-month":
        dateRange = {
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        };
        break;
      case "last-month":
        dateRange = {
          from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          to: new Date(today.getFullYear(), today.getMonth(), 0),
        };
        break;
      case "current-quarter":
        const currentQuarter = Math.floor(today.getMonth() / 3);
        dateRange = {
          from: new Date(today.getFullYear(), currentQuarter * 3, 1),
          to: new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0),
        };
        break;
      case "current-year":
        dateRange = {
          from: new Date(today.getFullYear(), 0, 1),
          to: new Date(today.getFullYear(), 11, 31),
        };
        break;
      default:
        break;
    }
    
    onPeriodChange(dateRange);
  }, [selectedPeriod, customDateRange, onPeriodChange]);
  
  const formatPeriodDisplay = () => {
    if (selectedPeriod === "custom") {
      return `${format(customDateRange.from, "dd/MM/yyyy")} - ${format(customDateRange.to, "dd/MM/yyyy")}`;
    }
    
    switch (selectedPeriod) {
      case "current-month":
        return format(new Date(), "MMMM yyyy", { locale });
      case "last-month":
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return format(lastMonth, "MMMM yyyy", { locale });
      case "current-quarter":
        const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;
        return `Q${currentQuarter} ${new Date().getFullYear()}`;
      case "current-year":
        return new Date().getFullYear().toString();
      default:
        return "";
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedPeriod}
        onValueChange={setSelectedPeriod}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('dashboard.selectPeriod')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="current-month">{t('dashboard.currentMonth')}</SelectItem>
          <SelectItem value="last-month">{t('dashboard.lastMonth')}</SelectItem>
          <SelectItem value="current-quarter">{t('dashboard.currentQuarter')}</SelectItem>
          <SelectItem value="current-year">{t('dashboard.currentYear')}</SelectItem>
          <SelectItem value="custom">{t('dashboard.customPeriod')}</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedPeriod === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatPeriodDisplay()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={customDateRange}
              onSelect={(range) => range && setCustomDateRange(range)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      )}
      
      {selectedPeriod !== "custom" && (
        <div className="bg-muted px-3 py-2 rounded-md text-sm">
          {formatPeriodDisplay()}
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;
