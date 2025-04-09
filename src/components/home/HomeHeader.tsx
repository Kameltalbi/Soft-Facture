
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useAuth } from "@/contexts/auth-context";
import UserProfileButton from "@/components/ui/user-profile-button";

const HomeHeader = () => {
  const { authStatus } = useAuth();
  const isAuthenticated = authStatus === 'authenticated';

  return (
    <header className="w-full py-3 px-4 md:px-6 bg-white shadow-sm flex items-center justify-between">
      {/* Logo avec prop compact pour le garder sur une ligne */}
      <Logo size="sm" compact={true} />
      
      {/* Navigation avec espacement amélioré pour mobile */}
      <div className="flex items-center gap-3 md:gap-4">
        {isAuthenticated ? (
          <UserProfileButton variant="header" />
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Connexion
            </Link>
            <Button 
              asChild 
              size="sm" 
              className="whitespace-nowrap px-3 py-1.5 h-auto"
            >
              <Link to="/register?plan=trial">Essai gratuit 14 jours</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
