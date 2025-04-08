
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
        // Utiliser l'API générique de Supabase qui contourne les vérifications de type
        const response = await supabase
          .rpc('get_user_subscription', { p_user_id: session.user.id })
          .maybeSingle();

        if (response.error) {
          console.error('Erreur lors de la récupération de l\'abonnement:', response.error);
          setSubscription({
            status: 'none',
            plan: null,
            expiresAt: null
          });
        } else if (response.data) {
          const now = new Date();
          const expiresAt = new Date(response.data.date_fin);
          
          // Vérifier si l'abonnement est expiré
          if (expiresAt < now) {
            // Mettre à jour le statut dans la base de données via RPC
            await supabase
              .rpc('expire_subscription', { 
                p_subscription_id: response.data.id 
              });
              
            setSubscription({
              status: 'expired',
              plan: response.data.plan as SubscriptionPlan,
              expiresAt
            });
          } else {
            setSubscription({
              status: 'active',
              plan: response.data.plan as SubscriptionPlan,
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
      // Utiliser une RPC pour créer ou mettre à jour l'abonnement
      const response = await supabase
        .rpc('create_or_update_subscription', {
          p_user_id: session.user.id,
          p_plan: plan,
          p_payment_ref: paymentRef || null
        });
      
      if (response.error) {
        throw response.error;
      }
      
      // Récupérer les détails du nouvel abonnement
      const { data: newSubscription, error } = await supabase
        .rpc('get_user_subscription', { p_user_id: session.user.id })
        .maybeSingle();
      
      if (error || !newSubscription) {
        console.error('Erreur lors de la récupération du nouvel abonnement:', error);
        return false;
      }
      
      // Mettre à jour l'état local
      setSubscription({
        status: 'active',
        plan,
        expiresAt: new Date(newSubscription.date_fin)
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
