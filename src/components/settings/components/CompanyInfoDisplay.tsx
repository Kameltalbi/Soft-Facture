
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { CompanyFormValues } from "./CompanyInfoForm";
import { CompanyLogo } from "./CompanyLogo";

interface CompanyInfoDisplayProps {
  companyData: CompanyFormValues;
  logoPreview: string | null;
  setLogoPreview: (logo: string | null) => void;
  onEdit: () => void;
}

export function CompanyInfoDisplay({ 
  companyData, 
  logoPreview, 
  setLogoPreview, 
  onEdit 
}: CompanyInfoDisplayProps) {
  const { t } = useTranslation();

  return (
    <>
      <CompanyLogo 
        logoPreview={logoPreview} 
        setLogoPreview={setLogoPreview} 
        isEditing={false}
      />

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>{t('settings.companyName')}</Label>
          <div className="p-2 border rounded-md bg-muted/10 mt-1">
            {companyData.nom_entreprise || '-'}
          </div>
        </div>
        
        <div>
          <Label>{t('settings.address')}</Label>
          <div className="p-2 border rounded-md bg-muted/10 mt-1 whitespace-pre-line">
            {companyData.adresse || '-'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t('settings.email')}</Label>
            <div className="p-2 border rounded-md bg-muted/10 mt-1">
              {companyData.email || '-'}
            </div>
          </div>
          <div>
            <Label>{t('settings.phone')}</Label>
            <div className="p-2 border rounded-md bg-muted/10 mt-1">
              {companyData.telephone || '-'}
            </div>
          </div>
        </div>
        
        <div>
          <Label>{t('settings.rib')}</Label>
          <div className="p-2 border rounded-md bg-muted/10 mt-1">
            {companyData.rib || '-'}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={onEdit} 
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4 mr-2" />
          {t('settings.edit')}
        </Button>
      </div>
    </>
  );
}
