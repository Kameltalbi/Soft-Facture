
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <Badge className="bg-blue-500/20 text-white hover:bg-blue-500/30 mb-4 animate-[pulse_3s_infinite]">
            Solution de gestion d'entreprise
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight opacity-0 animate-[fade-in_0.6s_ease-out_0.2s_forwards]">
            Simplifiez la gestion de votre entreprise
          </h1>
          <p className="text-xl text-blue-100 opacity-0 animate-[fade-in_0.6s_ease-out_0.4s_forwards]">
            Notre application vous permet de gérer facilement vos factures, devis, clients et produits en un seul endroit,
            avec une interface intuitive et efficace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 opacity-0 animate-[fade-in_0.6s_ease-out_0.6s_forwards]">
            <Button 
              size="lg" 
              asChild 
              className="transition-transform hover:scale-105 duration-300"
            >
              <Link to="/register?plan=trial">
                Commencer l'essai gratuit
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-transform hover:scale-105 duration-300" 
              asChild
            >
              <Link to="/login">
                Se connecter
              </Link>
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards] translate-x-4 md:translate-x-8">
          <div className="w-full max-w-md rounded-lg overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] transform-gpu">
            <img 
              src="/lovable-uploads/f3335221-0d73-477f-a85d-920a39994cbc.png" 
              alt="Tableau de bord d'analyse de business avec graphiques" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
