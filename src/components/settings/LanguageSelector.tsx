
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="language">{t('settings.language')}</Label>
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger>
          <SelectValue placeholder={t('settings.selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">{t('settings.french')}</SelectItem>
          <SelectItem value="en">{t('settings.english')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default LanguageSelector;
