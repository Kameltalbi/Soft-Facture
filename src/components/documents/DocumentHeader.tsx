
import React, { useEffect, useState } from "react";
import { CompanyInfo } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";
import { Building } from "lucide-react";

interface DocumentHeaderProps {
  title: string;
  documentNumber: string;
  emissionDate: string;
  dueDate: string;
  variant?: "facture" | "devis" | "bon-sortie";
}

export function DocumentHeader({
  title,
  documentNumber,
  emissionDate,
  dueDate,
  variant = "facture",
}: DocumentHeaderProps) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('company_info')
          .select('*')
          .limit(1)
          .single();
        
        if (error) {
          console.error("Erreur lors du chargement des informations de l'entreprise:", error);
        } else if (data) {
          setCompanyInfo(data as CompanyInfo);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des informations de l'entreprise:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);
  
  const getColorClass = () => {
    switch (variant) {
      case "devis":
        return "text-yellow-600";
      case "bon-sortie":
        return "text-green-600";
      default:
        return "text-invoice-blue-600";
    }
  };
  
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        {isLoading ? (
          <div className="w-52 h-14 bg-gray-200 animate-pulse rounded"></div>
        ) : companyInfo?.logo_url ? (
          <div className="w-52 h-14 flex items-center justify-center">
            <img 
              src={companyInfo.logo_url} 
              alt={companyInfo.nom || "Logo entreprise"} 
              className="h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-52 h-14 bg-invoice-blue-100 flex items-center justify-center rounded">
            <Building className="mr-2 h-5 w-5 text-invoice-blue-700" />
            <p className="font-bold text-invoice-blue-700">
              {companyInfo?.nom || "VOTRE ENTREPRISE"}
            </p>
          </div>
        )}
        
        <div className="mt-4 text-sm">
          <p className="font-semibold">{companyInfo?.nom || "Votre Entreprise"}</p>
          <p>{companyInfo?.adresse || "Adresse de l'entreprise"}</p>
          {companyInfo?.code_tva && <p>TVA: {companyInfo.code_tva}</p>}
          {companyInfo?.telephone && <p>Tél: {companyInfo.telephone}</p>}
          {companyInfo?.email_contact && <p>Email: {companyInfo.email_contact}</p>}
        </div>
      </div>
      <div className="text-right">
        <h1 className={`text-2xl font-bold ${getColorClass()} mb-2`}>
          {title}
        </h1>
        <div className="text-sm">
          <p>
            <span className="font-medium">№ :</span> {documentNumber}
          </p>
          <p>
            <span className="font-medium">Date d'émission :</span>{" "}
            {emissionDate}
          </p>
          <p>
            <span className="font-medium">
              Date d'échéance :
            </span>{" "}
            {dueDate}
          </p>
        </div>
      </div>
    </div>
  );
}
