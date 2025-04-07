
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "../settings/LanguageSelector";

interface FactureSettingsPanelProps {
  applyTVA: boolean;
  setApplyTVA: (apply: boolean) => void;
  showDiscount: boolean;
  setShowDiscount: (show: boolean) => void;
  showAdvancePayment: boolean;
  setShowAdvancePayment: (show: boolean) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

export function FactureSettingsPanel({
  applyTVA,
  setApplyTVA,
  showDiscount,
  setShowDiscount,
  showAdvancePayment,
  setShowAdvancePayment,
  currency,
  setCurrency,
}: FactureSettingsPanelProps) {
  const { t } = useTranslation();
  
  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="text-base">{t('settings.invoiceSettings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tva" className="cursor-pointer">
              {t('settings.applySalesTax')}
            </Label>
            <Switch
              id="tva"
              checked={applyTVA}
              onCheckedChange={setApplyTVA}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="discount" className="cursor-pointer">
              {t('settings.showDiscount')}
            </Label>
            <Switch
              id="discount"
              checked={showDiscount}
              onCheckedChange={setShowDiscount}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="advance" className="cursor-pointer">
              {t('settings.advancePayment')}
            </Label>
            <Switch
              id="advance"
              checked={showAdvancePayment}
              onCheckedChange={setShowAdvancePayment}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="currency">{t('settings.currency')}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder={t('settings.selectCurrency')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TND">Dinar Tunisien (TND)</SelectItem>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="USD">Dollar US ($)</SelectItem>
              <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
              <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
              <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <LanguageSelector />
      </CardContent>
    </Card>
  );
}
