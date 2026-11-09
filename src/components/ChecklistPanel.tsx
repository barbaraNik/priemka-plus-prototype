import { useState } from 'react';
import { ExternalLink, FileText, Send, Upload } from 'lucide-react';
import type { ChecklistItem, DocStatus, DocType, Source } from '@/types';
import { formatDate } from '@/lib/checklist';
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from '@/lib/styles';
import DocumentPlaceholderDialog from '@/components/DocumentPlaceholderDialog';

const STATUS_STYLES: Record<DocStatus, { label: string; className: string }> = {
  present: { label: 'Есть', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  missing: { label: 'Нет', className: 'bg-red-50 text-red-700 ring-red-200' },
  requested: { label: 'Запрошено', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
};

const REQUEST_TARGET_GENITIVE: Record<Source, string> = {
  'Склад': 'склада',
  'Продакт-менеджер': 'продакт-менеджера',
  'Сервисная служба': 'сервисной службы',
};

interface ChecklistPanelProps {
  items: ChecklistItem[];
  locked: boolean;
  onUpload: (docType: DocType, file: File) => void;
  onRequest: (docType: DocType | null, target: Source) => void;
}

export default function ChecklistPanel({ items, locked, onUpload, onRequest }: ChecklistPanelProps) {
  const [placeholderItem, setPlaceholderItem] = useState<ChecklistItem | null>(null);

  const openItem = (item: ChecklistItem) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
    } else {
      setPlaceholderItem(item);
    }
  };

  return (
    <>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {items.map((item) => {
          const isMissing = item.status === 'missing';
          const statusStyle = STATUS_STYLES[item.status];
          const docType = item.docType;

          return (
            <li
              key={item.key}
              className={`flex flex-col gap-4 border-l-2 px-5 py-5 transition-colors duration-150 sm:flex-row sm:items-center sm:justify-between ${
                isMissing ? 'border-l-red-500 bg-red-50/50' : 'border-l-transparent'
              }`}
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <ChecklistHint item={item} />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span
                  className={`inline-flex min-w-[6.5rem] justify-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${statusStyle.className}`}
                >
                  {statusStyle.label}
                </span>

                {item.status === 'present' && docType && (
                  <button type="button" onClick={() => openItem(item)} className={SECONDARY_BUTTON_CLASSES}>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Открыть
                  </button>
                )}

                {docType && !locked && (
                  <label className={`${SECONDARY_BUTTON_CLASSES} focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2`}>
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    {item.status === 'present' ? 'Заменить файл' : 'Загрузить файл'}
                    <input
                      type="file"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) onUpload(docType, file);
                        event.target.value = '';
                      }}
                    />
                  </label>
                )}

                {item.requestTarget && isMissing && !locked && (
                  <button
                    type="button"
                    onClick={() => item.requestTarget && onRequest(docType, item.requestTarget)}
                    className={PRIMARY_BUTTON_CLASSES}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Запросить у {REQUEST_TARGET_GENITIVE[item.requestTarget]}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {placeholderItem && (
        <DocumentPlaceholderDialog
          title={placeholderItem.label}
          fileName={placeholderItem.fileName}
          onClose={() => setPlaceholderItem(null)}
        />
      )}
    </>
  );
}

function ChecklistHint({ item }: { item: ChecklistItem }) {
  if (item.status === 'requested' && item.requestedFrom && item.requestedAt) {
    return (
      <p className="text-sm text-slate-500">
        Запрошено у {REQUEST_TARGET_GENITIVE[item.requestedFrom]}, {formatDate(item.requestedAt)}
      </p>
    );
  }
  if (item.status === 'present' && item.fileName) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{item.fileName}</span>
      </p>
    );
  }
  if (item.status === 'present' && item.key === 'compensation') {
    return <p className="text-sm text-slate-500">Описание заполнено ниже</p>;
  }
  if (item.status === 'missing' && item.key === 'compensation') {
    return <p className="text-sm text-slate-500">Заполните поле ниже или запросите у источника</p>;
  }
  return null;
}
