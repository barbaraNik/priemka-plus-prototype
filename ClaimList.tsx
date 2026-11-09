import { ChevronRight, Package } from 'lucide-react';
import type { Claim } from '@/types';
import { formatDate, getPacketIndicator } from '@/lib/checklist';
import PacketBadge from '@/components/PacketBadge';

interface ClaimListProps {
  claims: Claim[];
  onOpen: (number: string) => void;
}

export default function ClaimList({ claims, onOpen }: ClaimListProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-12">
      <header className="mb-10 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Package className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold leading-tight text-slate-900">Претензии к поставщикам</h1>
          <p className="text-sm leading-relaxed text-slate-500">
            {claims.length} {pluralize(claims.length, ['претензия', 'претензии', 'претензий'])} в работе
          </p>
        </div>
      </header>

      <ul className="space-y-3">
        {claims.map((claim) => (
          <li key={claim.number}>
            <button
              type="button"
              onClick={() => onOpen(claim.number)}
              className="group flex w-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 text-left transition-colors duration-150 hover:border-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-base font-semibold text-slate-900">{claim.number}</span>
                  <span className="text-sm text-slate-500">{claim.source}</span>
                </div>
                <p className="truncate text-sm text-slate-700">{claim.supplier}</p>
                <p className="text-sm text-slate-500">
                  Заказ {claim.orderNumber} · приёмка {formatDate(claim.receivedAt)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <PacketBadge indicator={getPacketIndicator(claim)} />
                <ChevronRight
                  className="h-5 w-5 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function pluralize(count: number, forms: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}
