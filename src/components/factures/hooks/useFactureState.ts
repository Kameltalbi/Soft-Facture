
import { useState } from "react";
import { getCurrencySymbol, getMontantEnLettresText } from "../utils/factureUtils";
import { toast } from "sonner";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";
import { StatutFacture } from "@/types";

export function useFactureState(factureId: string | null) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState(0);
  const [currency, setCurrency] = useState("TND");
  const [isCreated, setIsCreated] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  
  const currencySymbol = getCurrencySymbol(currency);

  const isEditing = factureId !== null;

  // Lignes de produits avec ajout des nouveaux champs pour la TVA
  const [productLines, setProductLines] = useState([
    {
      id: "1",
      name: "Développement site web",
      quantity: 1,
      unitPrice: 1200,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true, // Par défaut, on utilise un taux de TVA
      discount: 0,
      total: 1200,
    },
  ]);

  const addProductLine = () => {
    const newLine = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      tva: 20,
      montantTVA: 0,
      estTauxTVA: true,
      discount: 0,
      total: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const removeProductLine = (id: string) => {
    setProductLines(productLines.filter((line) => line.id !== id));
  };

  // Handler for tax input changes
  const handleTaxChange = (id: string, value: number, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          tva: estTauxTVA ? value : line.tva,
          montantTVA: !estTauxTVA ? value : line.montantTVA,
          estTauxTVA: estTauxTVA
        };
      }
      return line;
    }));
  };

  // Handler for changing tax mode
  const handleTaxModeChange = (id: string, estTauxTVA: boolean) => {
    setProductLines(productLines.map((line) => {
      if (line.id === id) {
        return { 
          ...line, 
          estTauxTVA,
          // Reset the value when changing modes to avoid confusion
          tva: estTauxTVA ? 20 : line.tva,
          montantTVA: !estTauxTVA ? 0 : line.montantTVA
        };
      }
      return line;
    }));
  };

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

  // Handle advance payment change
  const handleAdvancePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAdvancePaymentAmount(value > totalTTC ? totalTTC : value);
  };

  // Get the formatted text for the amount in words
  const montantEnLettresText = getMontantEnLettresText(
    totalTTC, 
    advancePaymentAmount, 
    finalAmount, 
    showAdvancePayment, 
    currency
  );

  // Generate a facture number
  const generateFactureNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `FAC-${year}-${randomId}`;
  };

  // Handler for creating the invoice
  const handleCreate = () => {
    // Create the new invoice
    const newFacture = {
      id: isEditing ? factureId : Date.now().toString(),
      numero: isEditing ? "FAC2025-001" : generateFactureNumber(),
      client: "Entreprise ABC",
      date: new Date().toISOString(),
      montant: totalTTC,
      statut: "draft",
      products: productLines,
      currency: currency,
      subtotal: subtotal,
      totalTVA: totalTVA,
      totalTTC: totalTTC,
      montantEnLettresText: montantEnLettresText
    };

    setCurrentData(newFacture);
    setIsCreated(true);
    
    toast.success(isEditing ? "Facture modifiée avec succès" : "Facture créée avec succès");
  };

  // Handler for cancelling
  const handleCancel = () => {
    toast.info("La facture a été annulée");
    setIsCreated(false);
  };

  // Handler for saving (without closing the modal)
  const handleSave = () => {
    toast.success("Facture enregistrée");
  };

  // Handler for downloading the invoice as PDF
  const handleDownloadPDF = () => {
    try {
      if (!currentData) {
        // If we're not in created state yet, construct the data
        const invoiceData = {
          id: factureId || "new",
          numero: isEditing ? "FAC2025-001" : "FAC2025-005",
          client: {
            id: "1",
            nom: "Entreprise ABC",
            email: "contact@abc.fr",
            adresse: "456 Avenue des Clients, 69002 Lyon, France"
          },
          dateCreation: new Date().toISOString(),
          dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
          totalTTC: totalTTC,
          statut: "brouillon" as StatutFacture,
          produits: productLines,
          applyTVA,
          showDiscount,
          currency
        };
        
        // Download the PDF
        downloadInvoiceAsPDF(invoiceData);
        return true;
      }
      
      // If created, use the current data
      const invoiceData = {
        id: currentData.id,
        numero: currentData.numero,
        client: {
          id: "client-id",
          nom: currentData.client,
          email: "client@example.com",
          adresse: "456 Avenue des Clients, 69002 Lyon, France"
        },
        dateCreation: currentData.date,
        dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        totalTTC: currentData.totalTTC,
        statut: "brouillon" as StatutFacture,
        produits: currentData.products,
        applyTVA: applyTVA,
        showDiscount: showDiscount,
        currency: currentData.currency
      };

      downloadInvoiceAsPDF(invoiceData);
      return true;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      toast.error("Erreur lors de la génération du PDF");
      return false;
    }
  };

  return {
    showSettings,
    setShowSettings,
    applyTVA,
    setApplyTVA,
    showDiscount,
    setShowDiscount,
    showAdvancePayment,
    setShowAdvancePayment,
    advancePaymentAmount,
    currency,
    setCurrency,
    isCreated,
    isEditing,
    productLines,
    currencySymbol,
    subtotal,
    totalTVA,
    totalTTC,
    finalAmount,
    montantEnLettresText,
    addProductLine,
    removeProductLine,
    handleTaxChange,
    handleTaxModeChange,
    handleAdvancePaymentChange,
    handleCreate,
    handleCancel,
    handleSave,
    handleDownloadPDF
  };
}
