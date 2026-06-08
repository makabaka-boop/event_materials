import { useMaterialStore } from "@/store/useMaterialStore"
import { STATUS_LABELS } from "@/types"
import type { MaterialStatus } from "@/types"
import { Search, Filter, ClipboardCheck, Plus, X } from "lucide-react"

const ALL_STATUSES: MaterialStatus[] = [
  "pending",
  "to_pickup",
  "partial_pickedup",
  "pickedup",
  "gap_pending",
  "deferred",
]

export default function FilterBar() {
  const { items, filters, setFilters, siteCheckMode, toggleSiteCheckMode, openDetailPanel } =
    useMaterialStore()

  const events = [...new Set(items.map((i) => i.event).filter(Boolean))]
  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))]
  const groups = [...new Set(items.map((i) => i.group).filter(Boolean))]

  return (
    <div className="sticky top-0 z-30 border-b border-gray-200/60 bg-brand-dark px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-accent">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-white truncate">物资管理工作台</h1>
            <p className="text-xs text-gray-400">
              共 {items.length} 条物资记录
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => openDetailPanel(null)}
            className="flex items-center gap-2 rounded-lg bg-brand-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover sm:px-4"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">新增物资</span>
            <span className="sm:hidden">新增</span>
          </button>

          <button
            onClick={toggleSiteCheckMode}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
              siteCheckMode
                ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                : "border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{siteCheckMode ? "退出核对" : "现场核对"}</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 basis-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索物资名称、责任人、备注..."
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
            className="w-full rounded-lg border border-gray-600 bg-brand-mid py-2 pl-9 pr-8 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
          />
          {filters.keyword && (
            <button
              onClick={() => setFilters({ keyword: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <select
          value={filters.event}
          onChange={(e) => setFilters({ event: e.target.value })}
          className="rounded-lg border border-gray-600 bg-brand-mid px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-brand-accent"
        >
          <option value="">全部活动</option>
          {events.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="rounded-lg border border-gray-600 bg-brand-mid px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-brand-accent"
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.group}
          onChange={(e) => setFilters({ group: e.target.value })}
          className="rounded-lg border border-gray-600 bg-brand-mid px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-brand-accent"
        >
          <option value="">全部小组</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="rounded-lg border border-gray-600 bg-brand-mid px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-brand-accent"
        >
          <option value="">全部状态</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        {(filters.event || filters.category || filters.group || filters.status) && (
          <button
            onClick={() => setFilters({ event: "", category: "", group: "", status: "" })}
            className="rounded-lg border border-gray-600 px-3 py-2 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-300"
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  )
}
