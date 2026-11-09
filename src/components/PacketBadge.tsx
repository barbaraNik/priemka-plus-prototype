import { AlertTriangle, CheckCircle2, Clock, Hourglass } from 'lucide-react';
import type { PacketIndicator } from '@/lib/checklist';

const TONE_CLASSES: Record<PacketIndicator['tone'], string> = {
  full: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  waiting: 'bg-amber-50 text-amber-700 ring-amber-200',
  missing: 'bg-red-50 text-red-700 ring-red-200',
  ready: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const TONE_ICONS = {
  full: CheckCircle2,
  waiting: Hourglass,
  missing: AlertTriangle,
  ready: Clock,
} as const;

interface PacketBadgeProps {
  indicator: PacketIndicator;
}

export default function PacketBadge({ indicator }: PacketBadgeProps) {
  const Icon = TONE_ICONS[indicator.tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${TONE_CLASSES[indicator.tone]}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {indicator.text}
    </span>
  );
}
