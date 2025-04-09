
import { supabase } from "@/integrations/supabase/client";
import { CompanyFormValues } from "./CompanyInfoForm";
import { CompanyInfo } from "@/types/settings";

export async function fetchCompanyData(): Promise<CompanyInfo> {
  try {
    // Use "as any" to bypass TypeScript's table name checking
    // This is a temporary solution until the types.ts file is regenerated
    const { data, error } = await (supabase as any)
      .from('company_info')
      .select('*')
      .limit(1)
      .single();
      
    if (error) {
      console.error("Erreur lors de la récupération des données de l'entreprise:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données de l'entreprise:", error);
    // Return default values if no data exists
    return {
      id: "",
      nom_entreprise: "",
      adresse: "",
      email: "",
      telephone: "",
      rib: "",
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

export async function saveCompanyData(updateData: CompanyFormValues & { logo_url?: string | null }) {
  try {
    // Check if we have a record already
    const { data: existingData } = await (supabase as any)
      .from('company_info')
      .select('id')
      .limit(1);
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { data, error } = await (supabase as any)
        .from('company_info')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData[0].id)
        .select();
      
      if (error) {
        console.error("Erreur lors de la mise à jour des données de l'entreprise:", error);
        throw error;
      }
      
      return data;
    } else {
      // Insert new record if none exists
      const { data, error } = await (supabase as any)
        .from('company_info')
        .insert({
          ...updateData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error("Erreur lors de la création des données de l'entreprise:", error);
        throw error;
      }
      
      return data;
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données de l'entreprise:", error);
    throw error;
  }
}
