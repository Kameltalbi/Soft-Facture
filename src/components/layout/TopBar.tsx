
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface TopBarProps {
  title: string;
}

const TopBar = ({ title }: TopBarProps) => {
  const { t, i18n } = useTranslation();
  const [isFrench, setIsFrench] = useState(i18n.language === 'fr');
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("Soft-Facture");
  
  useEffect(() => {
    setIsFrench(i18n.language === 'fr');
  }, [i18n.language]);
  
  useEffect(() => {
    // Initialize with current date/time
    updateDateTime();
    
    // Update the date/time every second
    const intervalId = setInterval(updateDateTime, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Load company name from localStorage if available
  useEffect(() => {
    const storedCompanyName = localStorage.getItem('companyName');
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    }
  }, []);
  
  const updateDateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    setCurrentDateTime(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
  };
  
  const toggleLanguage = () => {
    const newLang = isFrench ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
    setIsFrench(!isFrench);
  };
  
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b">
      <h1 className="text-2xl font-semibold">{title}</h1>
      
      {/* Centered company name and date/time element */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <div className="font-bold text-invoice-blue-600 text-[16px] mb-1">
          {companyName}
        </div>
        <div className="font-bold text-[#228B22] text-[14px]">
          {currentDateTime}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
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
