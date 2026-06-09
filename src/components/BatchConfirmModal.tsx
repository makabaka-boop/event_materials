import { AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';

export function BatchConfirmModal() {
  const { confirmBatch, batchUpdate, closeBatchConfirm, clearSelection } =
    useMaterialStore();
  const { open, targetIds, hiddenCount, update } = confirmBatch;

  if (!open || !update) return null;

  const describe = () => {
    const parts: string[] = [];
    if (update.status) parts.push(`状态改为「${update.status}」`);
    if (update.group !== undefined)
      parts.push(update.group ? `分配到小组「${update.group}」` : '清空小组');
    if (update.owner) parts.push(`责任人设为「${update.owner}」`);
    return parts.join('，');
  };

  const handleConfirm = () => {
    batchUpdate(targetIds, update);
    closeBatchConfirm();
    clearSelection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            确认批量操作
          </h3>
          <button
            onClick={closeBatchConfirm}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-slate-700 leading-relaxed">
            本次操作将对当前视图中 <strong className="text-ink-800 text-base">{targetIds.length}</strong> 条选中记录执行：
          </p>
          <div className="bg-ink-50 border border-ink-100 rounded-lg px-4 py-3 text-sm text-ink-800 font-medium">
            {describe()}
          </div>
          {hiddenCount > 0 && (
            <div className="flex items-start gap-2 bg-jade-50 border border-jade-200 rounded-lg px-4 py-3 text-sm text-jade-800">
              <ShieldCheck size={15} className="flex-shrink-0 mt-0.5 text-jade-600" />
              <span>
                另有 <strong>{hiddenCount}</strong> 条选中项因当前筛选条件被隐藏，为防止误操作，它们<strong>不会被本次操作影响</strong>。如需操作它们，请先取消筛选。
              </span>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button onClick={closeBatchConfirm} className="btn-secondary">
            取消
          </button>
          <button onClick={handleConfirm} className="btn-primary">
            确认执行
          </button>
        </div>
      </div>
    </div>
  );
}
