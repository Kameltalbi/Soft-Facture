
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

const HomeHeader = () => {
  return (
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
  );
};

export default HomeHeader;
