
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StatutFacture } from "@/types";
import { getCurrencySymbol } from "@/components/factures/utils/factureUtils";
import { CompanyInfo } from "@/types/settings";
import { supabase } from "@/integrations/supabase/client";

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
  currency?: string;
}

// Format number with proper formatting (spaces as thousand separator)
const formatNumber = (number: number, locale: string = "fr-FR"): string => {
  return number.toLocaleString(locale, {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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
  
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80); // Dark blue color
  
  if (companyInfo) {
    doc.text(companyInfo.nom, 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    if (companyInfo.adresse) {
      const addressLines = companyInfo.adresse.split(',');
      addressLines.forEach((line, index) => {
        doc.text(line.trim(), 20, 30 + (index * 5));
      });
    }
    
    let yPos = 30 + (companyInfo.adresse ? companyInfo.adresse.split(',').length * 5 : 0);
    
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
    
    // Add logo if available
    if (companyInfo.logo_url) {
      try {
        const img = new Image();
        img.src = companyInfo.logo_url;
        doc.addImage(img, 'JPEG', 140, 10, 40, 20, undefined, 'FAST');
      } catch (error) {
        console.error("Erreur lors de l'ajout du logo:", error);
      }
    }
  } else {
    // Default company info
    doc.text("VOTRE ENTREPRISE", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Rue de Paris", 20, 30);
    doc.text("75001 Paris, France", 20, 35);
    doc.text("Tél: 01 23 45 67 89", 20, 40);
    doc.text("Email: contact@votreentreprise.fr", 20, 45);
  }
};

// Add invoice header with title and info
const addInvoiceHeader = (doc: jsPDF, invoiceData: InvoiceData, locale: string): void => {
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text(locale === "fr" ? "FACTURE" : "INVOICE", 140, 25);
  
  doc.setFontSize(10);
  doc.text(`${locale === "fr" ? "№" : "#"}: ${invoiceData.numero}`, 140, 35);
  doc.text(`${locale === "fr" ? "Date d'émission" : "Date"}: ${formatDate(invoiceData.dateCreation, locale === "fr" ? "fr-FR" : "en-US")}`, 140, 40);
  doc.text(`${locale === "fr" ? "Date d'échéance" : "Due Date"}: ${formatDate(invoiceData.dateEcheance, locale === "fr" ? "fr-FR" : "en-US")}`, 140, 45);
  doc.text(`${locale === "fr" ? "Statut" : "Status"}: ${getStatusLabel(invoiceData.statut, locale)}`, 140, 50);
};

// Add client information to the PDF
const addClientInfo = (doc: jsPDF, invoiceData: InvoiceData, locale: string): void => {
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text(locale === "fr" ? "FACTURER À" : "BILL TO", 20, 60);
  
  doc.setFontSize(10);
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
  
  // Generate table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 90,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  });
  
  // Return the final Y position for subsequent elements
  return (doc as any).lastAutoTable.finalY + 10;
};

// Add totals section to the PDF
const addTotalsSection = (doc: jsPDF, invoiceData: InvoiceData, finalY: number, locale: string, currencySymbol: string): void => {
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
  
  // Total with tax
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(locale === "fr" ? "Total TTC:" : "Total Amount:", 120, finalY + 15);
  doc.text(`${formatNumber(invoiceData.totalTTC)} ${currencySymbol}`, 170, finalY + 15, { align: "right" });
};

// Add footer with payment terms and thank you note
const addFooter = (doc: jsPDF, finalY: number, locale: string): void => {
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 100, 100);
  const footerY = finalY + 30;
  
  doc.text(locale === "fr" ? "Conditions de paiement:" : "Payment Terms:", 20, footerY);
  doc.text(locale === "fr" ? "Payable sous 30 jours." : "Payable within 30 days.", 20, footerY + 5);
  doc.text(locale === "fr" ? "Coordonnées bancaires: IBAN FR76 1234 5678 9101 1121 3141 5161" : 
    "Bank details: IBAN FR76 1234 5678 9101 1121 3141 5161", 20, footerY + 10);
  
  // Thank you note
  doc.text(
    locale === "fr" 
      ? "Merci pour votre confiance. Pour toute question concernant cette facture, veuillez nous contacter."
      : "Thank you for your business. For any questions regarding this invoice, please contact us.",
    20, 
    footerY + 20
  );
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
  
  // Add totals section
  addTotalsSection(doc, invoiceData, finalY, locale, currencySymbol);
  
  // Add footer
  addFooter(doc, finalY, locale);
  
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
