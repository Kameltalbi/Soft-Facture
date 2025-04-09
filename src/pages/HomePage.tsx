
import { useTranslation } from "react-i18next";
import HomeHeader from "@/components/home/HomeHeader";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PricingSection from "@/components/home/PricingSection";
import Footer from "@/components/home/Footer";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <HomeHeader />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default HomePage;
