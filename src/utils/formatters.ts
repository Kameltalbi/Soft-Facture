
import { Devise } from "@/types";

// Get the default currency from the list
export const getDefaultDevise = (devises: Devise[]): Devise | undefined => {
  // First try to get the default currency from localStorage
  const storedDefaultSymbol = localStorage.getItem('defaultCurrency');
  
  if (storedDefaultSymbol) {
    const storedDefault = devises.find(d => d.symbole === storedDefaultSymbol);
    if (storedDefault) return storedDefault;
  }
  
  // Fall back to the currency marked as default in the devises array
  return devises.find(d => d.estParDefaut);
};

// Format a number according to currency settings
export const formatMontant = (
  montant: number, 
  devise?: Devise
): string => {
  if (!devise) {
    return montant.toLocaleString('fr-FR');
  }
  
  const { nbDecimales, separateurMillier, symbole } = devise;
  
  // Format the number with the correct number of decimals
  const formattedNumber = montant.toLocaleString('fr-FR', {
    minimumFractionDigits: nbDecimales,
    maximumFractionDigits: nbDecimales,
    useGrouping: true
  }).replace(/\s/g, separateurMillier);
  
  return `${formattedNumber} ${symbole}`;
};

// Format a number with currency symbol
export const formatMontantAvecSymbole = (
  montant: number,
  devise?: Devise
): string => {
  if (!devise) {
    return `${montant.toLocaleString('fr-FR')}`;
  }
  
  return formatMontant(montant, devise);
};

// Get currency symbol by code
export const getDeviseSymbol = (code: string): string => {
  switch (code) {
    case "TND":
      return "TND";
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "CHF":
      return "CHF";
    case "CAD":
      return "C$";
    default:
      return code;
  }
};

// Get default currency code from localStorage
export const getDefaultDeviseCode = (): string => {
  return localStorage.getItem('defaultCurrency') || "TND";
};
