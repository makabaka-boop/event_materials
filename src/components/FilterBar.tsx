import { Search, Plus, Filter, MapPin, RotateCcw } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LABELS, MaterialStatus } from '../types';
import { useState } from 'react';
import NewMaterialModal from './NewMaterialModal';

const FilterBar = () => {
  const {
    filters,
    setFilters,
    resetFilters,
    getAllEvents,
    getAllCategories,
    getAllGroups,
    getAnomaliesCount,
  } = useMaterialStore();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const events = getAllEvents();
  const categories = getAllCategories();
  const groups = getAllGroups();
  const anomaliesCount = getAnomaliesCount();

  return (
    <div className="bg-white border-b border-muted-200 shadow-sm sticky top-0 z-20">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary-900">活动物资管理工作台</h1>
            {anomaliesCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-warning-500 rounded-full animate-pulse" />
                {anomaliesCount} 项异常
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilters({ siteCheckMode: !filters.siteCheckMode })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.siteCheckMode
                  ? 'bg-accent-500 text-white shadow-md hover:bg-accent-600'
                  : 'bg-muted-100 text-muted-700 hover:bg-muted-200'
              }`}
            >
              <MapPin size={16} />
              现场核对模式
            </button>
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus size={16} />
              新增物资
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-muted-600">
            <Filter size={16} />
            <span className="text-sm font-medium">筛选：</span>
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-400" size={16} />
            <input
              type="text"
              placeholder="搜索物资名称、责任人、备注..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-9 pr-4 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.event}
            onChange={(e) => setFilters({ event: e.target.value })}
            className="px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">全部活动</option>
            {events.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
            className="px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">全部分类</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.group}
            onChange={(e) => setFilters({ group: e.target.value })}
            className="px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">全部小组</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as MaterialStatus | '' })}
            className="px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="">全部状态</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-600 hover:text-primary-700 hover:bg-muted-100 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            重置
          </button>
        </div>
      </div>

      <NewMaterialModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
    </div>
  );
};

export default FilterBar;
