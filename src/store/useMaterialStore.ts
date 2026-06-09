import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Material,
  MaterialStatus,
  FilterState,
  MaterialWithAnomalies,
  AnomalyInfo,
} from '../types';

interface MaterialState {
  materials: Material[];
  selectedIds: Set<string>;
  filters: FilterState;
  activeMaterialId: string | null;
  isDetailPanelOpen: boolean;

  addMaterial: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;

  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  openDetailPanel: (id: string) => void;
  closeDetailPanel: () => void;

  batchUpdateStatus: (ids: string[], status: MaterialStatus) => void;

  getFilteredMaterials: () => MaterialWithAnomalies[];
  getAllEvents: () => string[];
  getAllCategories: () => string[];
  getAllGroups: () => string[];
  getAnomaliesCount: () => number;
  getSelectedVisibleCount: () => number;
  getSelectedHiddenCount: () => number;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const detectAnomalies = (material: Material, allMaterials: Material[]): AnomalyInfo[] => {
  const anomalies: AnomalyInfo[] = [];

  if (material.actualQty < material.expectedQty) {
    anomalies.push({
      type: 'quantity_shortage',
      message: `实际数量(${material.actualQty})少于预计数量(${material.expectedQty})`,
    });
  }

  if (!material.responsible.trim()) {
    anomalies.push({
      type: 'no_responsible',
      message: '责任人未填写',
    });
  }

  const duplicates = allMaterials.filter(
    (m) => m.event === material.event && m.name === material.name && m.id !== material.id
  );
  if (duplicates.length > 0) {
    anomalies.push({
      type: 'duplicate_name',
      message: `同一活动下存在重复的物资名称`,
    });
  }

  if (material.status === 'received' && material.actualQty === 0) {
    anomalies.push({
      type: 'received_zero',
      message: '状态为已领取但实际数量为0',
    });
  }

  const hasProblemStatus = ['shortage', 'ready', 'partial'].includes(material.status);
  const hasQuantityIssue = material.actualQty < material.expectedQty;
  if ((hasProblemStatus || hasQuantityIssue) && !material.remark.trim()) {
    anomalies.push({
      type: 'remark_missing',
      message: '存在待处理问题但未填写备注说明',
    });
  }

  return anomalies;
};

const defaultFilters: FilterState = {
  event: '',
  category: '',
  group: '',
  status: '',
  search: '',
  siteCheckMode: false,
};

const initialMaterials: Material[] = [
  {
    id: generateId(),
    name: '矿泉水',
    category: '饮品',
    event: '2024年会',
    expectedQty: 100,
    actualQty: 80,
    group: '后勤组',
    responsible: '张三',
    status: 'partial',
    remark: '已到货80箱，剩余20箱明天送达',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '笔记本',
    category: '文具',
    event: '2024年会',
    expectedQty: 50,
    actualQty: 50,
    group: '物料组',
    responsible: '李四',
    status: 'ready',
    remark: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '横幅',
    category: '宣传物料',
    event: '春季团建',
    expectedQty: 5,
    actualQty: 3,
    group: '宣传组',
    responsible: '',
    status: 'shortage',
    remark: '厂家还在制作中',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '矿泉水',
    category: '饮品',
    event: '春季团建',
    expectedQty: 60,
    actualQty: 0,
    group: '后勤组',
    responsible: '王五',
    status: 'received',
    remark: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: '签字笔',
    category: '文具',
    event: '2024年会',
    expectedQty: 100,
    actualQty: 100,
    group: '物料组',
    responsible: '李四',
    status: 'received',
    remark: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      materials: initialMaterials,
      selectedIds: new Set(),
      filters: defaultFilters,
      activeMaterialId: null,
      isDetailPanelOpen: false,

      addMaterial: (materialData) => {
        const now = new Date().toISOString();
        const newMaterial: Material = {
          ...materialData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          materials: [...state.materials, newMaterial],
        }));
      },

      updateMaterial: (id, updates) => {
        set((state) => ({
          materials: state.materials.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      deleteMaterial: (id) => {
        set((state) => ({
          materials: state.materials.filter((m) => m.id !== id),
          selectedIds: new Set([...state.selectedIds].filter((sid) => sid !== id)),
          activeMaterialId: state.activeMaterialId === id ? null : state.activeMaterialId,
        }));
      },

      toggleSelect: (id) => {
        set((state) => {
          const newSelected = new Set(state.selectedIds);
          if (newSelected.has(id)) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          return { selectedIds: newSelected };
        });
      },

      selectAll: (ids) => {
        set({ selectedIds: new Set(ids) });
      },

      deselectAll: () => {
        set({ selectedIds: new Set() });
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      openDetailPanel: (id) => {
        set({ activeMaterialId: id, isDetailPanelOpen: true });
      },

      closeDetailPanel: () => {
        set({ isDetailPanelOpen: false });
      },

      batchUpdateStatus: (ids, status) => {
        set((state) => ({
          materials: state.materials.map((m) =>
            ids.includes(m.id) ? { ...m, status, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      getFilteredMaterials: () => {
        const { materials, filters } = get();
        let result = [...materials];

        if (filters.event) {
          result = result.filter((m) => m.event === filters.event);
        }
        if (filters.category) {
          result = result.filter((m) => m.category === filters.category);
        }
        if (filters.group) {
          result = result.filter((m) => m.group === filters.group);
        }
        if (filters.status) {
          result = result.filter((m) => m.status === filters.status);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          result = result.filter(
            (m) =>
              m.name.toLowerCase().includes(searchLower) ||
              m.remark.toLowerCase().includes(searchLower) ||
              m.responsible.toLowerCase().includes(searchLower)
          );
        }

        if (filters.siteCheckMode) {
          result = result.filter((m) => {
            const anomalies = detectAnomalies(m, materials);
            const isProblemStatus = ['shortage', 'ready'].includes(m.status);
            return isProblemStatus || anomalies.length > 0;
          });
        }

        return result.map((m) => ({
          ...m,
          anomalies: detectAnomalies(m, materials),
        }));
      },

      getAllEvents: () => {
        const { materials } = get();
        return Array.from(new Set(materials.map((m) => m.event))).sort();
      },

      getAllCategories: () => {
        const { materials } = get();
        return Array.from(new Set(materials.map((m) => m.category))).sort();
      },

      getAllGroups: () => {
        const { materials } = get();
        return Array.from(new Set(materials.map((m) => m.group))).sort();
      },

      getAnomaliesCount: () => {
        const { materials } = get();
        return materials.reduce((count, m) => {
          const anomalies = detectAnomalies(m, materials);
          return count + (anomalies.length > 0 ? 1 : 0);
        }, 0);
      },

      getSelectedVisibleCount: () => {
        const { selectedIds, getFilteredMaterials } = get();
        const filtered = getFilteredMaterials();
        return filtered.filter((m) => selectedIds.has(m.id)).length;
      },

      getSelectedHiddenCount: () => {
        const { selectedIds, getSelectedVisibleCount } = get();
        return selectedIds.size - getSelectedVisibleCount();
      },
    }),
    {
      name: 'event-materials-storage',
      partialize: (state) => ({
        materials: state.materials,
        filters: state.filters,
      }),
    }
  )
);
