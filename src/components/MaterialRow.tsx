import { Pencil, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  ANOMALY_LABELS,
  STATUS_LABELS,
  type Material,
  type AnomalyCode,
} from "@/types/material";

interface MaterialRowProps {
  material: Material;
  selected: boolean;
  onToggleSelect: () => void;
  onOpenDetail: () => void;
  onCycleStatus: () => void;
  anomalies: AnomalyCode[];
  inspectionMode: boolean;
  onQuickPicked: () => void;
  onQuickShortage: () => void;
}

export function MaterialRow(props: MaterialRowProps) {
  const {
    material: m,
    selected,
    onToggleSelect,
    onOpenDetail,
    onCycleStatus,
    anomalies,
    inspectionMode,
    onQuickPicked,
    onQuickShortage,
  } = props;

  const hasAnomaly = anomalies.length > 0;
  const isShort = m.actualQty < m.expectedQty;

  return (
    <div
      className={
        "row" + (selected ? " is-selected" : "") + (hasAnomaly ? " has-anomaly" : "")
      }
      data-status={m.status}
    >
      <label className="row-check">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          aria-label="勾选物资"
        />
      </label>
      <div className="status-bar" />
      <div className="row-body">
        <div className="row-main">
          <h3 className="row-name" onClick={onOpenDetail}>
            {m.name || <span style={{ fontStyle: "italic", opacity: 0.6 }}>未命名物资</span>}
          </h3>
          <div className="row-meta">
            <span>{m.event || "未指定活动"}</span>
            <span className="dot">·</span>
            <span>{m.category || "未分类"}</span>
            <span className="dot">·</span>
            <span>编号 {m.id.slice(-6).toUpperCase()}</span>
          </div>
          {m.note && <p className="row-note">{m.note}</p>}
          {hasAnomaly && (
            <div className="row-anomalies">
              {anomalies.map((a) => (
                <span key={a} className="anomaly-tag">
                  <AlertTriangle size={10} strokeWidth={2} style={{ marginRight: 4, verticalAlign: -1 }} />
                  {ANOMALY_LABELS[a]}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="row-people">
          <div className="row-people-line">
            <span className="label">小组</span>
            <span className="value">{m.group || "—"}</span>
          </div>
          <div className="row-people-line">
            <span className="label">责任人</span>
            <span className={"value" + (!m.owner ? " is-empty" : "")}>
              {m.owner || "未指派"}
            </span>
          </div>
          <button className="status-chip" data-status={m.status} onClick={onCycleStatus}>
            {STATUS_LABELS[m.status]}
          </button>
        </div>

        <div className="row-numbers">
          <div className={"qty-stack" + (isShort ? " is-short" : "")}>
            <div className="planned">
              计划 / <span className="planned-num">{m.expectedQty}</span>
            </div>
            <div className="actual">{m.actualQty}</div>
          </div>
          <div className="qty-divider" />
          <div className="qty-stack">
            <div className="planned">缺口</div>
            <div className="actual" style={{ color: isShort ? "var(--alert)" : "var(--ink)" }}>
              {Math.max(m.expectedQty - m.actualQty, 0)}
            </div>
          </div>
        </div>

        {inspectionMode && (
          <div className="inspection-actions">
            <button className="btn btn-primary" onClick={onQuickPicked}>
              <CheckCircle2 size={13} strokeWidth={1.8} /> 标记已领取
            </button>
            <button className="btn btn-danger" onClick={onQuickShortage}>
              <AlertTriangle size={13} strokeWidth={1.8} /> 记缺口待补
            </button>
          </div>
        )}
      </div>
      <div className="row-actions">
        <button className="icon-btn" title="编辑详情" onClick={onOpenDetail}>
          <Pencil size={13} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}
