
import { getCurrencySymbol } from "../utils/devisUtils";
import { ProductLine } from "./ProductLineTable";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface DevisPreviewProps {
  productLines: ProductLine[];
  applyTVA: boolean;
  showDiscount: boolean;
  currency: string;
  subtotal: number;
  totalTVA: number;
  totalTTC: number;
  montantTTCEnLettres: string;
}

export function DevisPreview({
  productLines,
  applyTVA,
  showDiscount,
  currency,
  subtotal,
  totalTVA,
  totalTTC,
  montantTTCEnLettres
}: DevisPreviewProps) {
  const currencySymbol = getCurrencySymbol(currency);
  
  // These would come from the company settings in a real implementation
  const companyInfo = {
    name: "Votre Entreprise",
    address: "123 Rue de Paris",
    city: "75001 Paris, France",
    phone: "01 23 45 67 89",
    email: "contact@votreentreprise.fr",
    rib: "12345678901",
    iban: "FR76 1234 5678 9101 1121 3141 5161",
    swift: "BFRPFRPP"
  };

  return (
    <div className="invoice-paper animate-fade-in py-8 px-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="w-52 h-14 bg-invoice-blue-100 flex items-center justify-center rounded">
            <p className="font-bold text-invoice-blue-700">
              VOTRE LOGO
            </p>
          </div>
          <div className="mt-4 text-sm">
            <p className="font-semibold">{companyInfo.name}</p>
            <p>{companyInfo.address}</p>
            <p>{companyInfo.city}</p>
            <p>Tél: {companyInfo.phone}</p>
            <p>Email: {companyInfo.email}</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-invoice-blue-600 mb-2">
            DEVIS
          </h1>
          <div className="text-sm">
            <p>
              <span className="font-medium">№ :</span> DEV2025-005
            </p>
            <p>
              <span className="font-medium">Date d'émission :</span>{" "}
              {new Date().toLocaleDateString("fr-FR")}
            </p>
            <p>
              <span className="font-medium">
                Date d'échéance :
              </span>{" "}
              {new Date(
                new Date().setDate(new Date().getDate() + 30)
              ).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-b py-6 my-8">
        <h2 className="text-sm font-semibold mb-1 text-muted-foreground">
          CLIENT
        </h2>
        <div>
          <p className="font-semibold">Entreprise ABC</p>
          <p>456 Avenue des Clients</p>
          <p>69002 Lyon, France</p>
          <p>Email: contact@abc.fr</p>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-semibold">
                Description
              </th>
              <th className="text-center py-2 font-semibold">
                Quantité
              </th>
              <th className="text-right py-2 font-semibold">
                Prix unitaire
              </th>
              {applyTVA && (
                <th className="text-right py-2 font-semibold">
                  TVA
                </th>
              )}
              {showDiscount && (
                <th className="text-right py-2 font-semibold">
                  Remise (%)
                </th>
              )}
              <th className="text-right py-2 font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {productLines.map((line) => (
              <tr key={line.id} className="border-b">
                <td className="py-3">{line.name}</td>
                <td className="py-3 text-center">
                  {line.quantity}
                </td>
                <td className="py-3 text-right">
                  {line.unitPrice.toLocaleString("fr-FR")} {currencySymbol}
                </td>
                {applyTVA && (
                  <td className="py-3 text-right">
                    {line.estTauxTVA 
                      ? `${line.tva}%` 
                      : `${line.montantTVA.toLocaleString("fr-FR")} ${currencySymbol}`
                    }
                  </td>
                )}
                {showDiscount && (
                  <td className="py-3 text-right">
                    {line.discount}%
                  </td>
                )}
                <td className="py-3 text-right">
                  {line.total.toLocaleString("fr-FR")} {currencySymbol}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span>Sous-total</span>
            <span>{subtotal.toLocaleString("fr-FR")} {currencySymbol}</span>
          </div>
          {applyTVA && (
            <div className="flex justify-between py-1">
              <span>TVA</span>
              <span>{totalTVA.toLocaleString("fr-FR")} {currencySymbol}</span>
            </div>
          )}
          {showDiscount && (
            <div className="flex justify-between py-1">
              <span>Remise globale</span>
              <span>0.00 {currencySymbol}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-t-gray-300 font-bold">
            <span>Total TTC</span>
            <span>{totalTTC.toLocaleString("fr-FR")} {currencySymbol}</span>
          </div>
        </div>
      </div>

      <div className="bg-invoice-blue-50 p-4 rounded-md mb-8">
        <p className="text-sm">
          <span className="font-semibold">
            Montant à payer en toutes lettres: {montantTTCEnLettres}
          </span>
        </p>
      </div>

      {/* Smaller footer with exactly 1cm height (approximately 38px or 0.3937in) */}
      <div className="h-[0.3937in] border-t flex items-center justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
