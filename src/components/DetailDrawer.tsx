import { useEffect, useState } from "react";
import { X, Save, Trash2, AlertTriangle } from "lucide-react";
import {
  ANOMALY_LABELS,
  STATUS_LABELS,
  STATUS_ORDER,
  type AnomalyCode,
  type Material,
  type MaterialStatus,
} from "@/types/material";

interface DetailDrawerProps {
  material: Material | null;
  isNew: boolean;
  anomalies: AnomalyCode[];
  onClose: () => void;
  onSave: (patch: Partial<Material>) => void;
  onDelete: () => void;
}

interface FormState {
  name: string;
  category: string;
  event: string;
  expectedQty: string;
  actualQty: string;
  group: string;
  owner: string;
  status: MaterialStatus;
  note: string;
}

function toForm(m: Material): FormState {
  return {
    name: m.name,
    category: m.category,
    event: m.event,
    expectedQty: String(m.expectedQty ?? 0),
    actualQty: String(m.actualQty ?? 0),
    group: m.group,
    owner: m.owner,
    status: m.status,
    note: m.note,
  };
}

export function DetailDrawer(props: DetailDrawerProps) {
  const { material, isNew, anomalies, onClose, onSave, onDelete } = props;
  const [form, setForm] = useState<FormState | null>(null);

  useEffect(() => {
    if (material) setForm(toForm(material));
    else setForm(null);
  }, [material]);

  if (!material || !form) return null;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const handleSave = () => {
    onSave({
      name: form.name.trim(),
      category: form.category.trim(),
      event: form.event.trim(),
      expectedQty: Math.max(0, Number(form.expectedQty) || 0),
      actualQty: Math.max(0, Number(form.actualQty) || 0),
      group: form.group.trim(),
      owner: form.owner.trim(),
      status: form.status,
      note: form.note,
    });
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="物资详情">
        <div className="drawer-head">
          <div>
            <div className="eyebrow">{isNew ? "新建物资" : "物资详情"}</div>
            <h2>{form.name || "未命名物资"}</h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="关闭">
            <X size={16} strokeWidth={1.6} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="field">
            <label className="field-label">物资名称</label>
            <input
              className="field-input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="例如：嘉宾胸花"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label">分类</label>
              <input
                className="field-input"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="礼仪物料 / 音视频…"
              />
            </div>
            <div className="field">
              <label className="field-label">所属活动</label>
              <input
                className="field-input"
                value={form.event}
                onChange={(e) => update("event", e.target.value)}
                placeholder="例如：校友返校日"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label">预计数量</label>
              <input
                className="field-input"
                type="number"
                min={0}
                value={form.expectedQty}
                onChange={(e) => update("expectedQty", e.target.value)}
              />
            </div>
            <div className="field">
              <label className="field-label">实际数量</label>
              <input
                className="field-input"
                type="number"
                min={0}
                value={form.actualQty}
                onChange={(e) => update("actualQty", e.target.value)}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label">领取小组</label>
              <input
                className="field-input"
                value={form.group}
                onChange={(e) => update("group", e.target.value)}
                placeholder="布置组 / 礼仪组…"
              />
            </div>
            <div className="field">
              <label className="field-label">责任人</label>
              <input
                className="field-input"
                value={form.owner}
                onChange={(e) => update("owner", e.target.value)}
                placeholder="姓名"
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">状态</label>
            <select
              className="field-select"
              value={form.status}
              onChange={(e) => update("status", e.target.value as MaterialStatus)}
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label">备注</label>
            <textarea
              className="field-textarea"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="位置、注意事项、备用方案…"
            />
          </div>

          {anomalies.length > 0 && (
            <div className="drawer-anomalies">
              <h4>
                <AlertTriangle size={12} strokeWidth={2} style={{ verticalAlign: -1, marginRight: 4 }} />
                异常告警
              </h4>
              <ul>
                {anomalies.map((code) => (
                  <li key={code}>{ANOMALY_LABELS[code]}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="drawer-foot">
          <span className="meta">
            最近更新 ·
            {" "}
            {new Date(material.updatedAt).toLocaleString("zh-CN", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {!isNew && (
              <button className="btn btn-danger" onClick={onDelete}>
                <Trash2 size={13} strokeWidth={1.6} /> 删除
              </button>
            )}
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={13} strokeWidth={1.8} /> 保存
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
