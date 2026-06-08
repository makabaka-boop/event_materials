export type Status =
  | '待准备'
  | '待领取'
  | '部分领取'
  | '已领取'
  | '缺口待补'
  | '暂缓';

export const STATUS_LIST: Status[] = [
  '待准备',
  '待领取',
  '部分领取',
  '已领取',
  '缺口待补',
  '暂缓',
];

export const DEFAULT_CATEGORIES = [
  '宣传品',
  '餐饮',
  '设备',
  '礼品',
  '文具',
  '服装',
  '其他',
];

export interface Material {
  id: string;
  name: string;
  category: string;
  activity: string;
  expectedQty: number;
  actualQty: number;
  group: string;
  owner: string;
  status: Status;
  remark: string;
  createdAt: number;
  updatedAt: number;
}

export interface FilterState {
  activity: string;
  group: string;
  status: Status[];
  keyword: string;
  onsiteMode: boolean;
}

export interface ValidationIssue {
  type:
    | 'qty_gap'
    | 'no_owner'
    | 'duplicate_name'
    | 'claimed_zero'
    | 'remark_flag';
  message: string;
  level: 'warning' | 'error';
}

export const STORAGE_KEY = 'event-materials-v1';

export const STATUS_STYLE: Record<
  Status,
  { bg: string; text: string; dot: string }
> = {
  待准备: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  待领取: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  部分领取: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  已领取: { bg: 'bg-jade-50', text: 'text-jade-700', dot: 'bg-jade-500' },
  缺口待补: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-brick-500' },
  暂缓: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
  },
};
