
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, LogIn } from "lucide-react";
import Logo from "@/components/ui/logo";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, authStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirection si déjà connecté
  if (authStatus === 'authenticated') {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        // Rediriger vers le tableau de bord après connexion
        navigate('/dashboard');
      } else {
        toast({
          title: "Erreur de connexion",
          description: result.error || "Vérifiez vos identifiants.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Section formulaire */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
            <p className="mt-2 text-muted-foreground">
              Entrez vos identifiants pour accéder à votre espace
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-foreground"
                autoComplete="email"
              />
              {email && (
                <p className="text-sm text-blue-600 mt-1">
                  Email: {email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
                autoComplete="current-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium" 
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
              <LogIn className="ml-2 h-5 w-5" />
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de compte?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Section promo avec fond bleu */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="mb-8 flex justify-center">
            <Logo variant="light" size="lg" compact={true} />
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Bienvenue sur votre gestionnaire d'entreprise
          </h1>
          
          <p className="text-lg md:text-xl opacity-90">
            Simplifiez votre gestion quotidienne. Notre application vous permet de gérer vos factures, 
            devis, clients et produits en un seul endroit, avec une interface intuitive et efficace.
          </p>
          
          <div className="pt-6">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50"
              asChild
            >
              <Link to="/register">
                Créer un compte maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
