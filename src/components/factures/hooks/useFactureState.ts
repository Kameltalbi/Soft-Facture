
import { useState, useEffect } from "react";
import { getCurrencySymbol, getMontantEnLettresText } from "../utils/factureUtils";
import { toast } from "sonner";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";
import { StatutFacture } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function useFactureState(factureId: string | null) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [advancePaymentAmount, setAdvancePaymentAmount] = useState(0);
  const [currency, setCurrency] = useState("TND");
  const [isCreated, setIsCreated] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);
  const [clientName, setClientName] = useState("Entreprise ABC");
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<string | undefined>(undefined);
  const [invoiceDate, setInvoiceDate] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  
  const currencySymbol = getCurrencySymbol(currency);

  const isEditing = factureId !== null;

  // Fetch facture data if editing
  useEffect(() => {
    const fetchFactureData = async () => {
      if (!factureId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('factures')
          .select('*, lignes_facture(*)')
          .eq('id', factureId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Set form data based on fetched facture
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
      } catch (error) {
        console.error("Erreur lors du chargement de la facture:", error);
        toast.error("Erreur lors du chargement de la facture");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFactureData();
  }, [factureId]);

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

  // New handlers for updating product line quantity and price
  const handleQuantityChange = (id: string, value: number) => {
    setProductLines(productLines.map(line => {
      if (line.id === id) {
        const newTotal = value * line.unitPrice;
        return { ...line, quantity: value, total: newTotal };
      }
      return line;
    }));
  };

  const handlePriceChange = (id: string, value: number) => {
    setProductLines(productLines.map(line => {
      if (line.id === id) {
        const newTotal = line.quantity * value;
        return { ...line, unitPrice: value, total: newTotal };
      }
      return line;
    }));
  };

  const handleProductNameChange = (id: string, value: string) => {
    setProductLines(productLines.map(line => {
      if (line.id === id) {
        return { ...line, name: value };
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
  const generateFactureNumber = async () => {
    const year = new Date().getFullYear();
    
    try {
      // Get the count of existing invoices to generate a sequential number
      const { count, error } = await supabase
        .from('factures')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      const nextNumber = (count || 0) + 1;
      return `FAC-${year}-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error("Erreur lors de la génération du numéro de facture:", error);
      // Fallback to random number if count fails
      const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `FAC-${year}-${randomId}`;
    }
  };

  // Handler for creating the invoice
  const handleCreate = async () => {
    setIsLoading(true);
    
    try {
      const factureNumber = await generateFactureNumber();
      setInvoiceNumber(factureNumber);
      
      // Create the invoice in Supabase
      const { data: factureData, error: factureError } = await supabase
        .from('factures')
        .insert({
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
        })
        .select()
        .single();
        
      if (factureError) throw factureError;

      // Insert product lines
      const productLinesData = productLines.map(line => ({
        facture_id: factureData.id,
        nom: line.name,
        quantite: line.quantity,
        prix_unitaire: line.unitPrice,
        taux_tva: line.tva,
        montant_tva: line.montantTVA,
        est_taux_tva: line.estTauxTVA,
        remise: line.discount,
        sous_total: line.total
      }));
      
      const { error: linesError } = await supabase
        .from('lignes_facture')
        .insert(productLinesData);
        
      if (linesError) throw linesError;

      // Create the new invoice object for the UI
      const newFacture = {
        id: factureData.id,
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
        montantEnLettresText: montantEnLettresText
      };

      setCurrentData(newFacture);
      setIsCreated(true);
      
      toast.success(isEditing ? "Facture modifiée avec succès" : "Facture créée avec succès");
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast.error("Erreur lors de la création de la facture");
    } finally {
      setIsLoading(false);
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
    
    setIsLoading(true);
    
    try {
      // Update the invoice in Supabase
      const { error } = await supabase
        .from('factures')
        .update({
          client_nom: clientName,
          sous_total: subtotal,
          total_tva: totalTVA,
          total_ttc: totalTTC,
          remise_globale: showDiscount ? 0 : null,
          avance_percue: showAdvancePayment ? advancePaymentAmount : null,
          appliquer_tva: applyTVA,
          devise: currency,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentData.id);
        
      if (error) throw error;
      
      toast.success("Facture enregistrée");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la facture:", error);
      toast.error("Erreur lors de l'enregistrement de la facture");
    } finally {
      setIsLoading(false);
    }
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
        downloadInvoiceAsPDF(invoiceData);
        return true;
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
