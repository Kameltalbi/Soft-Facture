
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
  status?: string;
}

export function DocumentHeader({
  title,
  documentNumber,
  emissionDate,
  dueDate,
  variant = "facture",
  status,
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
    <div className="flex justify-between mb-8">
      <div className="text-left">
        {isLoading ? (
          <div className="w-52 h-14 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <h2 className="text-xl font-bold">
              {companyInfo?.nom || "Votre Entreprise"}
            </h2>
            <div className="text-sm mt-2">
              <p>{companyInfo?.adresse || "Adresse de l'entreprise"}</p>
              {companyInfo?.code_tva && <p>TVA: {companyInfo.code_tva}</p>}
              {companyInfo?.telephone && <p>Tél: {companyInfo.telephone}</p>}
              {companyInfo?.email_contact && <p>Email: {companyInfo.email_contact}</p>}
            </div>
          </>
        )}
      </div>
      
      <div className="text-right">
        <h1 className={`text-3xl font-bold ${getColorClass()}`}>
          {title}
        </h1>
        <div className="text-sm mt-3 space-y-1">
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
          {status && (
            <p>
              <span className="font-medium">
                Statut :
              </span>{" "}
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
