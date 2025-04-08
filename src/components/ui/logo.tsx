
import { FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const Logo = ({ variant = "dark", size = "md" }: LogoProps) => {
  const textColor = variant === "light" ? "text-white" : "text-blue-600";
  const iconColor = variant === "light" ? "text-white" : "text-blue-500";
  
  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];
  
  const iconSize = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  }[size];
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className={`bg-blue-600 rounded-md p-1.5 flex items-center justify-center`}>
        <FileSpreadsheet className={`${iconSize} ${variant === "light" ? "text-white" : "text-white"}`} />
      </div>
      <span className={`font-bold ${textColor} ${textSize}`}>
        Soft<span className={`${variant === "light" ? "text-white" : "text-blue-600"}`}>-Facture</span>
      </span>
    </Link>
  );
};

export default Logo;
