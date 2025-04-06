
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ReceiptText, 
  Users, 
  ShoppingCart, 
  Settings, 
  LayoutDashboard, 
  Home,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "Tableau de bord",
    path: "/",
    icon: <Home size={20} />
  },
  {
    name: "Factures",
    path: "/factures",
    icon: <ReceiptText size={20} />
  },
  {
    name: "Clients",
    path: "/clients",
    icon: <Users size={20} />
  },
  {
    name: "Produits",
    path: "/produits",
    icon: <ShoppingCart size={20} />
  },
  {
    name: "Paramètres",
    path: "/parametres",
    icon: <Settings size={20} />
  }
];

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Button 
        onClick={toggleSidebar} 
        variant="outline" 
        size="icon"
        className={cn(
          "fixed z-20 top-4 transition-all duration-300",
          isCollapsed ? "left-4" : "left-[248px]"
        )}
        aria-label={isCollapsed ? "Ouvrir le menu" : "Fermer le menu"}
      >
        {isCollapsed ? <Menu size={18} /> : <X size={18} />}
      </Button>

      <div 
        className={cn(
          "h-screen fixed left-0 top-0 bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 z-10",
          isCollapsed ? "w-0 overflow-hidden" : "w-64"
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground flex items-center">
            <LayoutDashboard className="mr-2 text-invoice-blue-500" />
            <span>InvoiceArchibat</span>
          </h1>
        </div>
        
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-sidebar-border">
          <button className="flex items-center px-3 py-2 w-full rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
            <LogOut size={18} className="mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
