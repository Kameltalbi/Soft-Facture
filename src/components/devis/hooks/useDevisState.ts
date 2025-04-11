
import { useState } from "react";
import { montantEnLettres } from "../utils/devisUtils";
import { toast } from "sonner";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";
import { ProductLine } from "../components/ProductLineTable";

export function useDevisState(devisId: string | null) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [currency, setCurrency] = useState("TND");
  const [isCreated, setIsCreated] = useState(false);
  const [currentDevisData, setCurrentDevisData] = useState<any>(null);

  const isEditing = devisId !== null;

  // Lignes de produits avec ajout des nouveaux champs pour la TVA
  const [productLines, setProductLines] = useState<ProductLine[]>([
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
  
  // Préparer le texte des montants en lettres
  const montantTTCEnLettres = montantEnLettres(totalTTC, currency);

  // Générer un numéro de devis au format DEV-YYYY-XXX
  const generateDevisNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DEV-${year}-${randomId}`;
  };

  // Handler pour créer un devis
  const handleCreateDevis = () => {
    // Créer le nouveau devis
    const newDevis = {
      id: isEditing ? devisId : Date.now().toString(),
      numero: isEditing ? "DEV-2023-XXX" : generateDevisNumber(),
      client: "Client Exemple",
      date: new Date().toISOString(),
      montant: totalTTC,
      statut: "draft",
      products: productLines,
      currency: currency,
      subtotal: subtotal,
      totalTVA: totalTVA,
      totalTTC: totalTTC,
      montantTTCEnLettres: montantTTCEnLettres
    };

    setCurrentDevisData(newDevis);
    setIsCreated(true);
    
    toast.success(isEditing ? "Devis modifié avec succès" : "Devis créé avec succès");
  };

  // Handler pour annuler le devis
  const handleCancelDevis = () => {
    // Logique pour annuler un devis
    toast.info("Le devis a été annulé");
    setIsCreated(false);
  };

  // Handler pour télécharger le PDF
  const handleDownloadPDF = () => {
    try {
      if (!currentDevisData) return false;
      
      // On adapte les données du devis au format attendu par le générateur de PDF
      const invoiceData = {
        id: currentDevisData.id,
        numero: currentDevisData.numero,
        type: 'devis' as const,
        client: {
          id: "client-id",
          nom: currentDevisData.client,
          email: "client@example.com",
          adresse: "Adresse du client",
          telephone: "",
          code_tva: ""
        },
        dateCreation: currentDevisData.date,
        dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        items: currentDevisData.products,
        totalHT: subtotal,
        totalTVA: totalTVA,
        totalTTC: totalTTC,
        devise: currentDevisData.currency,
        currency: currentDevisData.currency,
        applyTVA: applyTVA,
        showDiscount: showDiscount
      };

      downloadInvoiceAsPDF(invoiceData, "fr");
      return true;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      toast.error("Erreur lors de la génération du PDF");
      return false;
    }
  };

  // Handler pour enregistrer le devis (sans fermer le modal)
  const handleSaveDevis = () => {
    // Ici, vous implémenteriez la logique pour sauvegarder le devis
    toast.success("Devis enregistré");
  };

  return {
    showSettings,
    setShowSettings,
    applyTVA,
    setApplyTVA,
    showDiscount,
    setShowDiscount,
    currency,
    setCurrency,
    isCreated,
    isEditing,
    productLines,
    subtotal,
    totalTVA,
    totalTTC,
    montantTTCEnLettres,
    addProductLine,
    removeProductLine,
    handleTaxChange,
    handleTaxModeChange,
    handleCreateDevis,
    handleCancelDevis,
    handleSaveDevis,
    handleDownloadPDF
  };
}
