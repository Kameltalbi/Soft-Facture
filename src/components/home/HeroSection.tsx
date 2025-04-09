
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
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
              <Link to="/register?plan=trial">
                Commencer l'essai gratuit
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
  );
};

export default HeroSection;
