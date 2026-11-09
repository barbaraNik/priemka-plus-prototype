import { FileText, X } from 'lucide-react';
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from '@/lib/styles';

interface DocumentPlaceholderDialogProps {
  title: string;
  fileName: string | null;
  onClose: () => void;
}

export default function DocumentPlaceholderDialog({ title, fileName, onClose }: DocumentPlaceholderDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-placeholder-title"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <h2 id="document-placeholder-title" className="mt-5 text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {fileName && <p className="mt-1 break-words text-sm text-slate-500">{fileName}</p>}
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          В тестовых данных файл не прикреплён: этот документ показан заглушкой. Загруженные вами файлы открываются
          в отдельном окне.
        </p>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className={PRIMARY_BUTTON_CLASSES}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
