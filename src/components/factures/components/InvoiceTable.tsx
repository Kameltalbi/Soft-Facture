
import { formatNumber } from "@/utils/formatters";

interface InvoiceTableProps {
  productLines: any[];
  applyTVA: boolean;
  showDiscount: boolean;
  currencySymbol: string;
}

export function InvoiceTable({
  productLines,
  applyTVA,
  showDiscount,
  currencySymbol
}: InvoiceTableProps) {
  return (
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
                {formatNumber(line.unitPrice)} {currencySymbol}
              </td>
              {applyTVA && (
                <td className="py-3 text-right">
                  {line.estTauxTVA 
                    ? `${line.tva}%` 
                    : `${formatNumber(line.montantTVA)} ${currencySymbol}`
                  }
                </td>
              )}
              {showDiscount && (
                <td className="py-3 text-right">
                  {line.discount}%
                </td>
              )}
              <td className="py-3 text-right">
                {formatNumber(line.total)} {currencySymbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
