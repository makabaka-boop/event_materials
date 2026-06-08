import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { STATUS_LABELS, STATUS_ORDER, type MaterialStatus } from "@/types/material";

interface ToolbarProps {
  selectedCount: number;
  visibleSelectedCount: number;
  hiddenSelectedCount: number;
  onCreate: () => void;
  onClearSelection: () => void;
  onResetSample: () => void;
  onBulkStatus: (status: MaterialStatus) => void;
  onBulkDelete: () => void;
}

export function Toolbar(props: ToolbarProps) {
  const {
    selectedCount,
    visibleSelectedCount,
    hiddenSelectedCount,
    onCreate,
    onClearSelection,
    onResetSample,
    onBulkStatus,
    onBulkDelete,
  } = props;

  const disabled = visibleSelectedCount === 0;

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="pill-select" style={{ position: "relative" }}>
          <select
            className="toolbar-select"
            disabled={disabled}
            value=""
            onChange={(e) => {
              const v = e.target.value as MaterialStatus | "";
              if (v) onBulkStatus(v);
              e.target.value = "";
            }}
          >
            <option value="" disabled>
              批量标记状态…
            </option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-danger" disabled={disabled} onClick={onBulkDelete}>
          <Trash2 size={14} strokeWidth={1.6} /> 删除所选
        </button>
        <button className="btn" disabled={selectedCount === 0} onClick={onClearSelection}>
          清除勾选 ({selectedCount.toString().padStart(2, "0")})
        </button>
        {hiddenSelectedCount > 0 && (
          <span style={{ fontSize: 12, color: "#6b4c00", fontFamily: "IBM Plex Mono, monospace", letterSpacing: "0.06em" }}>
            含 {hiddenSelectedCount} 条隐藏勾选
          </span>
        )}
      </div>
      <div className="toolbar-right">
        <button className="btn" onClick={onResetSample}>
          <RotateCcw size={14} strokeWidth={1.6} /> 还原示例
        </button>
        <button className="btn btn-primary" onClick={onCreate}>
          <Plus size={14} strokeWidth={2} /> 新增物资
        </button>
      </div>
    </div>
  );
}
