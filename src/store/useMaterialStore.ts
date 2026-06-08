import { create } from 'zustand';
import { Material, FilterState, Status } from '../types';
import { loadMaterials, saveMaterials } from '../utils/storage';
import { generateId } from '../utils/id';

interface BatchUpdate {
  status?: Status;
  group?: string;
  owner?: string;
}

interface MaterialStore {
  materials: Material[];
  filter: FilterState;
  selectedIds: Set<string>;
  activeDetailId: string | null;
  showAddModal: boolean;
  highlightedId: string | null;
  confirmBatch: {
    open: boolean;
    targetIds: string[];
    hiddenCount: number;
    update: BatchUpdate | null;
  };

  init: () => void;
  addMaterial: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => Material;
  updateMaterial: (id: string, patch: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  batchUpdate: (ids: string[], update: BatchUpdate) => void;

  setFilter: (patch: Partial<FilterState>) => void;
  toggleSelect: (id: string) => void;
  selectAllVisible: (visibleIds: string[]) => void;
  clearSelection: () => void;
  clearHiddenSelection: (visibleIds: string[]) => void;

  setActiveDetail: (id: string | null) => void;
  toggleAddModal: (open: boolean) => void;
  setHighlighted: (id: string | null) => void;

  openBatchConfirm: (targetIds: string[], hiddenCount: number, update: BatchUpdate) => void;
  closeBatchConfirm: () => void;
}

const initialFilter: FilterState = {
  activity: '',
  group: '',
  status: [],
  keyword: '',
  onsiteMode: false,
};

const persist = (materials: Material[]) => {
  saveMaterials(materials);
};

export const useMaterialStore = create<MaterialStore>((set, get) => ({
  materials: [],
  filter: initialFilter,
  selectedIds: new Set(),
  activeDetailId: null,
  showAddModal: false,
  highlightedId: null,
  confirmBatch: { open: false, targetIds: [], hiddenCount: 0, update: null },

  init: () => {
    const mats = loadMaterials();
    set({ materials: mats });
  },

  addMaterial: (data) => {
    const now = Date.now();
    const newMat: Material = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const materials = [newMat, ...get().materials];
    set({ materials, highlightedId: newMat.id });
    persist(materials);
    setTimeout(() => set({ highlightedId: null }), 1500);
    return newMat;
  },

  updateMaterial: (id, patch) => {
    const materials = get().materials.map((m) =>
      m.id === id ? { ...m, ...patch, updatedAt: Date.now() } : m
    );
    set({ materials, highlightedId: id });
    persist(materials);
    setTimeout(() => set({ highlightedId: null }), 800);
  },

  deleteMaterial: (id) => {
    const materials = get().materials.filter((m) => m.id !== id);
    const selectedIds = new Set(get().selectedIds);
    selectedIds.delete(id);
    set({
      materials,
      selectedIds,
      activeDetailId: get().activeDetailId === id ? null : get().activeDetailId,
    });
    persist(materials);
  },

  batchUpdate: (ids, update) => {
    const idSet = new Set(ids);
    const now = Date.now();
    const materials = get().materials.map((m) =>
      idSet.has(m.id) ? { ...m, ...update, updatedAt: now } : m
    );
    set({ materials });
    persist(materials);
  },

  setFilter: (patch) => {
    set({ filter: { ...get().filter, ...patch } });
  },

  toggleSelect: (id) => {
    const next = new Set(get().selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    set({ selectedIds: next });
  },

  selectAllVisible: (visibleIds) => {
    const current = new Set(get().selectedIds);
    const allVisibleSelected = visibleIds.every((id) => current.has(id));
    if (allVisibleSelected) {
      visibleIds.forEach((id) => current.delete(id));
    } else {
      visibleIds.forEach((id) => current.add(id));
    }
    set({ selectedIds: current });
  },

  clearSelection: () => {
    set({ selectedIds: new Set() });
  },

  clearHiddenSelection: (visibleIds) => {
    const visibleSet = new Set(visibleIds);
    const next = new Set<string>();
    get().selectedIds.forEach((id) => {
      if (visibleSet.has(id)) next.add(id);
    });
    set({ selectedIds: next });
  },

  setActiveDetail: (id) => {
    set({ activeDetailId: id });
  },

  toggleAddModal: (open) => {
    set({ showAddModal: open });
  },

  setHighlighted: (id) => {
    set({ highlightedId: id });
  },

  openBatchConfirm: (targetIds, hiddenCount, update) => {
    set({
      confirmBatch: {
        open: true,
        targetIds,
        hiddenCount,
        update,
      },
    });
  },

  closeBatchConfirm: () => {
    set({ confirmBatch: { open: false, targetIds: [], hiddenCount: 0, update: null } });
  },
}));
