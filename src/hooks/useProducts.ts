import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  nom: string;
  prix: number;
  taux_tva: number;
  description?: string;
  categorie_id: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      console.log('Fetching products...');
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session ? 'Connected' : 'Not connected');

        if (!session) {
          console.log('No session, trying to get products without auth...');
        }

        console.log('Calling Supabase...');
        const { data, error } = await supabase
          .from('produits')
          .select('*');
        console.log('Supabase response:', { data, error });
        console.log('Supabase URL:', supabase.supabaseUrl);
        console.log('Supabase Key:', supabase.supabaseKey ? 'Present' : 'Missing');

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
