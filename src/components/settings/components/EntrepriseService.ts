
import { supabase } from "@/integrations/supabase/client";
import { CompanyFormValues } from "./CompanyInfoForm";

export async function fetchCompanyData() {
  try {
    const { data, error } = await supabase
      .from('parametres')
      .select('*')
      .limit(1)
      .single();
      
    if (error) {
      console.error("Erreur lors de la récupération des données:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    // Return default values if no data exists
    return {
      nom_entreprise: "",
      adresse: "",
      email: "",
      telephone: "",
      rib: "",
      logo_url: null
    };
  }
}

export async function saveCompanyData(updateData: CompanyFormValues & { logo_url?: string | null }) {
  try {
    // Check if we have a record already
    const { data: existingData } = await supabase
      .from('parametres')
      .select('id')
      .limit(1);
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await supabase
        .from('parametres')
        .update(updateData)
        .eq('id', existingData[0].id)
        .select();
      
      if (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        throw error;
      }
      
      return data;
    } else {
      // Insert new record if none exists
      const { data, error } = await supabase
        .from('parametres')
        .insert(updateData)
        .select();
      
      if (error) {
        console.error("Erreur lors de la création:", error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    throw error;
  }
}
