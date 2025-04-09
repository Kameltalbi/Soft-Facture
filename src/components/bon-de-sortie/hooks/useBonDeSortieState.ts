
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";
import { montantEnLettres } from "../utils/bonDeSortieUtils";
import { ProductLine } from "../components/ProductLineEditor";

export function useBonDeSortieState(bonDeSortieId: string | null) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [currency, setCurrency] = useState("TND");
  const [isCreated, setIsCreated] = useState(false);
  const [currentData, setCurrentData] = useState<any>(null);

  const isEditing = bonDeSortieId !== null;

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

  // Calculate totals when product lines change
  useEffect(() => {
    const updatedLines = productLines.map(line => {
      const lineTotal = line.quantity * line.unitPrice;
      return {
        ...line,
        total: lineTotal
      };
    });
    setProductLines(updatedLines);
  }, []);

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

  // Générer un numéro de bon de sortie au format BDS-YYYY-XXX
  const generateBonDeSortieNumber = () => {
    const year = new Date().getFullYear();
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BDS-${year}-${randomId}`;
  };

  // Handler pour créer un bon de sortie
  const handleCreate = () => {
    // Créer le nouveau bon de sortie
    const newBonDeSortie = {
      id: isEditing ? bonDeSortieId : Date.now().toString(),
      numero: isEditing ? "BDS-2023-XXX" : generateBonDeSortieNumber(),
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

    setCurrentData(newBonDeSortie);
    setIsCreated(true);
    
    toast.success(isEditing ? "Bon de sortie modifié avec succès" : "Bon de sortie créé avec succès");
  };

  // Handler pour annuler
  const handleCancel = () => {
    toast.info("Le bon de sortie a été annulé");
    setIsCreated(false);
  };

  // Handler pour enregistrer (sans fermer le modal)
  const handleSave = () => {
    toast.success("Bon de sortie enregistré");
  };

  // Handler pour télécharger le PDF
  const handleDownloadPDF = () => {
    try {
      if (!currentData) return false;
      
      // On adapte les données au format attendu par le générateur de PDF
      const invoiceData = {
        id: currentData.id,
        numero: currentData.numero,
        client: {
          id: "client-id",
          nom: currentData.client,
          email: "client@example.com",
          adresse: "Adresse du client"
        },
        dateCreation: currentData.date,
        dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        totalTTC: currentData.totalTTC,
        statut: "brouillon" as const,
        produits: currentData.products,
        applyTVA: applyTVA,
        showDiscount: showDiscount,
        currency: currentData.currency
      };

      downloadInvoiceAsPDF(invoiceData, "fr");
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
    currency,
    setCurrency,
    isCreated,
    isEditing,
    productLines,
    setProductLines,
    subtotal,
    totalTVA,
    totalTTC,
    montantTTCEnLettres,
    handleCreate,
    handleCancel,
    handleSave,
    handleDownloadPDF
  };
}
