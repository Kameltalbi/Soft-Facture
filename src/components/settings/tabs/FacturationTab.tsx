import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

interface FacturationTabProps {
  devise: string;
  setDevise: (value: string) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function FacturationTab({ devise, setDevise, onSave, onCancel }: FacturationTabProps) {
  const { t } = useTranslation();
  const [resetNumberingOption, setResetNumberingOption] = useState('annually');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.billingSettings')}</CardTitle>
        <CardDescription>
          {t('settings.billingSettingsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoicePrefix">{t('settings.invoicePrefix')}</Label>
            <Input
              id="invoicePrefix"
              placeholder="FAC"
              defaultValue="FAC2025-"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextInvoiceNumber">
              {t('settings.nextInvoiceNumber')}
            </Label>
            <Input id="nextInvoiceNumber" defaultValue="005" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultPaymentTerms">
              {t('settings.defaultPaymentTerms')}
            </Label>
            <Select defaultValue="0">
              <SelectTrigger>
                <SelectValue placeholder={t('settings.defaultPaymentTerms')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('settings.defaultPaymentTermsImmediate')}</SelectItem>
                <SelectItem value="15">{t('settings.defaultPaymentTerms15')}</SelectItem>
                <SelectItem value="30">{t('settings.defaultPaymentTerms30')}</SelectItem>
                <SelectItem value="45">{t('settings.defaultPaymentTerms45')}</SelectItem>
                <SelectItem value="60">{t('settings.defaultPaymentTerms60')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">{t('settings.currency')}</Label>
            <Select value={devise} onValueChange={setDevise}>
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
        </div>

        <div className="border p-4 rounded-md space-y-4">
          <h3 className="font-medium">{t('settings.numberingOptions')}</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label htmlFor="resetNumberingAnnually" className="text-sm">
                {t('settings.resetNumberingAnnually')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t('settings.resetNumberingAnnuallyDesc')}
              </p>
            </div>
            <Switch 
              id="resetNumberingAnnually" 
              checked={resetNumberingOption === 'annually'} 
              onCheckedChange={(checked) => {
                if (checked) setResetNumberingOption('annually');
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="resetNumberingMonthly" className="text-sm">
                Réinitialiser la numérotation mensuellement
              </Label>
              <p className="text-xs text-muted-foreground">
                La numérotation des factures recommencera à 001 au début de chaque mois
              </p>
            </div>
            <Switch 
              id="resetNumberingMonthly" 
              checked={resetNumberingOption === 'monthly'} 
              onCheckedChange={(checked) => {
                if (checked) setResetNumberingOption('monthly');
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel || (() => {})}>
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
