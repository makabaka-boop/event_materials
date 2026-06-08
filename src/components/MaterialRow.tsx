import type { MaterialItem } from "@/types"
import { STATUS_LABELS, STATUS_COLORS } from "@/types"
import { useMaterialStore } from "@/store/useMaterialStore"
import { getIssueTypesForItem } from "@/utils/issues"
import { Check, AlertTriangle, Pencil } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface MaterialRowProps {
  item: MaterialItem
  allItems: MaterialItem[]
  isSelected: boolean
  siteCheckMode: boolean
}

export default function MaterialRow({ item, allItems, isSelected, siteCheckMode }: MaterialRowProps) {
  const { toggleSelect, updateItem, openDetailPanel } = useMaterialStore()
  const [editingQty, setEditingQty] = useState<"expected" | "actual" | null>(null)
  const [qtyValue, setQtyValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const statusConfig = STATUS_COLORS[item.status]
  const issueTypes = getIssueTypesForItem(item, allItems)
  const hasIssue = issueTypes.length > 0

  useEffect(() => {
    if (editingQty && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingQty])

  function startEditQty(field: "expected" | "actual") {
    setEditingQty(field)
    setQtyValue(String(item[field]))
  }

  function commitQty() {
    if (editingQty) {
      const val = parseInt(qtyValue, 10)
      if (!isNaN(val) && val >= 0) {
        updateItem(item.id, { [editingQty]: val })
      }
      setEditingQty(null)
    }
  }

  const qtyGap = item.expectedQty - item.actualQty

  return (
    <div
      className={`group relative flex flex-col gap-2 border-b border-gray-100 bg-white px-4 py-3 transition-colors hover:bg-gray-50/80 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-3.5 ${
        isSelected ? "border-l-[3px] border-l-brand-accent bg-orange-50/30" : "border-l-[3px] border-l-transparent"
      } ${siteCheckMode && hasIssue ? "bg-red-50/20" : ""}`}
    >
      <div className="flex items-center gap-3 sm:contents">
        <button
          onClick={() => toggleSelect(item.id)}
          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
            isSelected
              ? "border-brand-accent bg-brand-accent text-white"
              : "border-gray-300 hover:border-brand-accent"
          }`}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </button>

        <div className="min-w-0 flex-1 sm:min-w-0 sm:flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-brand-dark">{item.name}</span>
            {hasIssue && (
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
            <span>{item.category}</span>
            <span className="text-gray-300">·</span>
            <span>{item.event}</span>
            {item.group && (
              <>
                <span className="text-gray-300">·</span>
                <span>{item.group}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pl-8 sm:gap-6 sm:pl-0">
        <div className="flex items-center gap-3 text-sm">
          <div className="text-right">
            <div className="text-xs text-gray-400">预计</div>
            {editingQty === "expected" ? (
              <input
                ref={inputRef}
                type="number"
                value={qtyValue}
                onChange={(e) => setQtyValue(e.target.value)}
                onBlur={commitQty}
                onKeyDown={(e) => e.key === "Enter" && commitQty()}
                className="w-14 rounded border border-brand-accent px-1.5 py-0.5 text-right text-sm outline-none"
              />
            ) : (
              <button
                onClick={() => startEditQty("expected")}
                className="font-medium text-brand-dark hover:text-brand-accent"
              >
                {item.expectedQty}
              </button>
            )}
          </div>
          <span className="text-gray-300">/</span>
          <div className="text-right">
            <div className="text-xs text-gray-400">实际</div>
            {editingQty === "actual" ? (
              <input
                ref={inputRef}
                type="number"
                value={qtyValue}
                onChange={(e) => setQtyValue(e.target.value)}
                onBlur={commitQty}
                onKeyDown={(e) => e.key === "Enter" && commitQty()}
                className="w-14 rounded border border-brand-accent px-1.5 py-0.5 text-right text-sm outline-none"
              />
            ) : (
              <button
                onClick={() => startEditQty("actual")}
                className={`font-medium ${
                  qtyGap > 0 ? "text-red-500" : "text-emerald-600"
                } hover:text-brand-accent`}
              >
                {item.actualQty}
              </button>
            )}
          </div>
          {qtyGap > 0 && (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
              缺{qtyGap}
            </span>
          )}
        </div>

        <div className="w-16 text-right text-sm sm:w-20">
          {item.responsible ? (
            <span className="text-brand-dark">{item.responsible}</span>
          ) : (
            <span className="text-amber-500">未指定</span>
          )}
        </div>

        <div className="w-20 sm:w-24">
          <span className={`status-badge ${statusConfig.bg} ${statusConfig.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
            {STATUS_LABELS[item.status]}
          </span>
        </div>

        <button
          onClick={() => openDetailPanel(item.id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-brand-dark group-hover:opacity-100 sm:opacity-0"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
