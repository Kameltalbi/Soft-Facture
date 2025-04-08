
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
  ChevronLeft,
  FileText,
  Package2,
  Tags,
  FileSpreadsheet
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const navItems = [
    {
      name: t('common.dashboard'),
      path: "/",
      icon: <Home size={20} />
    },
    {
      name: t('common.invoices'),
      path: "/factures",
      icon: <ReceiptText size={20} />
    },
    {
      name: t('common.quotes'),
      path: "/devis",
      icon: <FileText size={20} />
    },
    {
      name: t('common.bonDeSortie'),
      path: "/bon-de-sortie",
      icon: <Package2 size={20} />
    },
    {
      name: t('common.clients'),
      path: "/clients",
      icon: <Users size={20} />
    },
    {
      name: t('common.products'),
      path: "/produits",
      icon: <ShoppingCart size={20} />
    },
    {
      name: t('product.categories.title'),
      path: "/categories",
      icon: <Tags size={20} />
    },
    {
      name: t('common.settings'),
      path: "/parametres",
      icon: <Settings size={20} />
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Si c'est sur mobile, toujours montrer la version complète (pas collapse)
  const renderSidebar = () => {
    if (isMobile || !isCollapsed) {
      return (
        <div className={`h-full bg-sidebar flex flex-col border-r border-sidebar-border ${isMobile ? 'w-full' : 'fixed left-0 top-0 w-64'}`}>
          <div className="p-4 border-b border-sidebar-border flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center bg-invoice-blue-500 rounded-md w-8 h-8 mr-2">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-sidebar-foreground">Soft-Facture</span>
                <span className="text-xs text-sidebar-foreground/70">Gestion de facturation</span>
              </div>
            </div>
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <ChevronLeft size={20} />
              </Button>
            )}
          </div>
          
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
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
              {t('common.logout')}
            </button>
          </div>
        </div>
      );
    } else {
      return (
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
              title={t('common.logout')}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      );
    }
  };

  return renderSidebar();
};

export default Sidebar;
