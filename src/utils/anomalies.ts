import type { AnomalyCode, Material } from "@/types/material";

export interface AnomalyMap {
  [materialId: string]: AnomalyCode[];
}

// 备注异常关键词：包含这些词的备注会被视为风险信号
const NOTE_KEYWORDS = [
  "缺",
  "缺口",
  "未确认",
  "未到位",
  "未到",
  "未送达",
  "待补",
  "待维修",
  "待确认",
  "丢失",
  "损坏",
  "故障",
  "延迟",
  "延期",
  "推迟",
  "问题",
  "风险",
  "紧急",
  "异常",
  "不足",
  "暂无",
  "??",
  "？？",
  "TBD",
  "tbd",
];

function isNoteAbnormal(note: string): boolean {
  const text = note.trim();
  if (!text) return false;
  return NOTE_KEYWORDS.some((kw) => text.includes(kw));
}

export function detectAnomalies(materials: Material[]): AnomalyMap {
  const result: AnomalyMap = {};

  // duplicate names within same event
  const dupCount = new Map<string, number>();
  for (const m of materials) {
    const key = `${m.event}::${m.name.trim()}`;
    if (!m.name.trim()) continue;
    dupCount.set(key, (dupCount.get(key) ?? 0) + 1);
  }

  for (const m of materials) {
    const flags: AnomalyCode[] = [];
    if (m.actualQty < m.expectedQty) flags.push("shortage_qty");
    if (!m.owner.trim()) flags.push("missing_owner");
    const key = `${m.event}::${m.name.trim()}`;
    if (m.name.trim() && (dupCount.get(key) ?? 0) > 1) flags.push("duplicate_name");
    if (m.status === "picked" && m.actualQty === 0) flags.push("picked_zero");
    if (isNoteAbnormal(m.note)) flags.push("note_abnormal");
    if (flags.length) result[m.id] = flags;
  }

  return result;
}

export function hasAnomaly(map: AnomalyMap, id: string): boolean {
  return !!map[id]?.length;
}
