export type Source = 'Склад' | 'Продакт-менеджер' | 'Сервисная служба';

export type DocType = 'defect_photo' | 'label_photo' | 'invoice' | 'packing_list' | 'contract';

export type DocStatus = 'present' | 'missing' | 'requested';

export type DefectType = 'Недостача' | 'Повреждение' | 'Пересорт' | 'Брак' | 'Недокомплект';

export interface ClaimDocument {
  type: DocType;
  status: DocStatus;
  fileName: string | null;
  fileUrl: string | null;
  requestedFrom: Source | null;
  requestedAt: string | null;
}

export interface CompensationRequest {
  from: Source;
  requestedAt: string;
}

export interface DefectItem {
  id: string;
  sku: string;
  name: string;
  defectType: DefectType;
  qtyDocs: number;
  qtyActual: number;
  unit: string;
}

export interface Claim {
  number: string;
  supplier: string;
  orderNumber: string;
  receivedAt: string;
  source: Source;
  compensation: string;
  compensationRequest: CompensationRequest | null;
  documents: ClaimDocument[];
  items: DefectItem[];
  readyAt: string | null;
}

export interface ChecklistItem {
  key: string;
  label: string;
  status: DocStatus;
  fileName: string | null;
  fileUrl: string | null;
  requestTarget: Source | null;
  requestedFrom: Source | null;
  requestedAt: string | null;
  docType: DocType | null;
}
