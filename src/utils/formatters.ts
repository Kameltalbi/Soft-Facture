
import { Devise } from "@/types";

// Get the default currency from the list
export const getDefaultDevise = (devises: Devise[]): Devise | undefined => {
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
