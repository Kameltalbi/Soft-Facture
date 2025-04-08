
import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";

const Footer = () => {
  return (
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
  );
};

export default Footer;
