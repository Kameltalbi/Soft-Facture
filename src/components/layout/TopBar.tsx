
import { Bell, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface TopBarProps {
  title: string;
}

const TopBar = ({ title }: TopBarProps) => {
  const { t, i18n } = useTranslation();
  const [isFrench, setIsFrench] = useState(i18n.language === 'fr');
  
  useEffect(() => {
    setIsFrench(i18n.language === 'fr');
  }, [i18n.language]);
  
  const toggleLanguage = () => {
    const newLang = isFrench ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    setIsFrench(!isFrench);
  };
  
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
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleLanguage} 
          className="flex items-center space-x-1 text-sm"
        >
          {isFrench ? (
            <div className="flex items-center">
              <span className="mr-2">FR</span>
              <ToggleRight className="h-5 w-5 text-invoice-blue-500" />
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">EN</span>
              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </Button>
        
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
