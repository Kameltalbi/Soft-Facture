
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/hooks/use-toast";

interface CompanyLogoProps {
  logoPreview: string | null;
  setLogoPreview: (logo: string | null) => void;
  isEditing: boolean;
}

export function CompanyLogo({ logoPreview, setLogoPreview, isEditing }: CompanyLogoProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image/jpeg|image/png|image/svg+xml')) {
        toast({
          title: "Erreur",
          description: t('settings.logoFormatError'),
          variant: "destructive"
        });
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        // Store in localStorage as a backup
        localStorage.setItem('companyLogo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <>
      {isEditing ? (
        <div className="border rounded-md p-6 flex items-center justify-center flex-col">
          <div 
            className="w-40 h-40 bg-muted flex items-center justify-center rounded-md relative mb-4 cursor-pointer"
            onClick={handleLogoClick}
          >
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Company Logo" 
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              <>
                <Image className="w-10 h-10 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {t('settings.logo')}
                </span>
              </>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-md">
              <Button variant="secondary" size="sm" type="button">
                <Upload className="h-4 w-4 mr-2" />
                {t('settings.import')}
              </Button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleLogoUpload}
          />
          <p className="text-sm text-muted-foreground">
            {t('settings.logoFormat')}
          </p>
        </div>
      ) : (
        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 bg-muted flex items-center justify-center rounded-md overflow-hidden">
            {logoPreview ? (
              <img 
                src={logoPreview} 
                alt="Company Logo" 
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Image className="w-10 h-10 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-2">
                  {t('settings.logo')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
