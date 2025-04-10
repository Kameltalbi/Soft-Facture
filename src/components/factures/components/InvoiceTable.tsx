
import { formatNumber } from "@/utils/formatters";

interface InvoiceTableProps {
  productLines: any[];
  applyTVA: boolean;
  currency: string;
}

export function InvoiceTable({ productLines, applyTVA, currency }: InvoiceTableProps) {
  return (
    <div className="mt-6 mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left font-medium">Désignation</th>
            <th className="px-4 py-2 text-center font-medium">Qté</th>
            <th className="px-4 py-2 text-right font-medium">Prix unitaire</th>
            {applyTVA && <th className="px-4 py-2 text-right font-medium">TVA</th>}
            <th className="px-4 py-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {productLines.map((line, index) => (
            <tr key={line.id || index} className="border-b">
              <td className="px-4 py-3">{line.name}</td>
              <td className="px-4 py-3 text-center">{line.quantity}</td>
              <td className="px-4 py-3 text-right">{formatNumber(line.unitPrice)} {currency}</td>
              {applyTVA && (
                <td className="px-4 py-3 text-right">
                  {line.estTauxTVA
                    ? `${line.tva}%`
                    : `${formatNumber(line.montantTVA)} ${currency}`}
                </td>
              )}
              <td className="px-4 py-3 text-right">{formatNumber(line.total)} {currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
