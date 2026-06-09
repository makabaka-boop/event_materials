export type MaterialStatus =
  | "pending"
  | "to_pickup"
  | "partial_pickedup"
  | "pickedup"
  | "gap_pending"
  | "deferred"

export interface MaterialItem {
  id: string
  name: string
  category: string
  event: string
  expectedQty: number
  actualQty: number
  group: string
  responsible: string
  status: MaterialStatus
  notes: string
  createdAt: number
  updatedAt: number
}

export interface FilterState {
  event: string
  category: string
  group: string
  status: string
  keyword: string
}

export type IssueType = "qty_gap" | "no_responsible" | "duplicate_name" | "pickedup_zero" | "notes_abnormal"

export interface IssueItem {
  type: IssueType
  materialIds: string[]
  message: string
}

export const STATUS_LABELS: Record<MaterialStatus, string> = {
  pending: "待准备",
  to_pickup: "待领取",
  partial_pickedup: "部分领取",
  pickedup: "已领取",
  gap_pending: "缺口待补",
  deferred: "暂缓",
}

export const STATUS_COLORS: Record<MaterialStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  to_pickup: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
  partial_pickedup: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  pickedup: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  gap_pending: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  deferred: { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-400" },
}

export const ISSUE_LABELS: Record<IssueType, string> = {
  qty_gap: "数量缺口",
  no_responsible: "责任人缺失",
  duplicate_name: "名称重复",
  pickedup_zero: "领取异常",
  notes_abnormal: "备注异常",
}

export const ISSUE_ICONS: Record<IssueType, string> = {
  qty_gap: "缺口",
  no_responsible: "缺失",
  duplicate_name: "重复",
  pickedup_zero: "异常",
  notes_abnormal: "备注",
}
