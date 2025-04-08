
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { EntrepriseTab } from "./tabs/EntrepriseTab";
import { FacturationTab } from "./tabs/FacturationTab";
import { TaxesTab } from "./tabs/TaxesTab";
import { DeviseTab } from "./tabs/DeviseTab";
import { GeneralTab } from "./tabs/GeneralTab";
import { UtilisateursTab } from "./tabs/UtilisateursTab";
import { TaxePersonnalisee, Devise } from "@/types";
import { User } from "@/components/users/UserFormModal";
import { useToast } from "@/hooks/use-toast";

export function SettingsTabs() {
  const [taxeEnValeur, setTaxeEnValeur] = useState(false);
  const [taxesPersonnalisees, setTaxesPersonnalisees] = useState<TaxePersonnalisee[]>([
    { id: "1", nom: "TVA standard", montant: 20, estMontantFixe: false },
    { id: "2", nom: "Éco-contribution", montant: 5, estMontantFixe: true }
  ]);
  const [devise, setDevise] = useState("TND");
  const [resetNumberingOption, setResetNumberingOption] = useState("annually");
  const [devises, setDevises] = useState<Devise[]>([
    { id: "1", nom: "Dinar Tunisien", symbole: "TND", separateurMillier: " ", nbDecimales: 3, estParDefaut: true },
    { id: "2", nom: "Euro", symbole: "€", separateurMillier: " ", nbDecimales: 2, estParDefaut: false },
    { id: "3", nom: "Dollar US", symbole: "$", separateurMillier: ",", nbDecimales: 2, estParDefaut: false }
  ]);
  const [users, setUsers] = useState<User[]>([
    { id: "1", nom: "Admin Système", email: "admin@example.com", telephone: "+216 XX XXX XXX", motDePasse: "" }
  ]);
  
  const { t } = useTranslation();
  const { toast } = useToast();

  // Function to set a currency as default
  const setDefaultDevise = (symbole: string) => {
    const updatedDevises = devises.map(d => ({
      ...d,
      estParDefaut: d.symbole === symbole
    }));
    
    setDevises(updatedDevises);
    
    // Also set the current devise to the new default
    setDevise(symbole);
    
    // In a real app, you would save this to localStorage or a database
    localStorage.setItem('defaultCurrency', symbole);
  };

  const handleSaveGeneral = () => {
    // Set the current devise as default
    setDefaultDevise(devise);
    
    toast({
      title: t('settings.saveSuccess'),
      description: t('settings.saveSuccessDesc'),
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: t('settings.saveSuccess'),
      description: t('settings.saveSuccessDesc'),
    });
  };

  return (
    <Tabs defaultValue="entreprise">
      <TabsList className="mb-4">
        <TabsTrigger value="entreprise">{t('settings.companyTab')}</TabsTrigger>
        <TabsTrigger value="facturation">{t('settings.billingTab')}</TabsTrigger>
        <TabsTrigger value="taxes">{t('settings.taxesTab')}</TabsTrigger>
        <TabsTrigger value="devise">Devise</TabsTrigger>
        <TabsTrigger value="general">{t('settings.generalTab')}</TabsTrigger>
        <TabsTrigger value="utilisateurs">{t('settings.usersTab')}</TabsTrigger>
      </TabsList>

      <TabsContent value="entreprise">
        <EntrepriseTab onSave={handleSaveSettings} />
      </TabsContent>

      <TabsContent value="facturation">
        <FacturationTab
          devise={devise}
          setDevise={setDevise}
          onSave={handleSaveSettings}
        />
      </TabsContent>

      <TabsContent value="taxes">
        <TaxesTab
          taxesPersonnalisees={taxesPersonnalisees}
          setTaxesPersonnalisees={setTaxesPersonnalisees}
          taxeEnValeur={taxeEnValeur}
          setTaxeEnValeur={setTaxeEnValeur}
          onSave={handleSaveSettings}
        />
      </TabsContent>

      <TabsContent value="devise">
        <DeviseTab 
          devises={devises}
          setDevises={setDevises}
          onSave={handleSaveSettings}
        />
      </TabsContent>

      <TabsContent value="general">
        <GeneralTab
          devise={devise}
          setDevise={setDevise}
          devises={devises}
          onSave={handleSaveGeneral}
        />
      </TabsContent>

      <TabsContent value="utilisateurs">
        <UtilisateursTab
          users={users}
          setUsers={setUsers}
          onSave={handleSaveSettings}
        />
      </TabsContent>
    </Tabs>
  );
}
