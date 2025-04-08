
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "../settings/LanguageSelector";

interface BonDeCommandeSettingsPanelProps {
  applyTVA: boolean;
  setApplyTVA: (value: boolean) => void;
  showDiscount: boolean;
  setShowDiscount: (value: boolean) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

export function BonDeCommandeSettingsPanel({
  applyTVA,
  setApplyTVA,
  showDiscount,
  setShowDiscount,
  currency,
  setCurrency,
}: BonDeCommandeSettingsPanelProps) {
  const { t } = useTranslation();
  
  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="text-base">{t('purchaseOrder.settings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="apply-tva-bon-commande" className="cursor-pointer">
              {t('settings.applySalesTax')}
            </Label>
            <Switch
              id="apply-tva-bon-commande"
              checked={applyTVA}
              onCheckedChange={setApplyTVA}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-discount-bon-commande" className="cursor-pointer">
              {t('settings.showDiscount')}
            </Label>
            <Switch
              id="show-discount-bon-commande"
              checked={showDiscount}
              onCheckedChange={setShowDiscount}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="currency-bon-commande">{t('settings.currency')}</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency-bon-commande">
              <SelectValue placeholder={t('settings.selectCurrency')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TND">TND - Dinar Tunisien</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="USD">USD - Dollar Américain</SelectItem>
              <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
              <SelectItem value="CHF">CHF - Franc Suisse</SelectItem>
              <SelectItem value="CAD">CAD - Dollar Canadien</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <LanguageSelector />
      </CardContent>
    </Card>
  );
}
