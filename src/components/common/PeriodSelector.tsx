import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export interface DateRange {
  from: Date;
  to: Date;
}

// Add missing prop to the interface
export interface PeriodSelectorProps {
  initialValue?: DateRange;  // Add this property
  value?: DateRange;
  onChange?: (value: DateRange) => void;
  onPeriodChange?: (dateRange: DateRange) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ initialValue, value, onChange, onPeriodChange }) => {
  const [date, setDate] = useState<DateRange | undefined>(initialValue);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onChange) {
      onChange(newDate as DateRange);
    }
    if (onPeriodChange) {
      onPeriodChange(newDate as DateRange);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${format(date.from, "MMM dd, yyyy")} - ${format(
                date.to,
                "MMM dd, yyyy"
              )}`
            ) : (
              format(date.from, "MMM dd, yyyy")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={date}
          onSelect={handleDateChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default PeriodSelector;
