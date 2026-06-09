import { AlertTriangle, Eye, X } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';

interface Props {
  hiddenCount: number;
  visibleSelectedCount: number;
  visibleIds: string[];
}

export function SelectionBanner({ hiddenCount, visibleSelectedCount, visibleIds }: Props) {
  const clearHidden = useMaterialStore((s) => s.clearHiddenSelection);
  const setFilter = useMaterialStore((s) => s.setFilter);

  if (hiddenCount <= 0) return null;

  return (
    <div className="animate-slide-down bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 text-amber-800">
        <AlertTriangle size={16} className="flex-shrink-0 text-amber-600" />
        <span className="text-sm">
          当前筛选结果外还有 <strong className="font-semibold">{hiddenCount}</strong> 条已选中记录，批量操作仅会修改可见的{' '}
          <strong className="font-semibold">{visibleSelectedCount}</strong> 条，隐藏项不受影响
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 rounded-md transition-colors"
          onClick={() => setFilter({ activity: '', group: '', status: [], keyword: '' })}
        >
          <Eye size={13} />
          取消筛选查看全部
        </button>
        <button
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 rounded-md transition-colors"
          onClick={() => clearHidden(visibleIds)}
        >
          <X size={13} />
          取消隐藏项选中
        </button>
      </div>
    </div>
  );
}
