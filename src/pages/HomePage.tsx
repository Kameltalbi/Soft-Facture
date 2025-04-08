
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, BarChart2, Calendar, FileText, Users, Settings, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/logo";

const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FileText className="h-12 w-12 text-blue-500" />,
      title: "Gestion des factures",
      description: "Créez et gérez facilement vos factures avec des modèles personnalisables et un suivi complet."
    },
    {
      icon: <BarChart2 className="h-12 w-12 text-blue-500" />,
      title: "Devis professionnels",
      description: "Transformez vos devis en factures en un clic et suivez leur statut en temps réel."
    },
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: "Gestion clients",
      description: "Centralisez tous vos contacts clients avec historique complet des transactions et communications."
    },
    {
      icon: <Calendar className="h-12 w-12 text-blue-500" />,
      title: "Bons de sortie",
      description: "Créez et suivez vos bons de sortie pour une gestion optimale de votre inventaire."
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-500" />,
      title: "Sécurité avancée",
      description: "Vos données sont protégées avec des standards de sécurité élevés et des sauvegardes régulières."
    },
    {
      icon: <Settings className="h-12 w-12 text-blue-500" />,
      title: "Personnalisation",
      description: "Adaptez l'application à vos besoins spécifiques avec des options de configuration étendues."
    }
  ];

  const plans = [
    {
      name: "Essai Gratuit",
      price: "0",
      duration: "14 jours",
      description: "Accès complet à toutes les fonctionnalités pendant 14 jours",
      features: [
        "Gestion illimitée des factures",
        "Création de devis professionnels",
        "Gestion complète des clients",
        "Génération de bons de sortie",
        "Dashboard personnalisé",
        "Support par email"
      ],
      buttonText: "Commencer gratuitement",
      buttonVariant: "outline",
      link: "/register"
    },
    {
      name: "Abonnement Annuel",
      price: "390",
      duration: "par an (HT)",
      description: "Solution complète pour votre entreprise",
      features: [
        "Gestion illimitée des factures",
        "Création de devis professionnels",
        "Gestion complète des clients",
        "Génération de bons de sortie",
        "Dashboard personnalisé",
        "Support prioritaire",
        "Accès à toutes les mises à jour",
        "Intégration avec vos outils existants"
      ],
      buttonText: "S'abonner maintenant",
      buttonVariant: "default",
      link: "/register",
      popular: true
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with logo */}
      <header className="w-full py-4 px-4 md:px-6 bg-white shadow-sm flex items-center justify-between">
        <Logo size="lg" compact={true} />
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            Connexion
          </Link>
          <Button asChild size="sm">
            <Link to="/register">S'inscrire</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-blue-500/20 text-white hover:bg-blue-500/30 mb-4">
              Solution de gestion d'entreprise
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Simplifiez la gestion de votre entreprise
            </h1>
            <p className="text-xl text-blue-100">
              Notre application vous permet de gérer facilement vos factures, devis, clients et produits en un seul endroit,
              avec une interface intuitive et efficace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/register">
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                <Link to="/login">
                  Se connecter
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-full max-w-md rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/9167ea68-92ed-4bca-8531-57be63af98a2.png" 
                alt="Femme gérant une facture sur son ordinateur" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fonctionnalités principales</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment notre solution peut transformer votre gestion quotidienne et vous aider à développer votre entreprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tarifs simples et transparents</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le plan qui convient le mieux à vos besoins, sans frais cachés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                      Recommandé
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price} DT</span>
                    <span className="ml-1 text-xl text-gray-500">/{plan.duration}</span>
                  </div>
                  <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant as any} 
                    size="lg"
                    asChild
                  >
                    <Link to={plan.link}>
                      {plan.buttonText}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo variant="light" size="lg" />
            </div>
            <p className="text-gray-400 mb-4">
              Solution complète pour la gestion de votre entreprise. Simplifiez vos tâches administratives et concentrez-vous sur votre cœur de métier.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Connexion</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">S'inscrire</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>info@entreprise.com</li>
              <li>+216 XX XXX XXX</li>
              <li>Tunis, Tunisie</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Soft-Facture. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
