import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StatutFacture } from "@/types";
import { getCurrencySymbol } from "@/components/factures/utils/factureUtils";
import { CompanyInfo } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";
import { montantEnLettres } from "@/components/factures/utils/factureUtils";

interface ProductLine {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  tva?: number;
  montantTVA?: number;
  estTauxTVA?: boolean;
  discount?: number;
}

interface InvoiceData {
  id: string;
  numero: string;
  client: {
    id: string;
    nom: string;
    email: string;
    adresse?: string;
  };
  dateCreation: string;
  dateEcheance: string;
  totalTTC: number;
  statut: StatutFacture;
  produits?: ProductLine[];
  applyTVA?: boolean;
  showDiscount?: boolean;
  showAdvancePayment?: boolean;
  advancePaymentAmount?: number;
  currency?: string;
}

// Format number with proper formatting (spaces as thousand separator)
const formatNumber = (number: number, locale: string = "fr-FR"): string => {
  return number.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).replace(/\s/g, " "); // Ensure spaces are regular spaces for consistent display
};

// Format date according to locale
const formatDate = (dateString: string, locale: string = "fr-FR"): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale).format(date);
};

// Get status label
const getStatusLabel = (statut: StatutFacture, locale: string = "fr"): string => {
  switch (statut) {
    case "payee":
      return locale === "fr" ? "Payée" : "Paid";
    case "envoyee":
      return locale === "fr" ? "Envoyée" : "Sent";
    case "retard":
      return locale === "fr" ? "En retard" : "Overdue";
    case "brouillon":
      return locale === "fr" ? "Brouillon" : "Draft";
    case "annulee":
      return locale === "fr" ? "Annulée" : "Cancelled";
    default:
      return locale === "fr" ? "Inconnu" : "Unknown";
  }
};

// Fetch company information from Supabase
const getCompanyInfo = async (): Promise<CompanyInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error("Erreur lors du chargement des informations de l'entreprise:", error);
      return null;
    }
    
    return data as CompanyInfo;
  } catch (error) {
    console.error("Erreur lors du chargement des informations de l'entreprise:", error);
    return null;
  }
};

// Add company information to the PDF
const addCompanyInfo = async (doc: jsPDF): Promise<void> => {
  const companyInfo = await getCompanyInfo();
  
  if (companyInfo) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80); // Dark blue color
    
    doc.text(companyInfo.nom, 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    if (companyInfo.adresse) {
      const addressLines = companyInfo.adresse.split(',');
      addressLines.forEach((line, index) => {
        doc.text(line.trim(), 20, 28 + (index * 5));
      });
    }
    
    let yPos = 28 + (companyInfo.adresse ? companyInfo.adresse.split(',').length * 5 : 0);
    
    if (companyInfo.code_tva) {
      doc.text(`TVA: ${companyInfo.code_tva}`, 20, yPos);
      yPos += 5;
    }
    
    if (companyInfo.telephone) {
      doc.text(`Tél: ${companyInfo.telephone}`, 20, yPos);
      yPos += 5;
    }
    
    if (companyInfo.email_contact) {
      doc.text(`Email: ${companyInfo.email_contact}`, 20, yPos);
    }
    
    // Add logo if available - positioning it in the top right with larger dimensions
    if (companyInfo.logo_url) {
      try {
        const img = new Image();
        img.src = companyInfo.logo_url;
        
        // Position the logo in the top right corner with larger dimensions
        doc.addImage(img, 'JPEG', 140, 10, 50, 50, undefined, 'FAST');
      } catch (error) {
        console.error("Erreur lors de l'ajout du logo:", error);
      }
    }
  } else {
    // Default company info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text("VOTRE ENTREPRISE", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text("123 Rue de Paris", 20, 28);
    doc.text("75001 Paris, France", 20, 33);
    doc.text("Tél: 01 23 45 67 89", 20, 38);
    doc.text("Email: contact@votreentreprise.fr", 20, 43);
  }
};

