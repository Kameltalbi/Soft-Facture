
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "../settings/LanguageSelector";
import { useEffect } from "react";
import { getDefaultDeviseCode, getDeviseOptions } from "@/utils/formatters";

interface BonDeSortieSettingsPanelProps {
  applyTVA: boolean;
  setApplyTVA: (apply: boolean) => void;
  showDiscount: boolean;
  setShowDiscount: (show: boolean) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

export function BonDeSortieSettingsPanel({
  applyTVA,
  setApplyTVA,
  showDiscount,
  setShowDiscount,
  currency,
  setCurrency,
}: BonDeSortieSettingsPanelProps) {
  const { t } = useTranslation();
  const deviseOptions = getDeviseOptions();
  
  // Load default currency when component mounts
  useEffect(() => {
    const defaultCurrency = getDefaultDeviseCode();
    if (!currency) {
      setCurrency(defaultCurrency);
    }
    
    // Save selected currency to localStorage when it changes
    if (currency) {
      localStorage.setItem('defaultCurrency', currency);
    }
  }, [currency, setCurrency]);
  
  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="text-base">{t('deliveryNote.settings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tva-bon-sortie" className="cursor-pointer">
              {t('settings.applySalesTax')}
            </Label>
            <Switch
              id="tva-bon-sortie"
              checked={applyTVA}
              onCheckedChange={setApplyTVA}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="discount-bon-sortie" className="cursor-pointer">
              {t('settings.showDiscount')}
            </Label>
            <Switch
              id="discount-bon-sortie"
              checked={showDiscount}
              onCheckedChange={setShowDiscount}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="currency-bon-sortie">{t('settings.currency')}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency-bon-sortie">
              <SelectValue placeholder={t('settings.selectCurrency')} />
            </SelectTrigger>
            <SelectContent>
              {deviseOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <LanguageSelector />
      </CardContent>
    </Card>
  );
}
