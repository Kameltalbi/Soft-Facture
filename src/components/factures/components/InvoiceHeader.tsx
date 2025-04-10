
import { formatDate } from "@/utils/formatters";

interface InvoiceHeaderProps {
  clientName: string;
}

export function InvoiceHeader({ clientName }: InvoiceHeaderProps) {
  // Génère un numéro de facture
  const invoiceNumber = "FAC2025-001";
  
  // Dates de la facture
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-2">FACTURE</h1>
          <p className="text-sm text-gray-600">
            <span className="font-medium">N° de facture:</span> {invoiceNumber}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Date:</span> {formatDate(today)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Échéance:</span> {formatDate(dueDate)}
          </p>
        </div>
        
        <div className="max-w-xs">
          <h2 className="text-sm font-bold text-gray-600 mb-2">FACTURER À</h2>
          <div className="text-sm">
            <p className="font-medium">{clientName}</p>
            <p>456 Avenue des Clients</p>
            <p>69002 Lyon, France</p>
            <p>contact@client.fr</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 py-2 border-t border-b">
        <div className="text-sm">
          <p className="font-medium">VOTRE ENTREPRISE</p>
          <p>123 Rue de Paris, 75001 Paris, France</p>
          <p>Tél: 01 23 45 67 89 | Email: contact@votreentreprise.fr</p>
          <p>SIRET: 123 456 789 00012 | TVA: FR 12 345 678 900</p>
        </div>
      </div>
    </div>
  );
}
