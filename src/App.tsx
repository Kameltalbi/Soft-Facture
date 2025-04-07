
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FacturesPage from "./pages/FacturesPage";
import DevisPage from "./pages/DevisPage";
import ClientsPage from "./pages/ClientsPage";
import ProduitsPage from "./pages/ProduitsPage";
import ParametresPage from "./pages/ParametresPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/factures" element={<FacturesPage />} />
          <Route path="/devis" element={<DevisPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/produits" element={<ProduitsPage />} />
          <Route path="/parametres" element={<ParametresPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
