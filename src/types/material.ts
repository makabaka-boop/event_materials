export type MaterialStatus =
  | 'pending'
  | 'to_collect'
  | 'partially_collected'
  | 'collected'
  | 'shortage'
  | 'suspended';

export const STATUS_LABELS: Record<MaterialStatus, string> = {
  pending: '待准备',
  to_collect: '待领取',
  partially_collected: '部分领取',
  collected: '已领取',
  shortage: '缺口待补',
  suspended: '暂缓',
};

export const STATUS_COLORS: Record<MaterialStatus, string> = {
  pending: '#9ca3af',
  to_collect: '#3b82f6',
  partially_collected: '#f59e0b',
  collected: '#10b981',
  shortage: '#ef4444',
  suspended: '#6b7280',
};

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
  createdAt: number;
  updatedAt: number;
}

export interface FilterState {
  keyword: string;
  event: string;
  group: string;
  status: MaterialStatus | '';
  category: string;
  siteCheckMode: boolean;
}

export interface MaterialIssue {
  type: 'shortage' | 'no_responsible' | 'duplicate_name' | 'collected_zero';
  message: string;
}
