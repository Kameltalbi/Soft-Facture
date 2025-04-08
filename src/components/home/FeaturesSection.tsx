
import { FileText, BarChart2, Users, Calendar, Shield, Settings } from "lucide-react";
import FeatureItem from "./FeatureItem";

const FeaturesSection = () => {
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

  return (
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
            <FeatureItem 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
