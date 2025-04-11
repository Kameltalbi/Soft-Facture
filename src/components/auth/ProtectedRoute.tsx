import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import LoadingScreen from '@/components/ui/loading-screen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Attendre que l'authentification soit vérifiée
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si l'authentification est requise et l'utilisateur n'est pas connecté
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est connecté mais tente d'accéder à une page de connexion/inscription
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Vérification des rôles si spécifiés
  if (requireAuth && user && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
