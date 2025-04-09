
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import Logo from "@/components/ui/logo";
import { SubscriptionPlan } from "@/hooks/use-subscription";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup, authStatus, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Convertir le paramètre 'plan' en SubscriptionPlan ou utiliser 'trial' par défaut
  const planParam = searchParams.get("plan");
  const plan = (planParam && (planParam === 'annual' || planParam === 'trial')) 
    ? planParam as SubscriptionPlan 
    : 'trial';
    
  const redirect = searchParams.get("redirect") || "";

  // Afficher un log pour débugger
  useEffect(() => {
    console.log("RegisterPage - Params:", { plan, redirect, authStatus });
  }, [plan, redirect, authStatus]);
  
  // Fonction pour gérer la redirection après connexion
  const handleRedirection = () => {
    console.log("Redirection après inscription:", { plan, redirect });
    
    // Si l'utilisateur vient de s'inscrire sans choisir de plan, on le redirige vers la page des tarifs
    if (!planParam) {
      navigate('/tarifs');
      return;
    }
    
    // Si un paramètre de redirection est spécifié
    if (redirect === 'tarifs') {
      navigate('/tarifs');
    } else if (redirect === 'paiement' && plan === 'annual') {
      navigate(`/paiement?plan=${plan}&montant=390`);
    } else if (redirect === 'dashboard') {
      navigate('/dashboard');
    } else if (plan === 'annual') {
      // Comportement par défaut pour le plan annuel
      navigate(`/paiement?plan=${plan}&montant=390`);
    } else if (plan === 'trial') {
      // Redirection vers le dashboard pour le plan d'essai
      navigate('/dashboard');
    } else {
      // Si aucune redirection spécifiée, aller aux tarifs par défaut
      navigate('/tarifs');
    }
  };

  // Redirect if already logged in - IMPORTANT: handleRedirection must be defined before this useEffect
  useEffect(() => {
    if (authStatus === 'authenticated') {
      handleRedirection();
    }
  }, [authStatus]);

  if (authStatus === 'authenticated') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await signup(email, password, nom, telephone);
      
      if (result.success) {
        console.log("Inscription réussie, plan choisi:", plan);
        
        // Essayer de créer l'abonnement d'essai immédiatement si plan=trial
        if (plan === 'trial') {
          await updateSubscription('trial');
          toast({
            title: "Inscription réussie",
            description: "Votre essai gratuit de 14 jours a été activé. Bienvenue !",
          });
        } else {
          toast({
            title: "Inscription réussie",
            description: "Votre compte a été créé.",
          });
        }
        
        // Rediriger selon les paramètres
        handleRedirection();
      } else {
        toast({
          title: "Erreur d'inscription",
          description: result.error || "Une erreur est survenue lors de l'inscription.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Modifier le texte en fonction du plan choisi
  const getPlanText = () => {
    if (plan === 'annual') {
      return "Vous avez choisi l'abonnement annuel. Après l'inscription, vous serez redirigé vers la page de paiement.";
    }
    return "Vous avez choisi l'essai gratuit de 14 jours. Après l'inscription, vous aurez accès à toutes les fonctionnalités.";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Section promo avec fond bleu */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 flex flex-col justify-center order-2 md:order-1">
        <div className="max-w-md mx-auto space-y-8">
          <div className="mb-8 flex justify-center">
            <Logo variant="light" size="lg" compact={true} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">
            Simplifiez la gestion de votre entreprise
          </h1>
          
          <p className="text-lg opacity-90">
            Notre application vous offre une solution complète pour la gestion de vos activités commerciales.
            Factures, devis, clients, produits - tout est centralisé dans une interface moderne et intuitive.
          </p>
          
          <div className="space-y-4 pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-blue-300" />
              <p>Gestion simplifiée des factures et devis</p>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-blue-300" />
              <p>Organisation optimale de vos clients</p>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-blue-300" />
              <p>Suivi efficace de vos produits</p>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-blue-700 hover:bg-blue-50"
              asChild
            >
              <Link to="/login">
                Déjà inscrit ? Se connecter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Section formulaire */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center order-1 md:order-2">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Créer un compte</h2>
            <p className="mt-2 text-muted-foreground">
              {getPlanText()}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input
                id="nom"
                placeholder="Votre nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="h-12"
                autoComplete="name"
              />
            </div>
            
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
              <Label htmlFor="telephone">Téléphone (optionnel)</Label>
              <Input
                id="telephone"
                placeholder="+216 XX XXX XXX"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="h-12"
                autoComplete="tel"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
                autoComplete="new-password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12"
                autoComplete="new-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium mt-6" 
              disabled={isLoading}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
              <UserPlus className="ml-2 h-5 w-5" />
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
