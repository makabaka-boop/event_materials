import { useMaterialStore } from "@/store/useMaterialStore"
import MaterialRow from "./MaterialRow"
import { Check, Square, PackageOpen } from "lucide-react"

export default function MaterialList() {
  const { items, selectedIds, selectAll, clearSelection, getFilteredItems, siteCheckMode } = useMaterialStore()

  const filteredItems = getFilteredItems()
  const allFilteredSelected =
    filteredItems.length > 0 && filteredItems.every((i) => selectedIds.has(i.id))
  const someSelected = filteredItems.some((i) => selectedIds.has(i.id)) && !allFilteredSelected

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredItems.length > 0 && (
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200/60 bg-gray-50/90 px-6 py-2.5 backdrop-blur-sm">
          <button
            onClick={() => {
              if (allFilteredSelected) {
                clearSelection()
              } else {
                selectAll(filteredItems.map((i) => i.id))
              }
            }}
            className="flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-brand-dark"
          >
            {allFilteredSelected ? (
              <Check className="h-4 w-4 rounded border border-brand-accent bg-brand-accent text-white" />
            ) : someSelected ? (
              <div className="flex h-4 w-4 items-center justify-center rounded border border-brand-accent bg-brand-accent/20">
                <div className="h-1.5 w-2.5 rounded-sm bg-brand-accent" />
              </div>
            ) : (
              <Square className="h-4 w-4 rounded border border-gray-300" />
            )}
            {allFilteredSelected ? "取消全选" : "全选"}
          </button>

          <span className="text-xs text-gray-400">
            显示 {filteredItems.length} / {items.length} 条
            {selectedIds.size > 0 && (
              <span className="ml-2 font-medium text-brand-accent">
                已选 {selectedIds.size} 条
              </span>
            )}
          </span>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <PackageOpen className="mb-4 h-12 w-12 text-gray-300" />
          <p className="text-sm font-medium">暂无物资记录</p>
          <p className="mt-1 text-xs">点击右上角「新增物资」开始添加</p>
        </div>
      ) : (
        <div>
          {filteredItems.map((item) => (
            <MaterialRow
              key={item.id}
              item={item}
              allItems={items}
              isSelected={selectedIds.has(item.id)}
              siteCheckMode={siteCheckMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
