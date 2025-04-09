import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/components/settings/LanguageSelector";
import { Devise } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface GeneralTabProps {
  devise: string;
  setDevise: (value: string) => void;
  devises: Devise[];
  onSave: () => void;
  onCancel?: () => void;
}

export function GeneralTab({ devise, setDevise, devises, onSave, onCancel }: GeneralTabProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDefault, setIsDefault] = useState(false);

  // Check if the current currency is the default one
  useEffect(() => {
    const selectedDevise = devises.find(d => d.symbole === devise);
    setIsDefault(selectedDevise?.estParDefaut || false);
  }, [devise, devises]);

  const handleSetDefaultCurrency = (value: string) => {
    // Update current currency
    setDevise(value);
  };

  const handleDefaultChange = (checked: boolean) => {
    setIsDefault(checked);
    if (checked) {
      // Save immediately when checkbox is checked
      localStorage.setItem('defaultCurrency', devise);
      
      toast({
        title: t('settings.defaultCurrencyUpdated'),
        description: t('settings.defaultCurrencyUpdatedDesc')
      });
      
      // Call the save handler from parent
      onSave();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.generalSettings')}</CardTitle>
        <CardDescription>
          {t('settings.generalSettingsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-md">
          <LanguageSelector />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="currency">{t('settings.currency')}</Label>
          <Select value={devise} onValueChange={handleSetDefaultCurrency}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={t('settings.selectCurrency')} />
            </SelectTrigger>
            <SelectContent>
              {devises.map(devise => (
                <SelectItem key={devise.id} value={devise.symbole}>
                  {devise.nom} ({devise.symbole})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="default-currency" 
              checked={isDefault}
              onCheckedChange={handleDefaultChange}
            />
            <Label htmlFor="default-currency" className="cursor-pointer">
              {t('settings.setAsDefaultCurrency')}
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel || (() => {})}
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel')}
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
