
import { supabase } from "@/integrations/supabase/client";
import { CompanyFormValues } from "./CompanyInfoForm";

export async function fetchCompanyData() {
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
}

export async function saveCompanyData(updateData: CompanyFormValues & { logo_url?: string | null }) {
  const { data, error } = await supabase
    .from('parametres')
    .update(updateData)
    .eq('id', 'a55a560b-44e7-4be4-822f-42e919b1a1b2') // Use the actual UUID string
    .select();
  
  if (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    throw error;
  }
  
  return data;
}
