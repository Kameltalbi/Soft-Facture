
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
  ChevronLeft
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
      {isCollapsed ? (
        <div className="h-screen fixed left-0 top-0 w-16 bg-sidebar flex flex-col border-r border-sidebar-border z-10">
          <div className="p-4 flex justify-center border-b border-sidebar-border">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Menu size={20} />
            </Button>
          </div>
          
          <nav className="flex-1 py-6 px-2">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.path} className="flex justify-center">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    title={item.name}
                  >
                    {item.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 mt-auto border-t border-sidebar-border flex justify-center">
            <button 
              className="flex items-center justify-center p-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-screen fixed left-0 top-0 w-64 bg-sidebar flex flex-col border-r border-sidebar-border z-10">
          <div className="p-4 border-b border-sidebar-border flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="InvoiceArchibat" 
                className="w-8 h-8 mr-2" 
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  document.getElementById('fallback-icon')?.style.display = 'block';
                }}
              />
              <div id="fallback-icon" style={{display: 'none'}} className="mr-2">
                <LayoutDashboard className="text-invoice-blue-500" size={20} />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">InvoiceArchibat</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft size={20} />
            </Button>
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
      )}
    </>
  );
};

export default Sidebar;
