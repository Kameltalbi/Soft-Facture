import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BankInfo } from '@/types/settings';

export const useBankSettings = () => {
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBankInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_info')
        .select('*')
        .single();

      if (error) throw error;

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
