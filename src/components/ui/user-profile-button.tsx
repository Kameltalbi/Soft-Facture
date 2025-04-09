
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserRound } from "lucide-react";

interface UserProfileButtonProps {
  variant?: "default" | "header" | "topbar";
  showName?: boolean;
}

const UserProfileButton = ({ 
  variant = "default", 
  showName = true 
}: UserProfileButtonProps) => {
  const { userProfile, authStatus, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Si l'utilisateur n'est pas connecté, on ne montre rien
  if (authStatus !== 'authenticated' || !userProfile) {
    return null;
  }
  
  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    const nom = userProfile.nom || "";
    const prenom = userProfile.prenom || "";
    
    if (nom && prenom) {
      return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
    } else if (nom) {
      return nom.substring(0, 2).toUpperCase();
    } else {
      return "U";
    }
  };
  
  // Obtenir le nom d'affichage
  const getDisplayName = () => {
    if (userProfile.nom && userProfile.prenom) {
      return `${userProfile.prenom} ${userProfile.nom}`;
    } else if (userProfile.nom) {
      return userProfile.nom;
    } else {
      return userProfile.email || "Utilisateur";
    }
  };
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };
  
  // Tailles et styles différents selon le variant
  const getAvatarSize = () => {
    switch (variant) {
      case "header":
        return "h-8 w-8";
      case "topbar":
        return "h-9 w-9";
      default:
        return "h-8 w-8";
    }
  };
  
  const getButtonClass = () => {
    switch (variant) {
      case "header":
        return "p-0 h-auto hover:bg-transparent";
      case "topbar":
        return "p-0 h-auto hover:bg-transparent";
      default:
        return "p-0 h-auto";
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={getButtonClass()}>
          <div className="flex items-center gap-2">
            {showName && (
              <span className="text-sm font-medium hidden md:block">
                {getDisplayName()}
              </span>
            )}
            <Avatar className={getAvatarSize()}>
              <AvatarImage 
                src={userProfile.avatar_url} 
                alt={getDisplayName()} 
              />
              <AvatarFallback className="bg-invoice-blue-500 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/parametres" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Déconnexion..." : "Se déconnecter"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileButton;
