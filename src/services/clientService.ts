
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import { toast } from "sonner";

export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("nom");

    if (error) {
      console.error("Error fetching clients:", error);
      toast.error("Erreur lors du chargement des clients");
      return [];
    }

    return data.map((client) => ({
      id: client.id,
      nom: client.nom,
      societe: client.societe || undefined,
      email: client.email || undefined,
      telephone: client.telephone || undefined,
      adresse: client.adresse || undefined,
      tva: client.tva || undefined,
    }));
  } catch (error) {
    console.error("Error in fetchClients:", error);
    toast.error("Erreur lors du chargement des clients");
    return [];
  }
};

export const createClient = async (client: Omit<Client, "id">): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .insert([client])
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      toast.error("Erreur lors de la création du client");
      return null;
    }

    toast.success("Client créé avec succès");
    return {
      id: data.id,
      nom: data.nom,
      societe: data.societe || undefined,
      email: data.email || undefined,
      telephone: data.telephone || undefined,
      adresse: data.adresse || undefined,
      tva: data.tva || undefined,
    };
  } catch (error) {
    console.error("Error in createClient:", error);
    toast.error("Erreur lors de la création du client");
    return null;
  }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .update(client)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      toast.error("Erreur lors de la mise à jour du client");
      return null;
    }

    toast.success("Client mis à jour avec succès");
    return {
      id: data.id,
      nom: data.nom,
      societe: data.societe || undefined,
      email: data.email || undefined,
      telephone: data.telephone || undefined,
      adresse: data.adresse || undefined,
      tva: data.tva || undefined,
    };
  } catch (error) {
    console.error("Error in updateClient:", error);
    toast.error("Erreur lors de la mise à jour du client");
    return null;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting client:", error);
      toast.error("Erreur lors de la suppression du client");
      return false;
    }

    toast.success("Client supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Error in deleteClient:", error);
    toast.error("Erreur lors de la suppression du client");
    return false;
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching client:", error);
      toast.error("Erreur lors du chargement du client");
      return null;
    }

    return {
      id: data.id,
      nom: data.nom,
      societe: data.societe || undefined,
      email: data.email || undefined,
      telephone: data.telephone || undefined,
      adresse: data.adresse || undefined,
      tva: data.tva || undefined,
    };
  } catch (error) {
    console.error("Error in getClientById:", error);
    toast.error("Erreur lors du chargement du client");
    return null;
  }
};
