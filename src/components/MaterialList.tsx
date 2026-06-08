import { useMaterialStore } from '../store/useMaterialStore';
import MaterialItem from './MaterialItem';
import { Package } from 'lucide-react';

const MaterialList = () => {
  const {
    getFilteredMaterials,
    selectedIds,
    selectAll,
    deselectAll,
    filters,
  } = useMaterialStore();

  const materials = getFilteredMaterials();
  const allSelected = materials.length > 0 && materials.every((m) => selectedIds.has(m.id));
  const someSelected = materials.some((m) => selectedIds.has(m.id)) && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll();
    } else {
      selectAll(materials.map((m) => m.id));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-muted-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 bg-muted-50 border-b border-muted-200">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-muted-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-muted-700">
            共 {materials.length} 条记录
          </span>
          {filters.siteCheckMode && (
            <span className="px-2 py-0.5 bg-accent-100 text-accent-700 rounded text-xs font-medium">
              现场核对模式
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-400">
            <Package size={48} className="mb-3" />
            <p className="text-sm">暂无物资记录</p>
            <p className="text-xs mt-1">点击右上角「新增物资」开始添加</p>
          </div>
        ) : (
          <div>
            {materials.map((material) => (
              <MaterialItem
                key={material.id}
                material={material}
                isSelected={selectedIds.has(material.id)}
                isSiteCheckMode={filters.siteCheckMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialList;
