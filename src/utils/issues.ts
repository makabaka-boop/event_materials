import type { MaterialItem, IssueItem, IssueType } from "@/types"

const NOTES_ABNORMAL_KEYWORDS = ["异常", "问题", "缺", "待补", "紧急", "注意", "缺少", "不足", "损坏", "缺失", "遗漏", "错误", "故障"]

export function hasAbnormalNotes(notes: string): boolean {
  if (!notes.trim()) return false
  return NOTES_ABNORMAL_KEYWORDS.some((kw) => notes.includes(kw))
}

export function detectIssues(items: MaterialItem[]): IssueItem[] {
  const issues: IssueItem[] = []

  const qtyGapIds = items
    .filter((item) => item.actualQty < item.expectedQty && item.status !== "deferred")
    .map((item) => item.id)
  if (qtyGapIds.length > 0) {
    issues.push({
      type: "qty_gap",
      materialIds: qtyGapIds,
      message: `${qtyGapIds.length} 条物资实际数量不足`,
    })
  }

  const noResponsibleIds = items
    .filter((item) => !item.responsible.trim() && item.status !== "deferred")
    .map((item) => item.id)
  if (noResponsibleIds.length > 0) {
    issues.push({
      type: "no_responsible",
      materialIds: noResponsibleIds,
      message: `${noResponsibleIds.length} 条物资未指定责任人`,
    })
  }

  const eventGroups: Record<string, MaterialItem[]> = {}
  for (const item of items) {
    const key = `${item.event}::${item.name}`
    if (!eventGroups[key]) eventGroups[key] = []
    eventGroups[key].push(item)
  }
  const duplicateIds: string[] = []
  for (const group of Object.values(eventGroups)) {
    if (group.length > 1) {
      for (const item of group) duplicateIds.push(item.id)
    }
  }
  if (duplicateIds.length > 0) {
    issues.push({
      type: "duplicate_name",
      materialIds: duplicateIds,
      message: `${duplicateIds.length} 条物资在同一活动下名称重复`,
    })
  }

  const pickedupZeroIds = items
    .filter((item) => item.status === "pickedup" && item.actualQty === 0)
    .map((item) => item.id)
  if (pickedupZeroIds.length > 0) {
    issues.push({
      type: "pickedup_zero",
      materialIds: pickedupZeroIds,
      message: `${pickedupZeroIds.length} 条物资已领取但实际数量为 0`,
    })
  }

  const notesAbnormalIds = items
    .filter((item) => hasAbnormalNotes(item.notes))
    .map((item) => item.id)
  if (notesAbnormalIds.length > 0) {
    issues.push({
      type: "notes_abnormal",
      materialIds: notesAbnormalIds,
      message: `${notesAbnormalIds.length} 条物资备注含异常关键词`,
    })
  }

  return issues
}

export function isItemAbnormal(item: MaterialItem, allItems: MaterialItem[]): boolean {
  if (item.actualQty < item.expectedQty && item.status !== "deferred") return true
  if (item.status === "to_pickup") return true
  if (item.status === "gap_pending") return true
  if (!item.responsible.trim() && item.status !== "deferred") return true
  if (item.status === "pickedup" && item.actualQty === 0) return true
  const sameNameCount = allItems.filter(
    (i) => i.event === item.event && i.name === item.name
  ).length
  if (sameNameCount > 1) return true
  if (hasAbnormalNotes(item.notes)) return true
  return false
}

export function getIssueTypesForItem(item: MaterialItem, allItems: MaterialItem[]): IssueType[] {
  const types: IssueType[] = []
  if (item.actualQty < item.expectedQty && item.status !== "deferred") types.push("qty_gap")
  if (!item.responsible.trim() && item.status !== "deferred") types.push("no_responsible")
  const sameNameCount = allItems.filter(
    (i) => i.event === item.event && i.name === item.name
  ).length
  if (sameNameCount > 1) types.push("duplicate_name")
  if (item.status === "pickedup" && item.actualQty === 0) types.push("pickedup_zero")
  if (hasAbnormalNotes(item.notes)) types.push("notes_abnormal")
  return types
}
