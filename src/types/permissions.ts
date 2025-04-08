
// Permission types
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'cancel' | 'validate' | 'pay';
export type PermissionResource = 'factures' | 'devis' | 'bonDeSortie' | 'clients' | 'produits' | 'categories' | 'parametres';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: PermissionResource;
  action: PermissionAction;
}

export type UserPermissions = Record<string, boolean>;
