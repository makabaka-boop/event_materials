import { useState } from 'react';
import { X, ChevronDown, AlertCircle } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { MaterialStatus, STATUS_LABELS } from '../types';

const BatchActionBar = () => {
  const {
    selectedIds,
    deselectAll,
    batchUpdateStatus,
    getSelectedVisibleCount,
    getSelectedHiddenCount,
    getFilteredMaterials,
  } = useMaterialStore();

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showScopeConfirm, setShowScopeConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<MaterialStatus | null>(null);

  const visibleCount = getSelectedVisibleCount();
  const hiddenCount = getSelectedHiddenCount();
  const totalSelected = selectedIds.size;

  if (totalSelected === 0) return null;

  const handleStatusClick = (status: MaterialStatus) => {
    if (hiddenCount > 0) {
      setPendingStatus(status);
      setShowScopeConfirm(true);
      setShowStatusMenu(false);
    } else {
      applyBatchUpdate(status, 'visible');
    }
  };

  const applyBatchUpdate = (status: MaterialStatus, scope: 'visible' | 'all') => {
    let ids: string[];
    if (scope === 'visible') {
      const filtered = getFilteredMaterials();
      ids = filtered.filter((m) => selectedIds.has(m.id)).map((m) => m.id);
    } else {
      ids = Array.from(selectedIds);
    }
    batchUpdateStatus(ids, status);
    setShowScopeConfirm(false);
    setPendingStatus(null);
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-primary-900 text-white rounded-xl shadow-2xl px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">已选 {totalSelected} 项</span>
            {hiddenCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-warning-500/20 text-warning-300 rounded-full text-xs">
                <AlertCircle size={12} />
                {hiddenCount} 项隐藏
              </span>
            )}
          </div>

          <div className="h-5 w-px bg-white/20" />

          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
            >
              批量修改状态
              <ChevronDown size={14} />
            </button>

            {showStatusMenu && (
              <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-muted-200 py-1 min-w-[140px] z-30">
                {(Object.entries(STATUS_LABELS) as [MaterialStatus, string][]).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      onClick={() => handleStatusClick(value)}
                      className="w-full px-4 py-2 text-left text-sm text-muted-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          <button
            onClick={deselectAll}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="取消选择"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {showScopeConfirm && pendingStatus && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowScopeConfirm(false)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-warning-100 rounded-full">
                  <AlertCircle className="text-warning-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900">确认操作范围</h3>
                  <p className="text-sm text-muted-500">选择要应用操作的范围</p>
                </div>
              </div>

              <div className="bg-muted-50 rounded-lg p-3 mb-5 text-sm">
                <p className="text-muted-600 mb-1">
                  当前筛选条件下，您选中的记录中：
                </p>
                <ul className="space-y-1 text-muted-700">
                  <li>• 可见记录：<span className="font-medium">{visibleCount} 条</span></li>
                  <li>• 被筛选隐藏的记录：<span className="font-medium text-warning-600">{hiddenCount} 条</span></li>
                </ul>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => applyBatchUpdate(pendingStatus, 'visible')}
                  className="w-full px-4 py-2.5 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors"
                >
                  仅修改可见的 {visibleCount} 条
                </button>
                <button
                  onClick={() => applyBatchUpdate(pendingStatus, 'all')}
                  className="w-full px-4 py-2.5 bg-warning-600 text-white rounded-lg text-sm font-medium hover:bg-warning-700 transition-colors"
                >
                  修改全部 {totalSelected} 条（含隐藏）
                </button>
                <button
                  onClick={() => setShowScopeConfirm(false)}
                  className="w-full px-4 py-2.5 text-muted-600 hover:bg-muted-100 rounded-lg text-sm font-medium transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BatchActionBar;
