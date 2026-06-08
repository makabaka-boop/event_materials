import { useState } from 'react';
import { X, CheckCircle2, Users, User, ChevronDown } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LIST, Status } from '../types';
import { getUniqueValues } from '../utils/filters';

interface Props {
  visibleIds: string[];
  hiddenCount: number;
}

export function BatchActionBar({ visibleIds, hiddenCount }: Props) {
  const { materials, selectedIds, clearSelection, openBatchConfirm } =
    useMaterialStore();
  const [statusOpen, setStatusOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [ownerInput, setOwnerInput] = useState('');

  const groups = getUniqueValues(materials, 'group');
  const visibleSelectedIds = visibleIds.filter((id) => selectedIds.has(id));
  const visibleSelectedCount = visibleSelectedIds.length;

  if (selectedIds.size === 0) return null;

  const handleStatusSet = (status: Status) => {
    setStatusOpen(false);
    openBatchConfirm(visibleSelectedIds, hiddenCount, { status });
  };

  const handleGroupSet = (group: string) => {
    setGroupOpen(false);
    openBatchConfirm(visibleSelectedIds, hiddenCount, { group });
  };

  const handleOwnerSet = () => {
    if (!ownerInput.trim()) return;
    openBatchConfirm(visibleSelectedIds, hiddenCount, { owner: ownerInput.trim() });
    setOwnerInput('');
  };

  return (
    <div className="animate-slide-down bg-ink-800 text-white px-6 py-2.5 flex items-center justify-between gap-4 shadow-md">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={16} className="text-jade-500" />
        <span className="text-sm font-medium">
          已选 <strong className="text-amber-400">{selectedIds.size}</strong> 条
          {hiddenCount > 0 ? (
            <span className="text-amber-400/80 ml-1.5 text-xs">
              （{hiddenCount} 条已被筛选隐藏，不受本次操作影响）
            </span>
          ) : null}
          {visibleSelectedCount === 0 && selectedIds.size > 0 && (
            <span className="text-brick-400 ml-1.5 text-xs">
              当前视图中无选中项
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <button
            disabled={visibleSelectedCount === 0}
            onClick={() => {
              setStatusOpen(!statusOpen);
              setGroupOpen(false);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-md text-sm transition-colors"
          >
            批量改状态
            <ChevronDown size={13} />
          </button>
          {statusOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px] z-20 animate-scale-in">
              {STATUS_LIST.map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusSet(st)}
                  className="block w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            disabled={visibleSelectedCount === 0}
            onClick={() => {
              setGroupOpen(!groupOpen);
              setStatusOpen(false);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-md text-sm transition-colors"
          >
            <Users size={13} />
            分配小组
            <ChevronDown size={13} />
          </button>
          {groupOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px] z-20 animate-scale-in">
              <button
                onClick={() => handleGroupSet('')}
                className="block w-full text-left px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-50 italic"
              >
                清空小组
              </button>
              {groups.map((g) => (
                <button
                  key={g}
                  onClick={() => handleGroupSet(g)}
                  className="block w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {g}
                </button>
              ))}
              <div className="px-3 py-1.5 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="输入新小组名..."
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-ink-800"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleGroupSet(e.currentTarget.value.trim());
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white/10 rounded-md px-2 py-1">
          <User size={13} />
          <input
            type="text"
            placeholder="设置责任人..."
            value={ownerInput}
            onChange={(e) => setOwnerInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && visibleSelectedCount > 0 && handleOwnerSet()}
            className="bg-transparent text-white placeholder-slate-400 text-sm w-24 focus:outline-none"
          />
          {ownerInput && (
            <button
              disabled={visibleSelectedCount === 0}
              onClick={handleOwnerSet}
              className="px-2 py-0.5 bg-amber-500 disabled:opacity-40 rounded text-xs font-medium hover:bg-amber-600 transition-colors"
            >
              确定
            </button>
          )}
        </div>

        <button
          onClick={clearSelection}
          className="flex items-center gap-1 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md text-sm transition-colors"
        >
          <X size={13} />
          取消选择
        </button>
      </div>
    </div>
  );
}
