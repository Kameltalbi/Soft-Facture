
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Fetching clients from Supabase
export const fetchClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('nom');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// Creating a new client
export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

// Updating an existing client
export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

// Fetching a single client by ID
export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
};

// Deleting a client
export const deleteClient = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// Demo data for clients - will be removed once Supabase integration is complete
export const clientsDemo = [
  {
    id: "1",
    nom: "Entreprise ABC",
    societe: "ABC SAS",
    email: "contact@abc.fr",
    telephone: "01 23 45 67 89",
    adresse: "123 Rue de Paris, 75001 Paris",
    tva: "FR 12 345 678 901",
  },
  {
    id: "2",
    nom: "Jean Dupont",
    societe: "Société XYZ",
    email: "jean.dupont@xyz.fr",
    telephone: "06 12 34 56 78",
    adresse: "456 Avenue des Clients, 69002 Lyon",
    tva: "FR 98 765 432 109",
  },
  {
    id: "3",
    nom: "Marie Martin",
    societe: "Consulting DEF",
    email: "marie.martin@def.fr",
    telephone: "07 98 76 54 32",
    adresse: "789 Boulevard Central, 33000 Bordeaux",
    tva: "FR 45 678 901 234",
  },
  {
    id: "4",
    nom: "Pierre Durand",
    societe: "Studio Design",
    email: "pierre.durand@studio.fr",
    telephone: "06 54 32 10 98",
    adresse: "10 Rue de la Création, 44000 Nantes",
    tva: "FR 23 456 789 012",
  },
];
