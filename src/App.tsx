
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import Dashboard from "./pages/Dashboard";
import FacturesPage from "./pages/FacturesPage";
import DevisPage from "./pages/DevisPage";
import BonDeSortiePage from "./pages/BonDeSortiePage";
import ClientsPage from "./pages/ClientsPage";
import ProduitsPage from "./pages/ProduitsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ParametresPage from "./pages/ParametresPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Import i18n
import './i18n/i18n';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/factures" element={<FacturesPage />} />
            <Route path="/devis" element={<DevisPage />} />
            <Route path="/bon-de-sortie" element={<BonDeSortiePage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/produits" element={<ProduitsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/parametres" element={<ParametresPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
