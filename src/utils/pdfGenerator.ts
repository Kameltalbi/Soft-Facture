
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { StatutFacture } from "@/types";

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

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string = "TND"): string => {
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

export const generateInvoicePDF = (
  invoiceData: InvoiceData,
  locale: string = "fr"
): jsPDF => {
  const doc = new jsPDF();
  const currencySymbol = getCurrencySymbol(invoiceData.currency);
  
  // Company info (header)
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80); // Dark blue color
  doc.text("VOTRE ENTREPRISE", 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("123 Rue de Paris", 20, 30);
  doc.text("75001 Paris, France", 20, 35);
  doc.text("Tél: 01 23 45 67 89", 20, 40);
  doc.text("Email: contact@votreentreprise.fr", 20, 45);
  
  // Invoice title and info
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80);
  doc.text(locale === "fr" ? "FACTURE" : "INVOICE", 140, 25);
  
  doc.setFontSize(10);
  doc.text(`${locale === "fr" ? "№" : "#"}: ${invoiceData.numero}`, 140, 35);
  doc.text(`${locale === "fr" ? "Date d'émission" : "Date"}: ${formatDate(invoiceData.dateCreation, locale === "fr" ? "fr-FR" : "en-US")}`, 140, 40);
  doc.text(`${locale === "fr" ? "Date d'échéance" : "Due Date"}: ${formatDate(invoiceData.dateEcheance, locale === "fr" ? "fr-FR" : "en-US")}`, 140, 45);
  doc.text(`${locale === "fr" ? "Statut" : "Status"}: ${getStatusLabel(invoiceData.statut, locale)}`, 140, 50);
  
  // Client info
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
  
  // Invoice contents
  const headers = [
    locale === "fr" ? "Description" : "Description",
    locale === "fr" ? "Qté" : "Qty",
    locale === "fr" ? "Prix unitaire" : "Unit Price",
    ...(invoiceData.applyTVA ? [locale === "fr" ? "TVA" : "Tax"] : []),
    ...(invoiceData.showDiscount ? [locale === "fr" ? "Remise" : "Discount"] : []),
    locale === "fr" ? "Total" : "Total",
  ];
  
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
  
  const data = products.map((product) => {
    const row = [
      product.name,
      product.quantity.toString(),
      `${product.unitPrice.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} ${currencySymbol}`,
    ];
    
    if (invoiceData.applyTVA) {
      if (product.estTauxTVA) {
        row.push(`${product.tva}%`);
      } else {
        row.push(`${product.montantTVA?.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} ${currencySymbol}`);
      }
    }
    
    if (invoiceData.showDiscount) {
      row.push(`${product.discount}%`);
    }
    
    row.push(`${product.total.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} ${currencySymbol}`);
    
    return row;
  });
  
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
  
  // Calculate totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Totals
  doc.setFontSize(10);
  doc.text(locale === "fr" ? "Sous-total:" : "Subtotal:", 140, finalY);
  doc.text(`${invoiceData.totalTTC.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} ${currencySymbol}`, 170, finalY, { align: "right" });
  
  // Tax total if applicable
  if (invoiceData.applyTVA) {
    doc.text(locale === "fr" ? "TVA:" : "Tax:", 140, finalY + 7);
    // Demo tax calculation (20%)
    const tax = invoiceData.totalTTC * 0.2;
    doc.text(`${tax.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} ${currencySymbol}`, 170, finalY + 7, { align: "right" });
  }
  
  // Total with tax
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(locale === "fr" ? "Total TTC:" : "Total Amount:", 140, finalY + 15);
  doc.text(`${invoiceData.totalTTC.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} ${currencySymbol}`, 170, finalY + 15, { align: "right" });
  
  // Footer
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
  
  return doc;
};

export const downloadInvoiceAsPDF = (
  invoiceData: InvoiceData,
  locale: string = "fr"
) => {
  const doc = generateInvoicePDF(invoiceData, locale);
  doc.save(`${invoiceData.numero}.pdf`);
};
