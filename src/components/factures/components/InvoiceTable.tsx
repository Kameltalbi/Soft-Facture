
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
          <tr className="bg-gray-700 text-white">
            <th className="text-left py-3 px-4 font-semibold">
              Description
            </th>
            <th className="text-center py-3 px-4 font-semibold">
              Qté
            </th>
            <th className="text-right py-3 px-4 font-semibold">
              Prix unitaire
            </th>
            {applyTVA && (
              <th className="text-right py-3 px-4 font-semibold">
                TVA
              </th>
            )}
            {showDiscount && (
              <th className="text-right py-3 px-4 font-semibold">
                Remise (%)
              </th>
            )}
            <th className="text-right py-3 px-4 font-semibold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {productLines.map((line, index) => (
            <tr key={line.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="py-3 px-4 border-b">{line.name}</td>
              <td className="py-3 px-4 text-center border-b">
                {line.quantity}
              </td>
              <td className="py-3 px-4 text-right border-b">
                {formatNumber(line.unitPrice)} {currencySymbol}
              </td>
              {applyTVA && (
                <td className="py-3 px-4 text-right border-b">
                  {line.estTauxTVA 
                    ? `${line.tva}%` 
                    : `${formatNumber(line.montantTVA)} ${currencySymbol}`
                  }
                </td>
              )}
              {showDiscount && (
                <td className="py-3 px-4 text-right border-b">
                  {line.discount}%
                </td>
              )}
              <td className="py-3 px-4 text-right border-b">
                {formatNumber(line.total)} {currencySymbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