// Add invoice header with title and info
const addInvoiceHeader = (doc: jsPDF, invoiceData: InvoiceData, locale: string): void => {
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  // Adjust the position to place it under the logo
  doc.text(locale === "fr" ? "FACTURE" : "INVOICE", 140, 70);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${locale === "fr" ? "№" : "#"}: ${invoiceData.numero}`, 140, 80);
  doc.text(`${locale === "fr" ? "Date d'émission" : "Date"}: ${formatDate(invoiceData.dateCreation, locale === "fr" ? "fr-FR" : "en-US")}`, 140, 85);
  doc.text(`${locale === "fr" ? "Date d'échéance" : "Due Date"}: ${formatDate(invoiceData.dateEcheance, locale === "fr" ? "fr-FR" : "en-US")}`, 140, 90);
  // Remove status line
};

// Add client information to the PDF
const addClientInfo = (doc: jsPDF, invoiceData: InvoiceData, locale: string): void => {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text(locale === "fr" ? "FACTURER À" : "BILL TO", 20, 60);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.client.nom, 20, 67);
  if (invoiceData.client.adresse) {
    doc.text(invoiceData.client.adresse, 20, 72);
  } else {
    doc.text("456 Avenue des Clients", 20, 72);
    doc.text("69002 Lyon, France", 20, 77);
  }
  doc.text(`Email: ${invoiceData.client.email}`, 20, invoiceData.client.adresse ? 77 : 82);
};

// Prepare product data for the table
const prepareProductData = (invoiceData: InvoiceData, locale: string, currencySymbol: string): string[][] => {
  // Demo product data if not provided
  const products = invoiceData.produits || [
    {
      name: locale === "fr" ? "Développement site web" : "Website Development",
      quantity: 1,
      unitPrice: 1200,
      tva: 20,
      montantTVA: 240,
      estTauxTVA: true,
      discount: 0,
      total: 1200,
    },
  ];
  
  return products.map((product) => {
    const row = [
      product.name,
      product.quantity.toString(),
      `${formatNumber(product.unitPrice)} ${currencySymbol}`,
    ];
    
    if (invoiceData.applyTVA) {
      if (product.estTauxTVA) {
        row.push(`${product.tva}%`);
      } else {
        row.push(`${formatNumber(product.montantTVA || 0)} ${currencySymbol}`);
      }
    }
    
    if (invoiceData.showDiscount) {
      row.push(`${product.discount}%`);
    }
    
    row.push(`${formatNumber(product.total)} ${currencySymbol}`);
    
    return row;
  });
};

// Create table headers based on settings
const createTableHeaders = (invoiceData: InvoiceData, locale: string): string[] => {
  return [
    locale === "fr" ? "Description" : "Description",
    locale === "fr" ? "Qté" : "Qty",
    locale === "fr" ? "Prix unitaire" : "Unit Price",
    ...(invoiceData.applyTVA ? [locale === "fr" ? "TVA" : "Tax"] : []),
    ...(invoiceData.showDiscount ? [locale === "fr" ? "Remise" : "Discount"] : []),
    locale === "fr" ? "Total" : "Total",
  ];
};

// Add product table to the PDF
const addProductTable = (doc: jsPDF, invoiceData: InvoiceData, locale: string, currencySymbol: string): number => {
  const headers = createTableHeaders(invoiceData, locale);
  const data = prepareProductData(invoiceData, locale, currencySymbol);
  
  // Generate table - adjust start Y position to give more space after header
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 105, // Increased to allow more space for the logo and header
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [50, 55, 65],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    }
  });
  
  // Return the final Y position for subsequent elements
  return (doc as any).lastAutoTable.finalY + 10;
};

// Add totals section to the PDF
const addTotalsSection = (doc: jsPDF, invoiceData: InvoiceData, finalY: number, locale: string, currencySymbol: string): number => {
  doc.setFontSize(10);
  
  // Create a formatted totals section with better spacing
  // Sous-total
  doc.text(locale === "fr" ? "Sous-total:" : "Subtotal:", 120, finalY);
  doc.text(`${formatNumber(invoiceData.totalTTC)} ${currencySymbol}`, 170, finalY, { align: "right" });
  
  // Tax total if applicable
  if (invoiceData.applyTVA) {
    doc.text(locale === "fr" ? "TVA:" : "Tax:", 120, finalY + 7);
    // Demo tax calculation (20%)
    const tax = invoiceData.totalTTC * 0.2;
    doc.text(`${formatNumber(tax)} ${currencySymbol}`, 170, finalY + 7, { align: "right" });
  }
  
  // Show advance payment if applicable
  let yOffset = 15;
  if (invoiceData.showAdvancePayment && invoiceData.advancePaymentAmount && invoiceData.advancePaymentAmount > 0) {
    doc.text(locale === "fr" ? "Avance perçue:" : "Advance Payment:", 120, finalY + 15);
    doc.text(`-${formatNumber(invoiceData.advancePaymentAmount)} ${currencySymbol}`, 170, finalY + 15, { align: "right" });
    yOffset = 23; // Increase offset for final amount
  }
  
  // Total with tax
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  // Change total label based on whether advance payment was applied
  const totalLabel = (invoiceData.showAdvancePayment && invoiceData.advancePaymentAmount && invoiceData.advancePaymentAmount > 0) 
    ? (locale === "fr" ? "Reste à payer:" : "Amount Due:") 
    : (locale === "fr" ? "Total TTC:" : "Total Amount:");
  
  // Fix the spacing issue by adding proper spacing between label and amount
  doc.text(totalLabel, 120, finalY + yOffset);
  
  // Calculate final amount based on whether advance payment was applied
  const finalAmount = (invoiceData.showAdvancePayment && invoiceData.advancePaymentAmount) 
    ? invoiceData.totalTTC - invoiceData.advancePaymentAmount
    : invoiceData.totalTTC;
  
  doc.text(`${formatNumber(finalAmount)} ${currencySymbol}`, 170, finalY + yOffset, { align: "right" });
  
  // Add amount in words
  if (finalAmount) {
    // Use the proper function to get the amount in words, including advance payment info
    const amountInWords = invoiceData.showAdvancePayment && invoiceData.advancePaymentAmount && invoiceData.advancePaymentAmount > 0
      ? getMontantEnLettresWithAdvance(invoiceData.totalTTC, invoiceData.advancePaymentAmount, finalAmount, invoiceData.currency || "TND", locale)
      : montantEnLettres(finalAmount, invoiceData.currency || "TND");
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    // Add a light blue background for the text (similar to the preview)
    doc.setFillColor(240, 247, 255); // Light blue background
    doc.rect(20, finalY + yOffset + 10, doc.internal.pageSize.width - 40, 15, 'F');
    
    // Add the text with word wrapping for long texts
    doc.setTextColor(44, 62, 80); // Dark blue text
    
    // Handle text wrapping for long text
    const textLines = doc.splitTextToSize(
      locale === "fr" ? `Montant à payer: ${amountInWords}` : 
      `Amount in words: ${amountInWords}`, 
      doc.internal.pageSize.width - 50
    );
    
    doc.text(textLines, 25, finalY + yOffset + 18);
  }
  
  return finalY + yOffset + 30; // Return the new Y position after all totals and amount in words
};

// Helper function to format the amount in words with advance payment information
const getMontantEnLettresWithAdvance = (total: number, advance: number, remaining: number, currency: string, locale: string): string => {
  const totalInWords = montantEnLettres(total, currency);
  const advanceInWords = montantEnLettres(advance, currency);
  const remainingInWords = montantEnLettres(remaining, currency);
  
  if (locale === "fr") {
    return `Montant total: ${totalInWords}. Avance perçue: ${advanceInWords}. Reste à payer: ${remainingInWords}.`;
  } else {
    return `Total amount: ${totalInWords}. Advance payment: ${advanceInWords}. Amount due: ${remainingInWords}.`;
  }
};

// Add footer with page number
const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }
};

// Main function to generate the invoice PDF
export const generateInvoicePDF = async (
  invoiceData: InvoiceData,
  locale: string = "fr"
): Promise<jsPDF> => {
  const doc = new jsPDF();
  const currencySymbol = getCurrencySymbol(invoiceData.currency || "TND");
  
  // Add company information
  await addCompanyInfo(doc);
  
  // Add invoice header
  addInvoiceHeader(doc, invoiceData, locale);
  
  // Add client information
  addClientInfo(doc, invoiceData, locale);
  
  // Add product table and get the ending Y position
  const finalY = addProductTable(doc, invoiceData, locale, currencySymbol);
  
  // Add totals section including amount in words
  addTotalsSection(doc, invoiceData, finalY, locale, currencySymbol);
  
  // Add footer with page numbers
  addFooter(doc);
  
  return doc;
};

// Function to download the invoice as PDF
export const downloadInvoiceAsPDF = async (
  invoiceData: InvoiceData,
  locale: string = "fr"
) => {
  const doc = await generateInvoicePDF(invoiceData, locale);
  doc.save(`${invoiceData.numero}.pdf`);
};
