import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Material, MaterialStatus, FilterState, MaterialIssue } from '../types/material';

interface MaterialState {
  materials: Material[];
  filters: FilterState;
  selectedIds: Set<string>;
  selectedMaterialId: string | null;
  showDetailPanel: boolean;
  previousVisibleCount: number;
  hasInitialized: boolean;

  addMaterial: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMaterial: (id: string, data: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  batchDelete: (ids: string[]) => void;

  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  toggleSelect: (id: string) => void;
  toggleSelectAllVisible: () => void;
  clearSelection: () => void;
  getVisibleSelectedIds: () => string[];
  getHiddenSelectedIds: () => string[];

  setSelectedMaterial: (id: string | null) => void;
  setShowDetailPanel: (show: boolean) => void;

  batchUpdateStatus: (status: MaterialStatus) => void;
  batchSetGroup: (group: string) => void;
  batchSetResponsible: (responsible: string) => void;

  getFilteredMaterials: () => Material[];
  getMaterialIssues: (material: Material) => MaterialIssue[];
  getSiteCheckMaterials: () => Material[];
  hasAnyIssues: (material: Material) => boolean;

  getAllEvents: () => string[];
  getAllGroups: () => string[];
  getAllCategories: () => string[];

  addSampleData: () => void;
}

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

const defaultFilters: FilterState = {
  keyword: '',
  event: '',
  group: '',
  status: '',
  category: '',
  siteCheckMode: false,
};

const computeStatus = (expectedQty: number, actualQty: number, currentStatus: MaterialStatus): MaterialStatus => {
  if (currentStatus === 'suspended') return 'suspended';
  if (actualQty === 0) return 'pending';
  if (actualQty < expectedQty) return 'partially_collected';
  return 'collected';
};

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set, get) => ({
      materials: [],
      filters: defaultFilters,
      selectedIds: new Set(),
      selectedMaterialId: null,
      showDetailPanel: false,
      previousVisibleCount: 0,
      hasInitialized: false,

      addMaterial: (data) => {
        const now = Date.now();
        const status = data.status || computeStatus(data.expectedQty, data.actualQty, 'pending');
        const newMaterial: Material = {
          ...data,
          id: generateId(),
          status,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          materials: [newMaterial, ...state.materials],
        }));
      },

      updateMaterial: (id, data) => {
        set((state) => ({
          materials: state.materials.map((m) => {
            if (m.id !== id) return m;
            const expectedQty = data.expectedQty ?? m.expectedQty;
            const actualQty = data.actualQty ?? m.actualQty;
            const currentStatus = data.status ?? m.status;
            const newStatus = data.status !== undefined 
              ? data.status 
              : computeStatus(expectedQty, actualQty, currentStatus);
            return {
              ...m,
              ...data,
              status: newStatus,
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      deleteMaterial: (id) => {
        set((state) => {
          const newSelected = new Set(state.selectedIds);
          newSelected.delete(id);
          return {
            materials: state.materials.filter((m) => m.id !== id),
            selectedIds: newSelected,
            selectedMaterialId: state.selectedMaterialId === id ? null : state.selectedMaterialId,
          };
        });
      },

      batchDelete: (ids) => {
        const idSet = new Set(ids);
        set((state) => {
          const newSelected = new Set(state.selectedIds);
          ids.forEach((id) => newSelected.delete(id));
          return {
            materials: state.materials.filter((m) => !idSet.has(m.id)),
            selectedIds: newSelected,
          };
        });
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
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

      toggleSelectAllVisible: () => {
        const { getFilteredMaterials, selectedIds } = get();
        const visibleMaterials = getFilteredMaterials();
        const visibleIds = visibleMaterials.map((m) => m.id);
        const allVisibleSelected = visibleIds.every((id) => selectedIds.has(id));

        set((state) => {
          const newSelected = new Set(state.selectedIds);
          if (allVisibleSelected) {
            visibleIds.forEach((id) => newSelected.delete(id));
          } else {
            visibleIds.forEach((id) => newSelected.add(id));
          }
          return { selectedIds: newSelected };
        });
      },

      clearSelection: () => {
        set({ selectedIds: new Set() });
      },

      getVisibleSelectedIds: () => {
        const { getFilteredMaterials, selectedIds } = get();
        const visibleIds = new Set(getFilteredMaterials().map((m) => m.id));
        return Array.from(selectedIds).filter((id) => visibleIds.has(id));
      },

      getHiddenSelectedIds: () => {
        const { getFilteredMaterials, selectedIds } = get();
        const visibleIds = new Set(getFilteredMaterials().map((m) => m.id));
        return Array.from(selectedIds).filter((id) => !visibleIds.has(id));
      },

      setSelectedMaterial: (id) => {
        set({ selectedMaterialId: id, showDetailPanel: id !== null });
      },

      setShowDetailPanel: (show) => {
        set({ showDetailPanel: show });
      },

      batchUpdateStatus: (status) => {
        const { getVisibleSelectedIds } = get();
        const visibleSelectedIds = getVisibleSelectedIds();
        const idSet = new Set(visibleSelectedIds);

        set((state) => ({
          materials: state.materials.map((m) => {
            if (!idSet.has(m.id)) return m;
            return {
              ...m,
              status,
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      batchSetGroup: (group) => {
        const { getVisibleSelectedIds } = get();
        const visibleSelectedIds = getVisibleSelectedIds();
        const idSet = new Set(visibleSelectedIds);

        set((state) => ({
          materials: state.materials.map((m) => {
            if (!idSet.has(m.id)) return m;
            return {
              ...m,
              group,
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      batchSetResponsible: (responsible) => {
        const { getVisibleSelectedIds } = get();
        const visibleSelectedIds = getVisibleSelectedIds();
        const idSet = new Set(visibleSelectedIds);

        set((state) => ({
          materials: state.materials.map((m) => {
            if (!idSet.has(m.id)) return m;
            return {
              ...m,
              responsible,
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      getFilteredMaterials: () => {
        const { materials, filters } = get();
        let result = materials;

        if (filters.siteCheckMode) {
          result = result.filter(
            (m) =>
              get().hasAnyIssues(m) ||
              m.status === 'to_collect' ||
              m.remark.trim().length > 0
          );
        }

        if (filters.keyword) {
          const kw = filters.keyword.toLowerCase();
          result = result.filter(
            (m) =>
              m.name.toLowerCase().includes(kw) ||
              m.responsible.toLowerCase().includes(kw) ||
              m.remark.toLowerCase().includes(kw)
          );
        }

        if (filters.event) {
          result = result.filter((m) => m.event === filters.event);
        }

        if (filters.group) {
          result = result.filter((m) => m.group === filters.group);
        }

        if (filters.status) {
          result = result.filter((m) => m.status === filters.status);
        }

        if (filters.category) {
          result = result.filter((m) => m.category === filters.category);
        }

        return result;
      },

      getMaterialIssues: (material) => {
        const issues: MaterialIssue[] = [];
        const { materials } = get();

        if (material.actualQty < material.expectedQty) {
          issues.push({
            type: 'shortage',
            message: `实际数量(${material.actualQty})小于预计数量(${material.expectedQty})，缺口 ${material.expectedQty - material.actualQty}`,
          });
        }

        if (!material.responsible.trim()) {
          issues.push({
            type: 'no_responsible',
            message: '责任人未填写',
          });
        }

        const sameEventNames = materials.filter(
          (m) => m.event === material.event && m.name === material.name
        );
        if (sameEventNames.length > 1) {
          issues.push({
            type: 'duplicate_name',
            message: `同一活动下存在重复的物资名称"${material.name}"`,
          });
        }

        if (material.status === 'collected' && material.actualQty === 0) {
          issues.push({
            type: 'collected_zero',
            message: '状态为已领取但实际数量为 0',
          });
        }

        return issues;
      },

      getSiteCheckMaterials: () => {
        const { materials, hasAnyIssues } = get();
        return materials.filter(
          (m) => hasAnyIssues(m) || m.status === 'to_collect' || m.remark.trim().length > 0
        );
      },

      hasAnyIssues: (material) => {
        return get().getMaterialIssues(material).length > 0;
      },

      getAllEvents: () => {
        const { materials } = get();
        return Array.from(new Set(materials.map((m) => m.event))).filter(Boolean).sort();
      },

      getAllGroups: () => {
        const { materials } = get();
        return Array.from(new Set(materials.map((m) => m.group))).filter(Boolean).sort();
      },

      getAllCategories: () => {
        const { materials } = get();
        return Array.from(new Set(materials.map((m) => m.category))).filter(Boolean).sort();
      },

      addSampleData: () => {
        const now = Date.now();
        const samples: Material[] = [
          {
            id: generateId(),
            name: '矿泉水',
            category: '饮品',
            event: '夏季团建',
            expectedQty: 100,
            actualQty: 80,
            group: '后勤组',
            responsible: '张三',
            status: 'partially_collected',
            remark: '需要冰镇',
            createdAt: now - 86400000,
            updatedAt: now - 3600000,
          },
          {
            id: generateId(),
            name: '横幅',
            category: '宣传品',
            event: '夏季团建',
            expectedQty: 5,
            actualQty: 5,
            group: '宣传组',
            responsible: '李四',
            status: 'collected',
            remark: '已制作完成',
            createdAt: now - 172800000,
            updatedAt: now - 7200000,
          },
          {
            id: generateId(),
            name: '急救包',
            category: '安全设备',
            event: '夏季团建',
            expectedQty: 10,
            actualQty: 3,
            group: '安全组',
            responsible: '',
            status: 'shortage',
            remark: '急需补充',
            createdAt: now - 259200000,
            updatedAt: now - 86400000,
          },
          {
            id: generateId(),
            name: '话筒电池',
            category: '电子设备',
            event: '年会',
            expectedQty: 20,
            actualQty: 20,
            group: '技术组',
            responsible: '王五',
            status: 'to_collect',
            remark: '',
            createdAt: now - 43200000,
            updatedAt: now - 43200000,
          },
          {
            id: generateId(),
            name: '签到表',
            category: '文具',
            event: '年会',
            expectedQty: 5,
            actualQty: 0,
            group: '会务组',
            responsible: '赵六',
            status: 'pending',
            remark: '待打印',
            createdAt: now - 21600000,
            updatedAt: now - 21600000,
          },
          {
            id: generateId(),
            name: '矿泉水',
            category: '饮品',
            event: '年会',
            expectedQty: 200,
            actualQty: 200,
            group: '后勤组',
            responsible: '张三',
            status: 'collected',
            remark: '',
            createdAt: now - 10800000,
            updatedAt: now - 10800000,
          },
          {
            id: generateId(),
            name: '游戏道具',
            category: '娱乐',
            event: '夏季团建',
            expectedQty: 30,
            actualQty: 15,
            group: '活动组',
            responsible: '',
            status: 'partially_collected',
            remark: '部分还在采购中',
            createdAt: now - 5400000,
            updatedAt: now - 5400000,
          },
          {
            id: generateId(),
            name: '雨棚',
            category: '场地设备',
            event: '户外婚礼',
            expectedQty: 8,
            actualQty: 8,
            group: '搭建组',
            responsible: '钱七',
            status: 'suspended',
            remark: '活动延期，暂存仓库',
            createdAt: now - 259200000,
            updatedAt: now - 172800000,
          },
        ];
        set({ materials: samples, selectedIds: new Set(), hasInitialized: true });
      },
    }),
    {
      name: 'event-materials-storage',
      version: 1,
      partialize: (state) => ({
        materials: state.materials,
        filters: state.filters,
        hasInitialized: state.hasInitialized,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.hasInitialized && state.materials.length === 0) {
          state.addSampleData();
          state.hasInitialized = true;
        } else if (state && !state.hasInitialized) {
          state.hasInitialized = true;
        }
      },
    }
  )
);
