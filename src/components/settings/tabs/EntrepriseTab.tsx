
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image, Save, Upload } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

interface EntrepriseTabProps {
  onSave: () => void;
}

export function EntrepriseTab({ onSave }: EntrepriseTabProps) {
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState("Soft-Facture");

  // Load company name from localStorage on component mount
  useEffect(() => {
    const storedCompanyName = localStorage.getItem('companyName');
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    }
  }, []);

  const handleSave = () => {
    // Save company name to localStorage
    localStorage.setItem('companyName', companyName);
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.companyInfo')}</CardTitle>
        <CardDescription>
          {t('settings.companyInfoDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-md p-6 flex items-center justify-center flex-col">
          <div className="w-40 h-40 bg-muted flex items-center justify-center rounded-md relative mb-4">
            <Image className="w-10 h-10 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {t('settings.logo')}
            </span>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-md">
              <Button variant="secondary" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                {t('settings.import')}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('settings.logoFormat')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">{t('settings.companyName')}</Label>
            <Input
              id="companyName"
              placeholder={t('settings.companyName')}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rib">{t('settings.rib')}</Label>
            <Input
              id="rib"
              placeholder={t('settings.rib')}
              defaultValue=""
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t('settings.address')}</Label>
          <Textarea
            id="address"
            placeholder={t('settings.address')}
            rows={3}
            defaultValue="123 Rue de Paris, 75001 Paris, France"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('settings.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('settings.email')}
              defaultValue="contact@soft-facture.fr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('settings.phone')}</Label>
            <Input
              id="phone"
              placeholder={t('settings.phone')}
              defaultValue="01 23 45 67 89"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="iban">{t('settings.iban')}</Label>
            <Input
              id="iban"
              placeholder="IBAN"
              defaultValue="FR76 1234 5678 9101 1121 3141 5161"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="swift">{t('settings.swift')}</Label>
            <Input
              id="swift"
              placeholder="SWIFT"
              defaultValue="BFRPFRPP"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {t('settings.save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
