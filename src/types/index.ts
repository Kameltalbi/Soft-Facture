
// Client Types
export interface Client {
  id: string;
  nom: string;
  societe?: string;
  email: string;
  telephone?: string;
  adresse?: string;
  tva?: string;
}

// Product Types
export interface Produit {
  id: string;
  nom: string;
  prix: number;
  categorieId: string;
  tauxTVA: number;
  description?: string;
}

export interface Categorie {
  id: string;
  nom: string;
}

// Tax Types
export interface TaxePersonnalisee {
  id: string;
  nom: string;
  montant: number;
  estMontantFixe: boolean;
}

// Invoice Types
export interface LigneProduit {
  id: string;
  produitId: string;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  tauxTVA: number;
  montantTVA?: number; // Added field for direct tax amount
  estTauxTVA: boolean; // Flag to determine if TVA is a rate or an amount
  remise?: number;
  sousTotal: number;
}

export type StatutFacture = 'brouillon' | 'envoyee' | 'payee' | 'retard' | 'annulee';

export interface Facture {
  id: string;
  numero: string;
  clientId: string;
  client?: Client;
  dateCreation: string;
  dateEcheance: string;
  lignes: LigneProduit[];
  sousTotal: number;
  totalTVA: number;
  remiseGlobale?: number;
  avancePercue?: number;
  totalTTC: number;
  statut: StatutFacture;
  notes?: string;
}

// Settings Types
export interface Parametre {
  logoUrl?: string;
  nomEntreprise: string;
  adresse: string;
  telephone?: string;
  email: string;
  siteWeb?: string;
  siret?: string;
  rib?: string;
  devise: string;
  prefixeFacture: string;
  appliquerTVAParDefaut: boolean;
  tauxTVAParDefaut: number;
  taxeEnValeur: boolean; // Added field to determine the default tax input mode
  taxesPersonnalisees?: TaxePersonnalisee[]; // Added field to store custom taxes
}

// Modal Props Types
export interface FactureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factureId: string | null;
}

export interface BonDeSortieModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bonDeSortieId: string | null;
}

// Bon de Sortie Types
export interface LigneProduitBonDeSortie {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  tva: number;
  montantTVA: number;
  estTauxTVA: boolean;
  discount: number;
  total: number;
}

export interface BonDeSortie {
  id: string;
  numero: string;
  clientId: string;
  dateCreation: string;
  dateEcheance: string;
  lignes: LigneProduitBonDeSortie[];
  sousTotal: number;
  totalTVA: number;
  totalTTC: number;
  statut: StatutFacture;
  notes?: string;
}
