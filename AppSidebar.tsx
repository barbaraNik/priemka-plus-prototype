import { LayoutList, Package } from 'lucide-react';

export default function AppSidebar() {
  return (
    <aside className="flex flex-col gap-6 border-b border-slate-200 bg-white px-4 py-4 md:fixed md:inset-y-0 md:left-0 md:w-64 md:gap-10 md:border-b-0 md:border-r md:px-5 md:py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Package className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight text-slate-900">Отдел ВЭД</p>
          <p className="text-sm leading-relaxed text-slate-500">Претензии поставщикам</p>
        </div>
      </div>

      <nav aria-label="Основное меню">
        <span
          aria-current="page"
          className="flex h-10 items-center gap-3 rounded-lg bg-blue-50 px-3 text-sm font-medium text-blue-700"
        >
          <LayoutList className="h-4 w-4" aria-hidden="true" />
          Претензии
        </span>
      </nav>
    </aside>
  );
}
