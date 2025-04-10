
import { getCurrencySymbol, getMontantEnLettresText } from "../utils/factureUtils";

export function useFactureCalculations(
  productLines: any[],
  applyTVA: boolean,
  advancePaymentAmount: number,
  showAdvancePayment: boolean,
  currency: string
) {
  const currencySymbol = getCurrencySymbol(currency);

  const subtotal = productLines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0
  );

  // Calculate TVA based on rate or fixed amount depending on the estTauxTVA flag
  const totalTVA = applyTVA
    ? productLines.reduce(
        (sum, line) => {
          if (line.estTauxTVA) {
            return sum + line.quantity * line.unitPrice * (line.tva / 100);
          } else {
            return sum + line.montantTVA;
          }
        },
        0
      )
    : 0;

  const totalTTC = subtotal + totalTVA;
  
  // Calculate the final amount due after subtracting advance payment
  const finalAmount = totalTTC - advancePaymentAmount;

  // Get the formatted text for the amount in words
  const montantEnLettresText = getMontantEnLettresText(
    totalTTC, 
    advancePaymentAmount, 
    finalAmount, 
    showAdvancePayment, 
    currency
  );

  return {
    currencySymbol,
    subtotal,
    totalTVA,
    totalTTC,
    finalAmount,
    montantEnLettresText
  };
}
