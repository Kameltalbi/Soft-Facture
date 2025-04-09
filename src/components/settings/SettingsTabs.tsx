
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { FacturationTab } from "./tabs/FacturationTab";
import { TaxesTab } from "./tabs/TaxesTab";
import { DeviseTab } from "./tabs/DeviseTab";
import { GeneralTab } from "./tabs/GeneralTab";
import { UtilisateursTab } from "./tabs/UtilisateursTab";
import { SocieteTab } from "./tabs/SocieteTab";
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
  const [users, setUsers] = useState<User[]>([]);
  
  const { t } = useTranslation();
  const { toast } = useToast();

  // Load users and default currency on component mount
  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error("Failed to parse users from localStorage:", error);
      }
    }
    
    // Load default currency
    const storedCurrency = localStorage.getItem('defaultCurrency');
    if (storedCurrency) {
      // Update the current devise state
      setDevise(storedCurrency);
      
      // Update the devises array to reflect the current default
      setDevises(prevDevises => prevDevises.map(d => ({
        ...d,
        estParDefaut: d.symbole === storedCurrency
      })));
    }
  }, []);

  // Save users to localStorage when they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // Function to set a currency as default
  const setDefaultDevise = (symbole: string) => {
    const updatedDevises = devises.map(d => ({
      ...d,
      estParDefaut: d.symbole === symbole
    }));
    
    setDevises(updatedDevises);
    
    // Also set the current devise to the new default
    setDevise(symbole);
    
    // Save to localStorage
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

  const handleSaveUsers = () => {
    // Save users to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    toast({
      title: t('settings.saveSuccess'),
      description: "Les utilisateurs ont été enregistrés avec succès.",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: t('settings.saveSuccess'),
      description: t('settings.saveSuccessDesc'),
    });
  };

  const handleCancel = () => {
    toast({
      title: t('settings.cancelChanges'),
      description: t('settings.cancelChangesDesc'),
    });
  };

  return (
    <Tabs defaultValue="societe">
      <TabsList className="mb-4">
        <TabsTrigger value="societe">Société</TabsTrigger>
        <TabsTrigger value="facturation">{t('settings.billingTab')}</TabsTrigger>
        <TabsTrigger value="taxes">{t('settings.taxesTab')}</TabsTrigger>
        <TabsTrigger value="devise">Devise</TabsTrigger>
        <TabsTrigger value="general">{t('settings.generalTab')}</TabsTrigger>
        <TabsTrigger value="utilisateurs">{t('settings.usersTab')}</TabsTrigger>
      </TabsList>

      <TabsContent value="societe">
        <SocieteTab 
          onSave={handleSaveSettings}
          onCancel={handleCancel}
        />
      </TabsContent>

      <TabsContent value="facturation">
        <FacturationTab
          devise={devise}
          setDevise={setDevise}
          onSave={handleSaveSettings}
          onCancel={handleCancel}
        />
      </TabsContent>

      <TabsContent value="taxes">
        <TaxesTab
          taxesPersonnalisees={taxesPersonnalisees}
          setTaxesPersonnalisees={setTaxesPersonnalisees}
          taxeEnValeur={taxeEnValeur}
          setTaxeEnValeur={setTaxeEnValeur}
          onSave={handleSaveSettings}
          onCancel={handleCancel}
        />
      </TabsContent>

      <TabsContent value="devise">
        <DeviseTab 
          devises={devises}
          setDevises={setDevises}
          onSave={handleSaveSettings}
          onCancel={handleCancel}
        />
      </TabsContent>

      <TabsContent value="general">
        <GeneralTab
          devise={devise}
          setDevise={setDevise}
          devises={devises}
          onSave={handleSaveGeneral}
          onCancel={handleCancel}
        />
      </TabsContent>

      <TabsContent value="utilisateurs">
        <UtilisateursTab
          users={users}
          setUsers={setUsers}
          onSave={handleSaveUsers}
          onCancel={handleCancel}
        />
      </TabsContent>
    </Tabs>
  );
}
