import { create } from "zustand"
import type { MaterialItem, MaterialStatus, FilterState } from "@/types"
import { isItemAbnormal } from "@/utils/issues"

const STORAGE_KEY = "event_materials_data"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

function loadFromStorage(): MaterialItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch {
    // ignore
  }
  return []
}

function saveToStorage(items: MaterialItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

interface MaterialStore {
  items: MaterialItem[]
  selectedIds: Set<string>
  filters: FilterState
  detailPanelOpen: boolean
  editingItemId: string | null
  siteCheckMode: boolean
  hiddenSelectedCount: number

  setFilters: (filters: Partial<FilterState>) => void
  toggleSelect: (id: string) => void
  selectAll: (ids: string[]) => void
  clearSelection: () => void
  setHiddenSelectedCount: (count: number) => void
  addItem: (item: Omit<MaterialItem, "id" | "createdAt" | "updatedAt">) => void
  updateItem: (id: string, updates: Partial<MaterialItem>) => void
  deleteItem: (id: string) => void
  batchUpdateStatus: (ids: string[], status: MaterialStatus) => void
  batchDelete: (ids: string[]) => void
  openDetailPanel: (itemId: string | null) => void
  closeDetailPanel: () => void
  toggleSiteCheckMode: () => void
  getFilteredItems: () => MaterialItem[]
}

export const useMaterialStore = create<MaterialStore>((set, get) => ({
  items: loadFromStorage(),
  selectedIds: new Set<string>(),
  filters: {
    event: "",
    category: "",
    group: "",
    status: "",
    keyword: "",
  },
  detailPanelOpen: false,
  editingItemId: null,
  siteCheckMode: false,
  hiddenSelectedCount: 0,

  setFilters: (newFilters) => {
    const state = get()
    const updatedFilters = { ...state.filters, ...newFilters }

    const currentFiltered = state.getFilteredItems()
    const currentFilteredIds = new Set(currentFiltered.map((i) => i.id))

    const newFiltered = applyFilters(state.items, updatedFilters, false)
    const newFilteredIds = new Set(newFiltered.map((i) => i.id))

    let hiddenCount = 0
    for (const id of state.selectedIds) {
      if (!newFilteredIds.has(id) && currentFilteredIds.has(id)) {
        hiddenCount++
      }
    }

    set({ filters: updatedFilters, hiddenSelectedCount: hiddenCount })
  },

  toggleSelect: (id) => {
    const state = get()
    const newSelected = new Set(state.selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    set({ selectedIds: newSelected, hiddenSelectedCount: 0 })
  },

  selectAll: (ids) => {
    const newSelected = new Set(ids)
    set({ selectedIds: newSelected, hiddenSelectedCount: 0 })
  },

  clearSelection: () => {
    set({ selectedIds: new Set(), hiddenSelectedCount: 0 })
  },

  setHiddenSelectedCount: (count) => {
    set({ hiddenSelectedCount: count })
  },

  addItem: (itemData) => {
    const now = Date.now()
    const newItem: MaterialItem = {
      ...itemData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    const updated = [...get().items, newItem]
    saveToStorage(updated)
    set({ items: updated })
  },

  updateItem: (id, updates) => {
    const updated = get().items.map((item) =>
      item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
    )
    saveToStorage(updated)
    set({ items: updated })
  },

  deleteItem: (id) => {
    const updated = get().items.filter((item) => item.id !== id)
    const newSelected = new Set(get().selectedIds)
    newSelected.delete(id)
    saveToStorage(updated)
    set({ items: updated, selectedIds: newSelected })
  },

  batchUpdateStatus: (ids, status) => {
    const idSet = new Set(ids)
    const now = Date.now()
    const updated = get().items.map((item) =>
      idSet.has(item.id) ? { ...item, status, updatedAt: now } : item
    )
    saveToStorage(updated)
    set({ items: updated, selectedIds: new Set(), hiddenSelectedCount: 0 })
  },

  batchDelete: (ids) => {
    const idSet = new Set(ids)
    const updated = get().items.filter((item) => !idSet.has(item.id))
    saveToStorage(updated)
    set({ items: updated, selectedIds: new Set(), hiddenSelectedCount: 0 })
  },

  openDetailPanel: (itemId) => {
    set({ detailPanelOpen: true, editingItemId: itemId })
  },

  closeDetailPanel: () => {
    set({ detailPanelOpen: false, editingItemId: null })
  },

  toggleSiteCheckMode: () => {
    set((state) => ({ siteCheckMode: !state.siteCheckMode }))
  },

  getFilteredItems: () => {
    const state = get()
    return applyFilters(state.items, state.filters, state.siteCheckMode)
  },
}))

function applyFilters(
  items: MaterialItem[],
  filters: FilterState,
  siteCheckMode: boolean
): MaterialItem[] {
  let result = [...items]

  if (siteCheckMode) {
    result = result.filter((item) => isItemAbnormal(item, items))
  }

  if (filters.event) {
    result = result.filter((item) => item.event === filters.event)
  }
  if (filters.category) {
    result = result.filter((item) => item.category === filters.category)
  }
  if (filters.group) {
    result = result.filter((item) => item.group === filters.group)
  }
  if (filters.status) {
    result = result.filter((item) => item.status === filters.status)
  }
  if (filters.keyword.trim()) {
    const kw = filters.keyword.trim().toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) ||
        item.responsible.toLowerCase().includes(kw) ||
        item.notes.toLowerCase().includes(kw)
    )
  }

  return result.sort((a, b) => b.updatedAt - a.updatedAt)
}
