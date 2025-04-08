
// Helper function to convert a number to words in French
export const numeroEnLettres = (nombre: number): string => {
  if (nombre === 0) return "zéro";

  const unites = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const dizaines = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

  const convertirMoins1000 = (n: number): string => {
    if (n < 20) return unites[n];
    if (n < 100) {
      const dizaine = Math.floor(n / 10);
      const unite = n % 10;
      
      if (dizaine === 7 || dizaine === 9) {
        return dizaines[dizaine - 1] + "-" + unites[unite + 10];
      }
      
      return dizaines[dizaine] + (unite > 0 ? "-" + unites[unite] : "");
    }
    
    const centaine = Math.floor(n / 100);
    const reste = n % 100;
    
    return (centaine === 1 ? "cent" : unites[centaine] + " cent") + 
           (reste > 0 ? " " + convertirMoins1000(reste) : "");
  };

  let result = "";
  
  // Traitement des milliards
  const milliards = Math.floor(nombre / 1000000000);
  if (milliards > 0) {
    result += (milliards === 1 ? "un milliard" : convertirMoins1000(milliards) + " milliards") + " ";
    nombre %= 1000000000;
  }
  
  // Traitement des millions
  const millions = Math.floor(nombre / 1000000);
  if (millions > 0) {
    result += (millions === 1 ? "un million" : convertirMoins1000(millions) + " millions") + " ";
    nombre %= 1000000;
  }
  
  // Traitement des milliers
  const milliers = Math.floor(nombre / 1000);
  if (milliers > 0) {
    result += (milliers === 1 ? "mille" : convertirMoins1000(milliers) + " mille") + " ";
    nombre %= 1000;
  }
  
  // Traitement des centaines
  if (nombre > 0) {
    result += convertirMoins1000(nombre);
  }
  
  return result.trim();
};

// Formatte un montant en lettres avec la devise
export const montantEnLettres = (montant: number, devise: string = "TND"): string => {
  const entier = Math.floor(montant);
  const centimes = Math.round((montant - entier) * 100);
  
  let result = numeroEnLettres(entier);
  
  // Ajouter la devise
  switch (devise) {
    case "TND":
      result += " dinar" + (entier > 1 ? "s" : "") + " tunisien" + (entier > 1 ? "s" : "");
      break;
    case "EUR":
      result += " euro" + (entier > 1 ? "s" : "");
      break;
    case "USD":
      result += " dollar" + (entier > 1 ? "s" : "");
      break;
    case "GBP":
      result += " livre" + (entier > 1 ? "s" : "") + " sterling";
      break;
    case "CHF":
      result += " franc" + (entier > 1 ? "s" : "") + " suisse" + (entier > 1 ? "s" : "");
      break;
    case "CAD":
      result += " dollar" + (entier > 1 ? "s" : "") + " canadien" + (entier > 1 ? "s" : "");
      break;
    default:
      result += " " + devise;
  }
  
  // Ajouter les centimes si nécessaire
  if (centimes > 0) {
    result += " et " + numeroEnLettres(centimes) + " millime" + (centimes > 1 ? "s" : "");
  }
  
  return result;
};

// Helper function to get currency symbol
export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
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
      return currency;
  }
};
