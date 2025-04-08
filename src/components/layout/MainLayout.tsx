
import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Observe DOM changes to detect sidebar collapse state
  useEffect(() => {
    if (isMobile) return; // Skip for mobile devices
    
    const observer = new MutationObserver(() => {
      // Check if the sidebar is collapsed by looking for the collapsed width (16px)
      const sidebarElement = document.querySelector('[class*="w-16"]');
      setSidebarCollapsed(!!sidebarElement);
    });

    // Start observing the document
    observer.observe(document.body, { 
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup on unmount
    return () => observer.disconnect();
  }, [isMobile]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile Sidebar (in Sheet) */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[250px] sm:w-[300px]">
            <div className="h-full">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      <div 
        className={`flex-1 transition-all duration-300 ${
          isMobile 
            ? "" 
            : sidebarCollapsed 
              ? "ml-16" 
              : "ml-64"
        }`}
      >
        <TopBar 
          title={t(title) || title} 
          onMenuClick={isMobile ? toggleMobileMenu : undefined} 
        />
        <main className="p-3 md:p-6 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
