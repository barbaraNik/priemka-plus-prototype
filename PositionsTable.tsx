import type { DefectItem } from '@/types';

interface PositionsTableProps {
  items: DefectItem[];
}

export default function PositionsTable({ items }: PositionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs font-medium text-slate-500">
          <tr>
            <th className="px-5 py-3 font-medium">Артикул</th>
            <th className="px-5 py-3 font-medium">Наименование</th>
            <th className="px-5 py-3 font-medium">Тип расхождения</th>
            <th className="px-5 py-3 text-right font-medium">По документам</th>
            <th className="px-5 py-3 text-right font-medium">Фактически</th>
            <th className="px-5 py-3 font-medium">Ед. изм.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">{item.sku}</td>
              <td className="px-5 py-4 text-slate-700">{item.name}</td>
              <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-sm text-slate-700">
                  {item.defectType}
                </span>
              </td>
              <td className="px-5 py-4 text-right tabular-nums text-slate-700">{item.qtyDocs}</td>
              <td className="px-5 py-4 text-right tabular-nums font-medium text-slate-900">{item.qtyActual}</td>
              <td className="px-5 py-4 text-slate-600">{item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
