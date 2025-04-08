
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth-context";
import Routes from "./routes";

// Import i18n de manière séparée pour faciliter le chunking
import './i18n/i18n';

// Configuration de QueryClient avec des options optimisées
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
      retry: 1, // Limiter les retries pour économiser la bande passante
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
