
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import PricingSection from "@/components/home/PricingSection";

const TarifPage = () => {
  const { authStatus, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();

  // Si l'utilisateur a déjà un abonnement actif, rediriger vers dashboard
  useEffect(() => {
    if (authStatus === 'authenticated' && hasActiveSubscription) {
      navigate('/dashboard');
    }
  }, [authStatus, hasActiveSubscription, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b p-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold text-primary">Facturify</a>
        <div>
          {authStatus === 'authenticated' ? (
            <a 
              href="/dashboard" 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Tableau de bord
            </a>
          ) : (
            <a 
              href="/login" 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Se connecter
            </a>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold text-center mb-10">
            Choisissez le plan qui vous convient
          </h1>
          <PricingSection isStandalonePage={true} />
        </div>
      </main>
      
      <footer className="border-t p-6 text-center text-muted-foreground">
        <p>© 2025 Facturify. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default TarifPage;
