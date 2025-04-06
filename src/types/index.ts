
// Client Types
export interface Client {
  id: string;
  nom: string;
  societe?: string;
  email: string;
  telephone?: string;
  adresse?: string;
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

// Invoice Types
export interface LigneProduit {
  id: string;
  produitId: string;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  tauxTVA: number;
  remise?: number;
  sousTotal: number;
}

export type StatutFacture = 'brouillon' | 'envoyee' | 'payee' | 'retard';

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
}
