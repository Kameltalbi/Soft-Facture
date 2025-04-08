
import PricingCard from "./PricingCard";

const PricingSection = () => {
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
      buttonVariant: "outline" as const,
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
      buttonVariant: "default" as const,
      link: "/register",
      popular: true
    }
  ];

  return (
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
            <PricingCard 
              key={index}
              name={plan.name}
              price={plan.price}
              duration={plan.duration}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonVariant={plan.buttonVariant}
              link={plan.link}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
