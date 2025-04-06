
import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Listen for sidebar toggle through custom event
  useEffect(() => {
    const handleSidebarToggle = () => {
      setIsSidebarOpen(prev => !prev);
    };

    window.addEventListener('sidebar-toggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ml-0 md:ml-64`}>
        <TopBar title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
