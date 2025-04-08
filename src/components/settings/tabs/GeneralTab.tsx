
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/components/settings/LanguageSelector";
import { Devise } from "@/types";

interface GeneralTabProps {
  devise: string;
  setDevise: (value: string) => void;
  devises: Devise[];
  onSave: () => void;
}

export function GeneralTab({ devise, setDevise, devises, onSave }: GeneralTabProps) {
  const { t } = useTranslation();

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
        
        <div className="space-y-2">
          <Label htmlFor="currency">{t('settings.currency')}</Label>
          <Select value={devise} onValueChange={setDevise}>
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
