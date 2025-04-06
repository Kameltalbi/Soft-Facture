
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

const ParametresPage = () => {
  const [taxeEnValeur, setTaxeEnValeur] = useState(false);
  const [taxesPersonnalisees, setTaxesPersonnalisees] = useState<TaxePersonnalisee[]>([
    { id: "1", nom: "TVA standard", montant: 20, estMontantFixe: false },
    { id: "2", nom: "Éco-contribution", montant: 5, estMontantFixe: true }
  ]);

  return (
    <MainLayout title="Paramètres">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">
            Configurez les paramètres de votre application de facturation.
          </p>
        </div>
      </div>

      <Tabs defaultValue="entreprise">
        <TabsList className="mb-4">
          <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
          <TabsTrigger value="facturation">Facturation</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="entreprise">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Ces informations apparaîtront sur vos factures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-6 flex items-center justify-center flex-col">
                <div className="w-40 h-40 bg-muted flex items-center justify-center rounded-md relative mb-4">
                  <Image className="w-10 h-10 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Logo de l'entreprise
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-md">
                    <Button variant="secondary" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Format recommandé : 200x200 px (PNG, JPG)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    placeholder="Votre Entreprise"
                    defaultValue="Votre Entreprise"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    placeholder="SIRET"
                    defaultValue="123 456 789 00012"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  placeholder="Adresse complète"
                  rows={3}
                  defaultValue="123 Rue de Paris, 75001 Paris, France"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@votreentreprise.fr"
                    defaultValue="contact@votreentreprise.fr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    placeholder="01 23 45 67 89"
                    defaultValue="01 23 45 67 89"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    placeholder="www.votreentreprise.fr"
                    defaultValue="www.votreentreprise.fr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rib">Coordonnées bancaires (RIB)</Label>
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
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facturation">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de facturation</CardTitle>
              <CardDescription>
                Personnalisez le format et les options de vos factures.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Préfixe des factures</Label>
                  <Input
                    id="invoicePrefix"
                    placeholder="FAC"
                    defaultValue="FAC2025-"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextInvoiceNumber">
                    Prochain numéro de facture
                  </Label>
                  <Input id="nextInvoiceNumber" defaultValue="005" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentTerms">
                    Délai de paiement par défaut
                  </Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un délai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Paiement immédiat</SelectItem>
                      <SelectItem value="15">15 jours</SelectItem>
                      <SelectItem value="30">30 jours</SelectItem>
                      <SelectItem value="45">45 jours</SelectItem>
                      <SelectItem value="60">60 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise par défaut</Label>
                  <Select defaultValue="EUR">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
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
                <h3 className="font-medium">Options de numérotation</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="resetNumberingAnnually" className="text-sm">
                      Réinitialiser la numérotation chaque année
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      La numérotation recommencera à 001 au début de chaque année
                    </p>
                  </div>
                  <Switch id="resetNumberingAnnually" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceFooter">
                  Pied de page des factures
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
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de taxes</CardTitle>
              <CardDescription>
                Configurez les taux de TVA et autres taxes applicables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="applyVAT" className="text-base font-medium">
                    Appliquer la TVA par défaut
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activez cette option pour appliquer automatiquement la TVA aux
                    nouvelles factures
                  </p>
                </div>
                <Switch id="applyVAT" defaultChecked />
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <Label htmlFor="taxeEnValeur" className="text-base font-medium">
                    Taxe en valeur par défaut
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activez cette option pour saisir les taxes en montant plutôt qu'en pourcentage
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
                    {taxeEnValeur ? "Montant de taxe par défaut" : "Taux de TVA par défaut"}
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
                <h3 className="font-medium">Taux de TVA disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vatRate1">Taux normal</Label>
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
                    <Label htmlFor="vatRate2">Taux intermédiaire</Label>
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
                    <Label htmlFor="vatRate3">Taux réduit</Label>
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
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilisateurs">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Gérez les accès et les permissions des utilisateurs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  La gestion des utilisateurs sera disponible dans une prochaine mise à jour.
                </p>
                <Button variant="outline" disabled>
                  Ajouter un utilisateur
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
