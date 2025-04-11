import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BankInfo } from '@/types/settings';

export const useBankSettings = () => {
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBankInfo = async () => {
    try {
      console.log('Récupération des informations bancaires...');
      const { data, error } = await supabase
        .from('bank_info')
        .select('*')
        .single();

      console.log('Résultat de la requête:', { data, error });

      if (error) {
        console.log('Erreur détectée:', error);
        if (error.code === 'PGRST116') {
          console.log('Aucune donnée trouvée, création d\'une entrée vide...');
          const { data: newData, error: createError } = await supabase
            .from('bank_info')
            .insert({
              bank_name: '',
              rib: '',
              iban: '',
              swift: '',
            })
            .select()
            .single();

          console.log('Résultat de la création:', { newData, createError });

          if (createError) {
            console.error('Erreur lors de la création:', createError);
            throw createError;
          }
          setBankInfo(newData);
          return;
        }
        throw error;
      }

      console.log('Données bancaires trouvées:', data);
      setBankInfo(data);
    } catch (err) {
      console.error('Error fetching bank info:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateBankInfo = async (info: Partial<BankInfo>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bank_info')
        .upsert({
          ...info,
          id: bankInfo?.id, // Garder le même ID s'il existe
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setBankInfo(data);
      return { success: true, data };
    } catch (err) {
      console.error('Error updating bank info:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankInfo();
  }, []);

  return {
    bankInfo,
    loading,
    error,
    updateBankInfo,
    refetch: fetchBankInfo,
  };
};
