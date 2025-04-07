
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface TopBarProps {
  title: string;
}

const TopBar = ({ title }: TopBarProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b">
      <h1 className="text-2xl font-semibold">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('common.search')}
            className="w-64 pl-9 rounded-full bg-secondary"
          />
        </div>
        
        <Button size="icon" variant="outline" className="rounded-full relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-invoice-blue-500 text-[10px] text-white">
            3
          </span>
        </Button>
        
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-invoice-blue-500 flex items-center justify-center text-white font-medium">
            JD
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
