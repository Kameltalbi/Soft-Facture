
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface PricingCardProps {
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  link: string;
  popular?: boolean;
}

const PricingCard = ({
  name,
  price,
  duration,
  description,
  features,
  buttonText,
  buttonVariant,
  link,
  popular
}: PricingCardProps) => {
  return (
    <Card className={`relative overflow-hidden ${popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
            Recommandé
          </div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <div className="mt-4 flex items-baseline text-gray-900">
          <span className="text-4xl font-extrabold tracking-tight">{price} DT</span>
          <span className="ml-1 text-xl text-gray-500">/{duration}</span>
        </div>
        <CardDescription className="mt-4 text-base">{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <ul className="mt-6 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="ml-3 text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={buttonVariant} 
          size="lg"
          asChild
        >
          <Link to={link}>
            {buttonText}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
