
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleDollarSign, Image, Save, Upload, Percent } from "lucide-react";
import { useState } from "react";
import { TaxePersonnaliseeManager } from "@/components/taxes/TaxePersonnaliseeManager";
import { TaxePersonnalisee } from "@/types";
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/components/settings/LanguageSelector";

const ParametresPage = () => {
  const [taxeEnValeur, setTaxeEnValeur] = useState(false);
  const [taxesPersonnalisees, setTaxesPersonnalisees] = useState<TaxePersonnalisee[]>([
    { id: "1", nom: "TVA standard", montant: 20, estMontantFixe: false },
    { id: "2", nom: "Éco-contribution", montant: 5, estMontantFixe: true }
  ]);
  const [devise, setDevise] = useState("TND");
  const { t } = useTranslation();

  return (
    <MainLayout title={t('settings.title')}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h2>
          <p className="text-muted-foreground">
            {t('settings.generalSettingsDesc')}
          </p>
        </div>
      </div>

      <Tabs defaultValue="entreprise">
        <TabsList className="mb-4">
          <TabsTrigger value="entreprise">{t('settings.companyTab')}</TabsTrigger>
          <TabsTrigger value="facturation">{t('settings.billingTab')}</TabsTrigger>
          <TabsTrigger value="taxes">{t('settings.taxesTab')}</TabsTrigger>
          <TabsTrigger value="general">{t('settings.generalTab')}</TabsTrigger>
          <TabsTrigger value="utilisateurs">{t('settings.usersTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="entreprise">
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
                    defaultValue="Votre Entreprise"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">{t('settings.siret')}</Label>
                  <Input
                    id="siret"
                    placeholder={t('settings.siret')}
                    defaultValue="123 456 789 00012"
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
                    defaultValue="contact@votreentreprise.fr"
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
                  <Label htmlFor="website">{t('settings.website')}</Label>
                  <Input
                    id="website"
                    placeholder={t('settings.website')}
                    defaultValue="www.votreentreprise.fr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rib">{t('settings.bankDetails')}</Label>
                  <Input
                    id="rib"
                    placeholder="IBAN"
                    defaultValue="FR76 1234 5678 9101 1121 3141 5161"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t('settings.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facturation">
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
                  <Select defaultValue="30">
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="resetNumberingAnnually" className="text-sm">
                      {t('settings.resetNumberingAnnually')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('settings.resetNumberingAnnuallyDesc')}
                    </p>
                  </div>
                  <Switch id="resetNumberingAnnually" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceFooter">
                  {t('settings.invoiceFooter')}
                </Label>
                <Textarea
                  id="invoiceFooter"
                  rows={3}
                  defaultValue="Merci pour votre confiance. Pour toute question concernant cette facture, veuillez nous contacter."
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t('settings.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
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

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t('settings.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
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
                    <SelectItem value="TND">Dinar Tunisien (TND)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                    <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                    <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                    <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t('settings.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilisateurs">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.userManagement')}</CardTitle>
              <CardDescription>
                {t('settings.userManagementDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {t('settings.userManagementUnavailable')}
                </p>
                <Button variant="outline" disabled>
                  {t('settings.addUser')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ParametresPage;
