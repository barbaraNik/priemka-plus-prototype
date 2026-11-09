import type { Claim, ChecklistItem, DocType, Source } from '@/types';

export const DOC_LABELS: Record<DocType, string> = {
  defect_photo: 'Фото расхождения',
  label_photo: 'Фото артикула/шильдика',
  invoice: 'Инвойс',
  packing_list: 'Упаковочный лист',
  contract: 'Контракт',
};

const REQUESTABLE_DOCS: Partial<Record<DocType, Source>> = {
  label_photo: 'Склад',
};

export const COMPENSATION_LABEL = 'Пожелания по компенсации';

export function needsCompensation(claim: Claim): boolean {
  return claim.source !== 'Склад';
}

export function buildChecklist(claim: Claim): ChecklistItem[] {
  const items: ChecklistItem[] = claim.documents.map((doc) => ({
    key: doc.type,
    label: DOC_LABELS[doc.type],
    status: doc.status,
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    requestTarget: REQUESTABLE_DOCS[doc.type] ?? null,
    requestedFrom: doc.requestedFrom,
    requestedAt: doc.requestedAt,
    docType: doc.type,
  }));

  if (needsCompensation(claim)) {
    const hasText = claim.compensation.trim().length > 0;
    items.push({
      key: 'compensation',
      label: COMPENSATION_LABEL,
      status: hasText ? 'present' : claim.compensationRequest ? 'requested' : 'missing',
      fileName: null,
      fileUrl: null,
      requestTarget: claim.source,
      requestedFrom: claim.compensationRequest?.from ?? null,
      requestedAt: claim.compensationRequest?.requestedAt ?? null,
      docType: null,
    });
  }

  return items;
}

export interface PacketProgress {
  missingCount: number;
  requestedCount: number;
  canMarkReady: boolean;
}

export function getPacketProgress(claim: Claim): PacketProgress {
  const items = buildChecklist(claim);
  const missingCount = items.filter((item) => item.status === 'missing').length;
  const requestedCount = items.filter((item) => item.status === 'requested').length;
  return {
    missingCount,
    requestedCount,
    canMarkReady: missingCount === 0 && claim.readyAt === null,
  };
}

export type PacketIndicator =
  | { tone: 'ready'; text: string }
  | { tone: 'full'; text: string }
  | { tone: 'waiting'; text: string }
  | { tone: 'missing'; text: string };

export function getPacketIndicator(claim: Claim): PacketIndicator {
  if (claim.readyAt) return { tone: 'ready', text: 'Пакет готов' };
  const { missingCount, requestedCount } = getPacketProgress(claim);
  if (missingCount > 0) return { tone: 'missing', text: `Не хватает: ${missingCount}` };
  if (requestedCount > 0) return { tone: 'waiting', text: 'Ожидает документы' };
  return { tone: 'full', text: 'Пакет полный' };
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}.${month}.${year}`;
}

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
