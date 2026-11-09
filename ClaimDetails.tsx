import { ArrowLeft, Check, Send } from 'lucide-react';
import type { Claim, DocType, Source } from '@/types';
import { buildChecklist, formatDate, getPacketIndicator, getPacketProgress, needsCompensation } from '@/lib/checklist';
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from '@/lib/styles';
import PacketBadge from '@/components/PacketBadge';
import PositionsTable from '@/components/PositionsTable';
import ChecklistPanel from '@/components/ChecklistPanel';

interface ClaimDetailsProps {
  claim: Claim;
  onBack: () => void;
  onUpload: (docType: DocType, file: File) => void;
  onRequest: (docType: DocType | null, target: Source) => void;
  onCompensationChange: (text: string) => void;
  onMarkReady: () => void;
}

export default function ClaimDetails({
  claim,
  onBack,
  onUpload,
  onRequest,
  onCompensationChange,
  onMarkReady,
}: ClaimDetailsProps) {
  const checklist = buildChecklist(claim);
  const progress = getPacketProgress(claim);
  const locked = claim.readyAt !== null;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-36 pt-6 sm:px-8 sm:pt-10">
      <button
        type="button"
        onClick={onBack}
        className={`${SECONDARY_BUTTON_CLASSES} mb-8 border-transparent bg-transparent px-2 text-slate-600 hover:border-transparent hover:bg-slate-100 hover:text-slate-900`}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Назад к ленте
      </button>

      <section className="mb-12 rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Претензия</p>
            <h1 className="text-2xl font-semibold leading-tight text-slate-900">{claim.number}</h1>
          </div>
          <PacketBadge indicator={getPacketIndicator(claim)} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetaField label="Поставщик" value={claim.supplier} />
          <MetaField label="Номер заказа" value={claim.orderNumber} />
          <MetaField label="Дата приёмки" value={formatDate(claim.receivedAt)} />
          <MetaField label="Источник" value={claim.source} />
        </dl>
      </section>

      <div className="space-y-12">
        <section className="space-y-4">
          <SectionTitle title="Позиции с расхождениями" />
          <PositionsTable items={claim.items} />
        </section>

        <section className="space-y-4">
          <SectionTitle
            title="Чек-лист пакета документов"
            hint="Загрузите недостающие файлы или запросите их у коллег"
          />
          <ChecklistPanel items={checklist} locked={locked} onUpload={onUpload} onRequest={onRequest} />
        </section>

        {needsCompensation(claim) && (
          <section className="space-y-4">
            <SectionTitle title="Пожелания по компенсации" />
            <textarea
              value={claim.compensation}
              onChange={(event) => onCompensationChange(event.target.value)}
              rows={4}
              disabled={locked}
              placeholder="Опишите, какую компенсацию ожидаете от поставщика"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
          </section>
        )}
      </div>

      <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white md:left-64">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <ReadyHint readyAt={claim.readyAt} canMarkReady={progress.canMarkReady} missingCount={progress.missingCount} />
          <button type="button" onClick={onMarkReady} disabled={!progress.canMarkReady} className={PRIMARY_BUTTON_CLASSES}>
            {claim.readyAt ? <Check className="h-4 w-4" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            Пакет готов
          </button>
        </div>
      </footer>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

function ReadyHint({
  readyAt,
  canMarkReady,
  missingCount,
}: {
  readyAt: string | null;
  canMarkReady: boolean;
  missingCount: number;
}) {
  if (readyAt) {
    return <p className="text-sm text-slate-600">Пакет отмечен готовым {formatDate(readyAt)}</p>;
  }
  if (canMarkReady) {
    return <p className="text-sm text-slate-600">Все пункты закрыты: есть или запрошены</p>;
  }
  return <p className="text-sm font-medium text-red-700">Осталось пунктов со статусом «Нет»: {missingCount}</p>;
}
