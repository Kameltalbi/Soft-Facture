
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthPermissions, AuthStatus } from '@/hooks/use-auth-permissions';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  authStatus: AuthStatus;
  userProfile: any;
  hasPermission: (permissionId: string) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, nom: string, telephone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthPermissions();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility component to protect routes that require authentication
export function RequireAuth({ children, permissions = [] }: { children: ReactNode; permissions?: string[] }) {
  const { authStatus, hasPermission } = useAuth();
  
  if (authStatus === 'loading') {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  if (authStatus === 'unauthenticated') {
    // You can redirect to login page or show a message
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
  
  // Check if all required permissions are present
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
