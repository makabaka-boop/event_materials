export type MaterialStatus =
  | "pending"
  | "to_pick"
  | "partial"
  | "picked"
  | "shortage"
  | "hold";

export interface Material {
  id: string;
  name: string;
  category: string;
  event: string;
  expectedQty: number;
  actualQty: number;
  group: string;
  owner: string;
  status: MaterialStatus;
  note: string;
  updatedAt: number;
}

export const STATUS_LABELS: Record<MaterialStatus, string> = {
  pending: "待准备",
  to_pick: "待领取",
  partial: "部分领取",
  picked: "已领取",
  shortage: "缺口待补",
  hold: "暂缓",
};

export const STATUS_ORDER: MaterialStatus[] = [
  "pending",
  "to_pick",
  "partial",
  "picked",
  "shortage",
  "hold",
];

export type AnomalyCode =
  | "shortage_qty"
  | "missing_owner"
  | "duplicate_name"
  | "picked_zero"
  | "note_abnormal";

export const ANOMALY_LABELS: Record<AnomalyCode, string> = {
  shortage_qty: "实际数量低于预计",
  missing_owner: "责任人缺失",
  duplicate_name: "同活动下名称重复",
  picked_zero: "已领取 / 实际数量 0",
  note_abnormal: "备注存在异常关键词",
};
