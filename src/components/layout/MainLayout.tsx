
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useState, useEffect } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  // We'll detect the sidebar state by checking its width
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Observe DOM changes to detect sidebar collapse state
  useEffect(() => {
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
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        <TopBar title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
