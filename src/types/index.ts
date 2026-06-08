export type MaterialStatus =
  | 'pending'
  | 'ready'
  | 'partial'
  | 'received'
  | 'shortage'
  | 'suspended';

export type AnomalyType =
  | 'quantity_shortage'
  | 'no_responsible'
  | 'duplicate_name'
  | 'received_zero'
  | 'remark_missing';

export interface Material {
  id: string;
  name: string;
  category: string;
  event: string;
  expectedQty: number;
  actualQty: number;
  group: string;
  responsible: string;
  status: MaterialStatus;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  event: string;
  category: string;
  group: string;
  status: MaterialStatus | '';
  search: string;
  siteCheckMode: boolean;
}

export interface AnomalyInfo {
  type: AnomalyType;
  message: string;
}

export interface MaterialWithAnomalies extends Material {
  anomalies: AnomalyInfo[];
}

export const STATUS_LABELS: Record<MaterialStatus, string> = {
  pending: '待准备',
  ready: '待领取',
  partial: '部分领取',
  received: '已领取',
  shortage: '缺口待补',
  suspended: '暂缓',
};

export const STATUS_COLORS: Record<MaterialStatus, string> = {
  pending: 'bg-muted-100 text-muted-700',
  ready: 'bg-primary-100 text-primary-700',
  partial: 'bg-warning-100 text-warning-700',
  received: 'bg-success-100 text-success-700',
  shortage: 'bg-danger-100 text-danger-700',
  suspended: 'bg-muted-200 text-muted-600',
};
