
import { supabase } from "@/integrations/supabase/client";
import { Categorie } from "@/types";
import { toast } from "sonner";

export const fetchCategories = async (): Promise<Categorie[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("nom");

    if (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erreur lors du chargement des catégories");
      return [];
    }

    return data.map((cat) => ({
      id: cat.id,
      nom: cat.nom,
    }));
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    toast.error("Erreur lors du chargement des catégories");
    return [];
  }
};

export const createCategory = async (category: Omit<Categorie, "id">): Promise<Categorie | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      toast.error("Erreur lors de la création de la catégorie");
      return null;
    }

    toast.success("Catégorie créée avec succès");
    return {
      id: data.id,
      nom: data.nom,
    };
  } catch (error) {
    console.error("Error in createCategory:", error);
    toast.error("Erreur lors de la création de la catégorie");
    return null;
  }
};

export const updateCategory = async (id: string, nom: string): Promise<Categorie | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ nom })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      toast.error("Erreur lors de la mise à jour de la catégorie");
      return null;
    }

    toast.success("Catégorie mise à jour avec succès");
    return {
      id: data.id,
      nom: data.nom,
    };
  } catch (error) {
    console.error("Error in updateCategory:", error);
    toast.error("Erreur lors de la mise à jour de la catégorie");
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      toast.error("Erreur lors de la suppression de la catégorie");
      return false;
    }

    toast.success("Catégorie supprimée avec succès");
    return true;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    toast.error("Erreur lors de la suppression de la catégorie");
    return false;
  }
};
