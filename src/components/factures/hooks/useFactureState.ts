import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StatutFacture } from "@/types";
import { useProductLines } from "./useProductLines";
import { useFactureApi } from "./useFactureApi";
import { useFactureCalculations } from "./useFactureCalculations";
import { useFactureSettings } from "./useFactureSettings";

export function useFactureState(factureId: string | null) {
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const {
    applyTVA,
    setApplyTVA,
    showDiscount,
    setShowDiscount,
    showAdvancePayment,
    setShowAdvancePayment,
    currency,
    setCurrency
  } = useFactureSettings();

  // Initialiser l'avance depuis le localStorage
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState(() => {
    const storedAmount = localStorage.getItem('advancePaymentAmount');
    return storedAmount ? parseFloat(storedAmount) : 0;
  });

  // Sauvegarder l'avance dans le localStorage
  useEffect(() => {
    localStorage.setItem('advancePaymentAmount', advancePaymentAmount.toString());
  }, [advancePaymentAmount]);
  
  // Form state
  const [isCreated, setIsCreated] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [clientName, setClientName] = useState("Entreprise ABC");
  const [invoiceNumber, setInvoiceNumber] = useState<string | undefined>(undefined);
  const [invoiceDate, setInvoiceDate] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  
  // Import sub-hooks
  const { 
    productLines, 
    setProductLines,
    addProductLine, 
    removeProductLine, 
    handleTaxChange, 
    handleTaxModeChange,
    handleQuantityChange,
    handlePriceChange,
    handleProductNameChange
  } = useProductLines();
  
  const {
    isLoading,
    generateFactureNumber,
    createFacture,
    updateFacture,
    fetchFacture,
    downloadPDF
  } = useFactureApi();
  
  const {
    currencySymbol,
    subtotal,
    totalTVA,
    totalTTC,
    finalAmount,
    montantEnLettresText
  } = useFactureCalculations(
    productLines, 
    applyTVA, 
    advancePaymentAmount, 
    showAdvancePayment, 
    currency
  );

  const isEditing = factureId !== null;

  // Fetch facture data if editing
  useEffect(() => {
    const loadFactureData = async () => {
      if (!factureId) return;
      
      const data = await fetchFacture(factureId);
      
      if (data) {
        // Set form data based on fetched facture
        // We need to use optional chaining since field names might differ
        setClientName(data.client_nom || "Entreprise ABC");
        setApplyTVA(data.appliquer_tva !== false);
        setShowDiscount(!!data.remise_globale);
        setShowAdvancePayment(!!data.avance_percue);
        setAdvancePaymentAmount(data.avance_percue || 0);
        setCurrency(data.devise || "TND");
        setInvoiceNumber(data.numero);
        setInvoiceDate(data.date_creation);
        setDueDate(data.date_echeance);
        
        // Set product lines
        if (data.lignes_facture && data.lignes_facture.length > 0) {
          setProductLines(data.lignes_facture.map((line: any) => ({
            id: line.id,
            name: line.nom,
            quantity: line.quantite,
            unitPrice: line.prix_unitaire,
            tva: line.taux_tva,
            montantTVA: line.montant_tva || 0,
            estTauxTVA: line.est_taux_tva,
            discount: line.remise || 0,
            total: line.sous_total,
          })));
        }
        
        setCurrentData(data);
      }
    };
    
    loadFactureData();
  }, [factureId, fetchFacture, setProductLines]);

  // Handle advance payment change
  const handleAdvancePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAdvancePaymentAmount(value > totalTTC ? totalTTC : value);
  };

  // Handler for creating the invoice
  const handleCreate = async () => {
    const factureNumber = await generateFactureNumber();
    setInvoiceNumber(factureNumber);
    
    // Prepare the facture data without client_id to avoid foreign key constraint
    const factureData = {
      numero: factureNumber,
      client_nom: clientName,
      date_creation: new Date().toISOString(),
      date_echeance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      sous_total: subtotal,
      total_tva: totalTVA,
      total_ttc: totalTTC,
      remise_globale: showDiscount ? 0 : null,
      avance_percue: showAdvancePayment ? advancePaymentAmount : null,
      statut: 'brouillon' as StatutFacture,
      notes: '',
      appliquer_tva: applyTVA,
      devise: currency
    };

    // Create the facture
    const data = await createFacture(factureData, productLines);
    
    if (data) {
      // Create the new invoice object for the UI
      const newFacture = {
        id: data.id,
        numero: factureNumber,
        client_nom: clientName,
        date_creation: new Date().toISOString(),
        date_echeance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        total_ttc: totalTTC,
        statut: "brouillon",
        produits: productLines,
        devise: currency,
        sous_total: subtotal,
        total_tva: totalTVA,
        montantEnLettresText: montantEnLettresText,
        showAdvancePayment: showAdvancePayment,
        advancePaymentAmount: showAdvancePayment ? advancePaymentAmount : 0
      };

      setCurrentData(newFacture);
      setIsCreated(true);
      
      toast.success(isEditing ? "Facture modifiée avec succès" : "Facture créée avec succès");
    }
  };

  // Handler for cancelling
  const handleCancel = () => {
    toast.info("La facture a été annulée");
    setIsCreated(false);
  };

  // Handler for saving (without closing the modal)
  const handleSave = async () => {
    if (!currentData?.id) {
      toast.error("Impossible d'enregistrer une facture qui n'existe pas encore");
      return;
    }
    
    // Prepare the facture data
    const factureData = {
      client_nom: clientName,
      sous_total: subtotal,
      total_tva: totalTVA,
      total_ttc: totalTTC,
      remise_globale: showDiscount ? 0 : null,
      avance_percue: showAdvancePayment ? advancePaymentAmount : null,
      appliquer_tva: applyTVA,
      devise: currency,
      updated_at: new Date().toISOString()
    };
    
    // Update the facture
    await updateFacture(currentData.id, factureData);
  };

  const handleDownloadPDF = () => {
    try {
      if (!currentData) {
        // If we're not in created state yet, construct the data
        const invoiceData = {
          id: factureId || "new",
          numero: invoiceNumber || "FAC2025-001",
          client: {
            id: "1",
            nom: clientName,
            email: "contact@abc.fr",
            adresse: "456 Avenue des Clients, 69002 Lyon, France"
          },
          dateCreation: invoiceDate || new Date().toISOString(),
          dateEcheance: dueDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
          totalTTC: totalTTC,
          statut: "brouillon" as StatutFacture,
          produits: productLines,
          applyTVA,
          showDiscount,
          showAdvancePayment,
          advancePaymentAmount, 
          currency
        };
        
        // Download the PDF
        return downloadPDF(invoiceData);
      }
      
      // If created, use the current data
      const invoiceData = {
        id: currentData.id,
        numero: currentData.numero,
        client: {
          id: "client-id",
          nom: currentData.client_nom || clientName,
          email: "client@example.com",
          adresse: "456 Avenue des Clients, 69002 Lyon, France"
        },
        dateCreation: currentData.date_creation || new Date().toISOString(),
        dateEcheance: currentData.date_echeance || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        totalTTC: currentData.total_ttc || totalTTC,
        statut: currentData.statut || "brouillon" as StatutFacture,
        produits: productLines,
        applyTVA: applyTVA,
        showDiscount: showDiscount,
        showAdvancePayment: showAdvancePayment,
        advancePaymentAmount: advancePaymentAmount,
        currency: currentData.devise || currency
      };

      return downloadPDF(invoiceData);
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
    isLoading,
    productLines,
    currencySymbol,
    subtotal,
    totalTVA,
    totalTTC,
    finalAmount,
    montantEnLettresText,
    clientName,
    setClientName,
    invoiceNumber,
    invoiceDate,
    dueDate,
    addProductLine,
    removeProductLine,
    handleTaxChange,
    handleTaxModeChange,
    handleQuantityChange,
    handlePriceChange,
    handleProductNameChange,
    handleAdvancePaymentChange,
    handleCreate,
    handleCancel,
    handleSave,
    handleDownloadPDF
  };
}
