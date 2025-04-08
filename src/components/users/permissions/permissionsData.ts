
import { Permission } from "@/types/permissions";

// Define all available permissions
export const availablePermissions: Permission[] = [
  // Factures permissions
  { id: "factures-view", name: "Voir les factures", description: "Accès à la page des factures", resource: "factures", action: "view" },
  { id: "factures-create", name: "Créer des factures", description: "Créer de nouvelles factures", resource: "factures", action: "create" },
  { id: "factures-edit", name: "Modifier les factures", description: "Modifier les factures existantes", resource: "factures", action: "edit" },
  { id: "factures-delete", name: "Supprimer les factures", description: "Supprimer des factures", resource: "factures", action: "delete" },
  { id: "factures-cancel", name: "Annuler les factures", description: "Annuler des factures", resource: "factures", action: "cancel" },
  { id: "factures-validate", name: "Valider les factures", description: "Valider des factures", resource: "factures", action: "validate" },
  { id: "factures-pay", name: "Marquer les factures comme payées", description: "Marquer les factures comme payées", resource: "factures", action: "pay" },
  
  // Devis permissions
  { id: "devis-view", name: "Voir les devis", description: "Accès à la page des devis", resource: "devis", action: "view" },
  { id: "devis-create", name: "Créer des devis", description: "Créer de nouveaux devis", resource: "devis", action: "create" },
  { id: "devis-edit", name: "Modifier les devis", description: "Modifier les devis existants", resource: "devis", action: "edit" },
  { id: "devis-delete", name: "Supprimer les devis", description: "Supprimer des devis", resource: "devis", action: "delete" },
  { id: "devis-cancel", name: "Annuler les devis", description: "Annuler des devis", resource: "devis", action: "cancel" },
  { id: "devis-validate", name: "Valider les devis", description: "Valider des devis", resource: "devis", action: "validate" },
  
  // Bon de Sortie permissions
  { id: "bonDeSortie-view", name: "Voir les bons de sortie", description: "Accès à la page des bons de sortie", resource: "bonDeSortie", action: "view" },
  { id: "bonDeSortie-create", name: "Créer des bons de sortie", description: "Créer de nouveaux bons de sortie", resource: "bonDeSortie", action: "create" },
  { id: "bonDeSortie-edit", name: "Modifier les bons de sortie", description: "Modifier les bons de sortie existants", resource: "bonDeSortie", action: "edit" },
  { id: "bonDeSortie-delete", name: "Supprimer les bons de sortie", description: "Supprimer des bons de sortie", resource: "bonDeSortie", action: "delete" },
  
  // Clients permissions
  { id: "clients-view", name: "Voir les clients", description: "Accès à la page des clients", resource: "clients", action: "view" },
  { id: "clients-create", name: "Ajouter des clients", description: "Ajouter de nouveaux clients", resource: "clients", action: "create" },
  { id: "clients-edit", name: "Modifier les clients", description: "Modifier les informations des clients", resource: "clients", action: "edit" },
  { id: "clients-delete", name: "Supprimer les clients", description: "Supprimer des clients", resource: "clients", action: "delete" },
  
  // Produits permissions
  { id: "produits-view", name: "Voir les produits", description: "Accès à la page des produits", resource: "produits", action: "view" },
  { id: "produits-create", name: "Ajouter des produits", description: "Ajouter de nouveaux produits", resource: "produits", action: "create" },
  { id: "produits-edit", name: "Modifier les produits", description: "Modifier les informations des produits", resource: "produits", action: "edit" },
  { id: "produits-delete", name: "Supprimer les produits", description: "Supprimer des produits", resource: "produits", action: "delete" },
  
  // Categories permissions
  { id: "categories-view", name: "Voir les catégories", description: "Accès à la page des catégories", resource: "categories", action: "view" },
  { id: "categories-create", name: "Ajouter des catégories", description: "Ajouter de nouvelles catégories", resource: "categories", action: "create" },
  { id: "categories-edit", name: "Modifier les catégories", description: "Modifier les catégories existantes", resource: "categories", action: "edit" },
  { id: "categories-delete", name: "Supprimer les catégories", description: "Supprimer des catégories", resource: "categories", action: "delete" },
  
  // Paramètres permissions
  { id: "parametres-view", name: "Voir les paramètres", description: "Accès à la page des paramètres", resource: "parametres", action: "view" },
  { id: "parametres-edit", name: "Modifier les paramètres", description: "Modifier les paramètres du système", resource: "parametres", action: "edit" },
];

// Group permissions by resource for better organization in UI
export const groupedPermissions = availablePermissions.reduce((groups, permission) => {
  const resource = permission.resource;
  if (!groups[resource]) {
    groups[resource] = [];
  }
  groups[resource].push(permission);
  return groups;
}, {} as Record<string, Permission[]>);
