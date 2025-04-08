
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuthPermissions, AuthStatus } from '@/hooks/use-auth-permissions';
import { Session } from '@supabase/supabase-js';
import { SubscriptionInfo, SubscriptionPlan, useSubscription } from '@/hooks/use-subscription';

interface AuthContextType {
  session: Session | null;
  authStatus: AuthStatus;
  userProfile: any;
  hasPermission: (permissionId: string) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, nom: string, telephone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  // Propriétés d'abonnement
  subscription: SubscriptionInfo;
  isSubscriptionLoading: boolean;
  hasActiveSubscription: boolean;
  updateSubscription: (plan: SubscriptionPlan, paymentRef?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthPermissions();
  
  // Utiliser directement session et authStatus de auth
  const { 
    subscription, 
    isLoading: isSubscriptionLoading, 
    hasActiveSubscription,
    updateSubscription 
  } = useSubscription(auth.session, auth.authStatus);

  // Combiner les données d'auth et d'abonnement
  const authContextValue: AuthContextType = {
    ...auth,
    subscription,
    isSubscriptionLoading,
    hasActiveSubscription,
    updateSubscription
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Modifier pour intégrer la vérification d'abonnement
export function RequireAuth({ children, permissions = [] }: { children: ReactNode; permissions?: string[] }) {
  const { authStatus, hasPermission, hasActiveSubscription, isSubscriptionLoading } = useAuth();
  
  if (authStatus === 'loading' || isSubscriptionLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  if (authStatus === 'unauthenticated') {
    // Rediriger vers la page de connexion
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold mb-4">Accès restreint</h2>
        <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder à cette page.</p>
        <a href="/login" className="bg-primary text-white px-4 py-2 rounded-md">
          Se connecter
        </a>
      </div>
    );
  }
  
  // Vérifier si l'utilisateur a un abonnement actif
  if (!hasActiveSubscription) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold mb-4">Abonnement requis</h2>
        <p className="text-muted-foreground mb-4">Vous devez avoir un abonnement actif pour accéder à cette page.</p>
        <a href="/" className="bg-primary text-white px-4 py-2 rounded-md">
          Voir les offres
        </a>
      </div>
    );
  }
  
  // Vérifier les permissions
  const hasAllPermissions = permissions.length === 0 || 
    permissions.every(permission => hasPermission(permission));
  
  if (!hasAllPermissions) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold mb-4">Accès non autorisé</h2>
        <p className="text-muted-foreground">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      </div>
    );
  }
  
  return <>{children}</>;
}
