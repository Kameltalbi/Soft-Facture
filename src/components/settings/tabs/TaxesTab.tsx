import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Percent, CircleDollarSign, Save, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { TaxePersonnaliseeManager } from "@/components/taxes/TaxePersonnaliseeManager";
import { TaxePersonnalisee } from "@/types";

interface TaxesTabProps {
  taxesPersonnalisees: TaxePersonnalisee[];
  setTaxesPersonnalisees: (taxes: TaxePersonnalisee[]) => void;
  taxeEnValeur: boolean;
  setTaxeEnValeur: (value: boolean) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export function TaxesTab({ 
  taxesPersonnalisees, 
  setTaxesPersonnalisees, 
  taxeEnValeur, 
  setTaxeEnValeur, 
  onSave,
  onCancel 
}: TaxesTabProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.taxSettings')}</CardTitle>
        <CardDescription>
          {t('settings.taxSettingsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="applyVAT" className="text-base font-medium">
              {t('settings.applyVAT')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.applyVATDesc')}
            </p>
          </div>
          <Switch id="applyVAT" defaultChecked />
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <Label htmlFor="taxeEnValeur" className="text-base font-medium">
              {t('settings.taxInValue')}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t('settings.taxInValueDesc')}
            </p>
          </div>
          <Switch 
            id="taxeEnValeur" 
            checked={taxeEnValeur} 
            onCheckedChange={setTaxeEnValeur}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultVATRate">
              {taxeEnValeur ? t('settings.defaultVATAmount') : t('settings.defaultVATRate')}
            </Label>
            <div className="flex">
              <Input
                id="defaultVATRate"
                type="number"
                min="0"
                max={taxeEnValeur ? undefined : 100}
                defaultValue={taxeEnValeur ? "0" : "20"}
                className="rounded-r-none"
              />
              <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                {taxeEnValeur ? (
                  <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Percent className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border p-4 rounded-md space-y-4">
          <h3 className="font-medium">{t('settings.availableVATRates')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vatRate1">{t('settings.standardRate')}</Label>
              <div className="flex">
                <Input
                  id="vatRate1"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="20"
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                  <span>%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatRate2">{t('settings.intermediateRate')}</Label>
              <div className="flex">
                <Input
                  id="vatRate2"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="10"
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                  <span>%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatRate3">{t('settings.reducedRate')}</Label>
              <div className="flex">
                <Input
                  id="vatRate3"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="5.5"
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TaxePersonnaliseeManager 
          taxes={taxesPersonnalisees}
          onTaxesChange={setTaxesPersonnalisees}
        />

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
