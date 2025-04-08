
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function useAuthPermissions() {
  const [session, setSession] = useState<Session | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthStatus(session ? 'authenticated' : 'unauthenticated');
      
      if (session) {
        loadUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setAuthStatus(session ? 'authenticated' : 'unauthenticated');
        
        if (session) {
          loadUserData(session.user.id);
        } else {
          setUserProfile(null);
          setPermissions({});
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      setUserProfile(profile);
      
      // Load user permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('permission_id')
        .eq('user_id', userId);
      
      if (permissionsError) throw permissionsError;
      
      // Convert to permission map for easy checking
      const permMap: Record<string, boolean> = {};
      if (permissionsData) {
        permissionsData.forEach(p => {
          if (p.permission_id) {
            permMap[p.permission_id] = true;
          }
        });
      }
      
      setPermissions(permMap);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données utilisateur.",
        variant: "destructive",
      });
    }
  };

  const hasPermission = (permissionId: string): boolean => {
    return !!permissions[permissionId];
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erreur lors de la connexion"
      };
    }
  };

  const signup = async (email: string, password: string, nom: string, telephone?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom,
            telephone
          }
        }
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erreur lors de l'inscription"
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Erreur lors de la déconnexion"
      };
    }
  };

  return {
    session,
    authStatus,
    userProfile,
    hasPermission,
    login,
    signup,
    logout,
  };
}
