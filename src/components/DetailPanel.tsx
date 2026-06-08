import { useMaterialStore } from "@/store/useMaterialStore"
import type { MaterialItem } from "@/types"
import { STATUS_LABELS } from "@/types"
import type { MaterialStatus } from "@/types"
import { X, Save } from "lucide-react"
import { useState, useEffect } from "react"

const ALL_STATUSES: MaterialStatus[] = [
  "pending",
  "to_pickup",
  "partial_pickedup",
  "pickedup",
  "gap_pending",
  "deferred",
]

const EMPTY_ITEM: Omit<MaterialItem, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  category: "",
  event: "",
  expectedQty: 0,
  actualQty: 0,
  group: "",
  responsible: "",
  status: "pending",
  notes: "",
}

export default function DetailPanel() {
  const { detailPanelOpen, editingItemId, items, closeDetailPanel, addItem, updateItem } =
    useMaterialStore()

  const [form, setForm] = useState(EMPTY_ITEM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = editingItemId !== null
  const editingItem = isEditing ? items.find((i) => i.id === editingItemId) : null

  useEffect(() => {
    if (detailPanelOpen) {
      if (editingItem) {
        setForm({
          name: editingItem.name,
          category: editingItem.category,
          event: editingItem.event,
          expectedQty: editingItem.expectedQty,
          actualQty: editingItem.actualQty,
          group: editingItem.group,
          responsible: editingItem.responsible,
          status: editingItem.status,
          notes: editingItem.notes,
        })
      } else {
        setForm(EMPTY_ITEM)
      }
      setErrors({})
    }
  }, [detailPanelOpen, editingItem])

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = "物资名称不能为空"
    if (!form.event.trim()) newErrors.event = "所属活动不能为空"
    if (form.expectedQty < 0) newErrors.expectedQty = "预计数量不能为负"
    if (form.actualQty < 0) newErrors.actualQty = "实际数量不能为负"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSave() {
    if (!validate()) return
    if (isEditing && editingItemId) {
      updateItem(editingItemId, form)
    } else {
      addItem(form)
    }
    closeDetailPanel()
  }

  if (!detailPanelOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={closeDetailPanel}
      />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl animate-slide-in-right sm:w-[420px]">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-brand-dark">
            {isEditing ? "编辑物资" : "新增物资"}
          </h2>
          <button
            onClick={closeDetailPanel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-dark"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <div>
              <label className="panel-label">物资名称 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`panel-input ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                placeholder="输入物资名称"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="panel-label">分类</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="panel-input"
                  placeholder="如：文具、设备"
                />
              </div>
              <div>
                <label className="panel-label">所属活动 *</label>
                <input
                  type="text"
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className={`panel-input ${errors.event ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                  placeholder="如：年会、团建"
                />
                {errors.event && <p className="mt-1 text-xs text-red-500">{errors.event}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="panel-label">预计数量</label>
                <input
                  type="number"
                  min="0"
                  value={form.expectedQty}
                  onChange={(e) =>
                    setForm({ ...form, expectedQty: parseInt(e.target.value, 10) || 0 })
                  }
                  className={`panel-input ${errors.expectedQty ? "border-red-400" : ""}`}
                />
                {errors.expectedQty && (
                  <p className="mt-1 text-xs text-red-500">{errors.expectedQty}</p>
                )}
              </div>
              <div>
                <label className="panel-label">实际数量</label>
                <input
                  type="number"
                  min="0"
                  value={form.actualQty}
                  onChange={(e) =>
                    setForm({ ...form, actualQty: parseInt(e.target.value, 10) || 0 })
                  }
                  className={`panel-input ${errors.actualQty ? "border-red-400" : ""}`}
                />
                {errors.actualQty && (
                  <p className="mt-1 text-xs text-red-500">{errors.actualQty}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="panel-label">领取小组</label>
                <input
                  type="text"
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                  className="panel-input"
                  placeholder="如：第一组"
                />
              </div>
              <div>
                <label className="panel-label">责任人</label>
                <input
                  type="text"
                  value={form.responsible}
                  onChange={(e) => setForm({ ...form, responsible: e.target.value })}
                  className="panel-input"
                  placeholder="输入责任人姓名"
                />
              </div>
            </div>

            <div>
              <label className="panel-label">状态</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as MaterialStatus })}
                className="panel-input"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="panel-label">备注</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                className="panel-input resize-none"
                placeholder="补充备注信息..."
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={closeDetailPanel}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-accent-hover"
            >
              <Save className="h-4 w-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
