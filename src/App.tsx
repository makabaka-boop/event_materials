import { useEffect, useMemo } from 'react';
import { Package } from 'lucide-react';
import { useMaterialStore } from './store/useMaterialStore';
import { filterMaterials } from './utils/filters';
import { FilterBar } from './components/FilterBar';
import { SelectionBanner } from './components/SelectionBanner';
import { BatchActionBar } from './components/BatchActionBar';
import { MaterialTable } from './components/MaterialTable';
import { DetailPanel } from './components/DetailPanel';
import { AddMaterialModal } from './components/AddMaterialModal';
import { BatchConfirmModal } from './components/BatchConfirmModal';
import { getIssues } from './utils/validators';

function App() {
  const {
    materials,
    filter,
    selectedIds,
    activeDetailId,
    showAddModal,
    init,
    toggleAddModal,
    setActiveDetail,
  } = useMaterialStore();

  useEffect(() => {
    init();
  }, [init]);

  const visibleMats = useMemo(
    () => filterMaterials(materials, filter),
    [materials, filter]
  );
  const visibleIds = useMemo(() => visibleMats.map((m) => m.id), [visibleMats]);

  const selectedArr = Array.from(selectedIds);
  const hiddenSelectedCount = selectedArr.filter(
    (id) => !visibleIds.includes(id)
  ).length;
  const visibleSelectedCount = selectedArr.length - hiddenSelectedCount;

  const activeMaterial = activeDetailId
    ? materials.find((m) => m.id === activeDetailId) ?? null
    : null;

  const stats = useMemo(() => {
    const total = materials.length;
    const withIssues = materials.filter((m) => getIssues(m, materials).length > 0).length;
    const claimed = materials.filter((m) => m.status === '已领取').length;
    const pending = materials.filter(
      (m) => m.status === '待领取' || m.status === '缺口待补'
    ).length;
    return { total, withIssues, claimed, pending };
  }, [materials]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-ink-800 flex items-center justify-center">
          <Package size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-800">物资管理工作台</h1>
          <p className="text-xs text-slate-400">活动筹备 · 分组领取 · 现场核对</p>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ink-600" />
            共 {stats.total} 项
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-jade-500" />
            已领 {stats.claimed}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            待办 {stats.pending}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            异常 {stats.withIssues}
          </span>
        </div>
      </header>

      <FilterBar onAdd={() => toggleAddModal(true)} />

      <SelectionBanner
        hiddenCount={hiddenSelectedCount}
        visibleSelectedCount={visibleSelectedCount}
        visibleIds={visibleIds}
      />

      <BatchActionBar visibleIds={visibleIds} hiddenCount={hiddenSelectedCount} />

      <main className="flex-1 px-6 py-4 overflow-auto">
        <MaterialTable materials={materials} visibleIds={visibleIds} />

        {visibleMats.length > 0 && (
          <div className="mt-3 text-xs text-slate-400 text-center">
            {filter.onsiteMode ? (
              <span>现场核对模式 · 仅显示缺口、待领取和备注异常项 · 双击单元格可快速编辑</span>
            ) : (
              <span>提示：双击单元格可快速编辑 · 点击行查看详情</span>
            )}
          </div>
        )}
      </main>

      {activeMaterial && (
        <DetailPanel
          material={activeMaterial}
          onClose={() => setActiveDetail(null)}
        />
      )}

      {showAddModal && <AddMaterialModal onClose={() => toggleAddModal(false)} />}

      <BatchConfirmModal />
    </div>
  );
}

export default App;
