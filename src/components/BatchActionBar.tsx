import { useMaterialStore } from "@/store/useMaterialStore"
import { STATUS_LABELS } from "@/types"
import type { MaterialStatus } from "@/types"
import { Trash2, X, AlertTriangle, ChevronDown } from "lucide-react"
import { useState } from "react"

const BATCH_STATUSES: MaterialStatus[] = [
  "to_pickup",
  "partial_pickedup",
  "pickedup",
  "gap_pending",
  "deferred",
]

export default function BatchActionBar() {
  const {
    selectedIds,
    hiddenSelectedCount,
    batchUpdateStatus,
    batchDelete,
    clearSelection,
    setHiddenSelectedCount,
    getFilteredItems,
  } = useMaterialStore()
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (selectedIds.size === 0 && hiddenSelectedCount === 0) return null

  const filteredItems = getFilteredItems()
  const filteredIds = new Set(filteredItems.map((i) => i.id))
  const visibleSelectedIds = Array.from(selectedIds).filter((id) => filteredIds.has(id))
  const visibleCount = visibleSelectedIds.length
  const hiddenInSelection = selectedIds.size - visibleCount

  return (
    <>
      {(hiddenSelectedCount > 0 || hiddenInSelection > 0) && (
        <div className="fixed bottom-20 left-1/2 z-30 -translate-x-1/2 animate-slide-up">
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 shadow-lg">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-700">
              {hiddenInSelection > 0
                ? `${hiddenInSelection} 条已勾选项不在当前筛选结果中，不会被批量操作影响`
                : `${hiddenSelectedCount} 条已勾选项因筛选条件变更被隐藏，不会被批量操作影响`}
            </span>
            <button
              onClick={() => setHiddenSelectedCount(0)}
              className="ml-1 text-amber-500 hover:text-amber-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 animate-slide-up">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-xl">
          <span className="text-sm font-medium text-brand-dark">
            已选 <span className="text-brand-accent">{visibleCount}</span> 条
            {hiddenInSelection > 0 && (
              <span className="ml-1 text-xs text-amber-500">
                （另有 {hiddenInSelection} 条被隐藏）
              </span>
            )}
          </span>

          <div className="h-5 w-px bg-gray-200" />

          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-1.5 rounded-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover"
            >
              批量标记状态
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {showStatusMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-xl animate-fade-in">
                {BATCH_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      batchUpdateStatus(visibleSelectedIds, s)
                      setShowStatusMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            删除
          </button>

          <div className="h-5 w-px bg-gray-200" />

          <button
            onClick={clearSelection}
            className="text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            取消选择
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="w-80 rounded-2xl bg-white p-6 shadow-2xl animate-slide-up">
            <h3 className="text-base font-semibold text-brand-dark">确认删除</h3>
            <p className="mt-2 text-sm text-gray-500">
              确定要删除选中的 {visibleCount} 条物资记录吗？此操作不可撤销。
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  batchDelete(visibleSelectedIds)
                  setShowDeleteConfirm(false)
                }}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
