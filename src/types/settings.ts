
// Type definitions for settings tables
export interface BillingSettings {
  id: string;
  prefixe_facture: string;
  prefixe_devis: string;
  prefixe_bon_sortie: string;
  siret: string | null;
  site_web: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaxSettings {
  id: string;
  taxe_en_valeur: boolean;
  taux_tva_par_defaut: number;
  appliquer_tva_par_defaut: boolean;
  created_at: string;
  updated_at: string;
}

export interface CurrencySettings {
  id: string;
  devise: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyInfo {
  id: string;
  nom: string;
  adresse: string;
  code_tva: string;
  telephone: string | null;
  email_contact: string | null;
  logo_url: string | null;
  site_web: string | null;
  created_at: string;
  updated_at: string;
}

export interface BankInfo {
  id: string;
  bank_name: string;
  rib: string;
  iban: string;
  swift: string;
  created_at: string;
  updated_at: string;
}
