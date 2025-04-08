
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export type SubscriptionStatus = 'active' | 'expired' | 'none';
export type SubscriptionPlan = 'trial' | 'annual';

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  expiresAt: Date | null;
}

// Cette fonction prend les dépendances en paramètres au lieu d'utiliser useAuth
export function useSubscription(session: Session | null, authStatus: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    status: 'none',
    plan: null,
    expiresAt: null
  });
  const { toast } = useToast();

  useEffect(() => {
    async function checkSubscription() {
      if (!session || authStatus !== 'authenticated') {
        setSubscription({
          status: 'none',
          plan: null,
          expiresAt: null
        });
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer l'abonnement actif de l'utilisateur
        // Nous utilisons select(*) pour éviter les problèmes de typage avec la table abonnements
        const { data, error } = await supabase
          .from('abonnements')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('statut', 'actif')
          .order('date_fin', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération de l\'abonnement:', error);
          setSubscription({
            status: 'none',
            plan: null,
            expiresAt: null
          });
        } else if (data) {
          const now = new Date();
          // TypeScript ne connaît pas encore le type abonnements, donc on utilise any pour contourner
          const expiresAt = new Date((data as any).date_fin);
          
          // Vérifier si l'abonnement est expiré malgré le statut "actif"
          if (expiresAt < now) {
            // Mettre à jour le statut dans la base de données
            await supabase
              .from('abonnements')
              .update({ statut: 'expire' })
              .eq('id', (data as any).id);
              
            setSubscription({
              status: 'expired',
              plan: (data as any).plan as SubscriptionPlan,
              expiresAt
            });
          } else {
            setSubscription({
              status: 'active',
              plan: (data as any).plan as SubscriptionPlan,
              expiresAt
            });
          }
        } else {
          setSubscription({
            status: 'none',
            plan: null,
            expiresAt: null
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, [session, authStatus]);

  // Fonction pour mettre à jour un abonnement après paiement
  const updateSubscription = async (plan: SubscriptionPlan, paymentRef?: string) => {
    if (!session) return false;
    
    try {
      const now = new Date();
      let endDate: Date;
      
      if (plan === 'annual') {
        // Pour un abonnement annuel, ajouter 1 an
        endDate = new Date(now);
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        // Pour un essai, ajouter 14 jours
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 14);
      }
      
      // Utiliser des requêtes génériques pour éviter les problèmes de typage
      // Mettre à jour tous les abonnements existants comme expirés
      await supabase
        .from('abonnements')
        .update({ statut: 'expire' })
        .eq('user_id', session.user.id)
        .eq('statut', 'actif');
      
      // Créer un nouvel abonnement
      const { data, error } = await supabase
        .from('abonnements')
        .insert({
          user_id: session.user.id,
          plan,
          date_debut: now.toISOString(),
          date_fin: endDate.toISOString(),
          statut: 'actif',
          reference_paiement: paymentRef || null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Mettre à jour l'état local
      setSubscription({
        status: 'active',
        plan,
        expiresAt: endDate
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre abonnement.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    isLoading,
    subscription,
    updateSubscription,
    hasActiveSubscription: subscription.status === 'active'
  };
}
