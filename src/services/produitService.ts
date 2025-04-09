
import { supabase } from "@/integrations/supabase/client";
import { Produit } from "@/types";
import { toast } from "sonner";

export interface ProduitWithCategorie extends Omit<Produit, "categorieId"> {
  categorie: {
    id: string;
    nom: string;
  };
}

export const fetchProduits = async (): Promise<ProduitWithCategorie[]> => {
  try {
    const { data, error } = await supabase
      .from("produits")
      .select(`
        *,
        categories:categorie_id (
          id,
          nom
        )
      `)
      .order("nom");

    if (error) {
      console.error("Error fetching produits:", error);
      toast.error("Erreur lors du chargement des produits");
      return [];
    }

    return data.map((produit) => ({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      tauxTVA: produit.taux_tva,
      description: produit.description || undefined,
      categorie: produit.categories ? {
        id: produit.categories.id,
        nom: produit.categories.nom,
      } : { id: "", nom: "" },
    }));
  } catch (error) {
    console.error("Error in fetchProduits:", error);
    toast.error("Erreur lors du chargement des produits");
    return [];
  }
};

export const createProduit = async (produit: Omit<Produit, "id">): Promise<ProduitWithCategorie | null> => {
  try {
    const { data, error } = await supabase
      .from("produits")
      .insert([{
        nom: produit.nom,
        prix: produit.prix,
        taux_tva: produit.tauxTVA,
        description: produit.description,
        categorie_id: produit.categorieId,
      }])
      .select(`
        *,
        categories:categorie_id (
          id,
          nom
        )
      `)
      .single();

    if (error) {
      console.error("Error creating produit:", error);
      toast.error("Erreur lors de la création du produit");
      return null;
    }

    toast.success("Produit créé avec succès");
    return {
      id: data.id,
      nom: data.nom,
      prix: data.prix,
      tauxTVA: data.taux_tva,
      description: data.description || undefined,
      categorie: data.categories ? {
        id: data.categories.id,
        nom: data.categories.nom,
      } : { id: "", nom: "" },
    };
  } catch (error) {
    console.error("Error in createProduit:", error);
    toast.error("Erreur lors de la création du produit");
    return null;
  }
};

export const updateProduit = async (id: string, produit: Partial<Produit>): Promise<ProduitWithCategorie | null> => {
  try {
    const updateData: any = {};
    if (produit.nom !== undefined) updateData.nom = produit.nom;
    if (produit.prix !== undefined) updateData.prix = produit.prix;
    if (produit.tauxTVA !== undefined) updateData.taux_tva = produit.tauxTVA;
    if (produit.description !== undefined) updateData.description = produit.description;
    if (produit.categorieId !== undefined) updateData.categorie_id = produit.categorieId;

    const { data, error } = await supabase
      .from("produits")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        categories:categorie_id (
          id,
          nom
        )
      `)
      .single();

    if (error) {
      console.error("Error updating produit:", error);
      toast.error("Erreur lors de la mise à jour du produit");
      return null;
    }

    toast.success("Produit mis à jour avec succès");
    return {
      id: data.id,
      nom: data.nom,
      prix: data.prix,
      tauxTVA: data.taux_tva,
      description: data.description || undefined,
      categorie: data.categories ? {
        id: data.categories.id,
        nom: data.categories.nom,
      } : { id: "", nom: "" },
    };
  } catch (error) {
    console.error("Error in updateProduit:", error);
    toast.error("Erreur lors de la mise à jour du produit");
    return null;
  }
};

export const deleteProduit = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("produits")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting produit:", error);
      toast.error("Erreur lors de la suppression du produit");
      return false;
    }

    toast.success("Produit supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Error in deleteProduit:", error);
    toast.error("Erreur lors de la suppression du produit");
    return false;
  }
};

export const getProduitById = async (id: string): Promise<ProduitWithCategorie | null> => {
  try {
    const { data, error } = await supabase
      .from("produits")
      .select(`
        *,
        categories:categorie_id (
          id,
          nom
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching produit:", error);
      toast.error("Erreur lors du chargement du produit");
      return null;
    }

    return {
      id: data.id,
      nom: data.nom,
      prix: data.prix,
      tauxTVA: data.taux_tva,
      description: data.description || undefined,
      categorie: data.categories ? {
        id: data.categories.id,
        nom: data.categories.nom,
      } : { id: "", nom: "" },
    };
  } catch (error) {
    console.error("Error in getProduitById:", error);
    toast.error("Erreur lors du chargement du produit");
    return null;
  }
};
