
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/components/settings/LanguageSelector";
import { Devise } from "@/types";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface GeneralTabProps {
  devise: string;
  setDevise: (value: string) => void;
  devises: Devise[];
  onSave: () => void;
}

export function GeneralTab({ devise, setDevise, devises, onSave }: GeneralTabProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleSetDefaultCurrency = (value: string) => {
    // Update current currency
    setDevise(value);
    
    // Update the default flag in devises array
    // This would be handled by the parent component (SettingsTabs)
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
          
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="default-currency" className="cursor-pointer">
              {t('settings.setAsDefaultCurrency')}
            </Label>
            <Switch 
              id="default-currency"
              checked={devises.find(d => d.symbole === devise)?.estParDefaut || false}
              onCheckedChange={() => {
                toast({
                  title: t('settings.defaultCurrencyUpdated'),
                  description: t('settings.defaultCurrencyUpdatedDesc')
                });
                onSave();
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
