import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LABELS } from '../types/material';
import type { MaterialStatus } from '../types/material';

export const FilterBar = () => {
  const { filters, setFilters, resetFilters, getAllEvents, getAllGroups, getAllCategories, getSiteCheckMaterials } =
    useMaterialStore();

  const events = getAllEvents();
  const groups = getAllGroups();
  const categories = getAllCategories();
  const siteCheckCount = getSiteCheckMaterials().length;

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>搜索</label>
        <input
          type="text"
          placeholder="名称/责任人/备注"
          value={filters.keyword}
          onChange={(e) => setFilters({ keyword: e.target.value })}
          style={{ width: 200 }}
        />
      </div>

      <div className="filter-group">
        <label>活动</label>
        <select value={filters.event} onChange={(e) => setFilters({ event: e.target.value })}>
          <option value="">全部活动</option>
          {events.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>小组</label>
        <select value={filters.group} onChange={(e) => setFilters({ group: e.target.value })}>
          <option value="">全部小组</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>分类</label>
        <select value={filters.category} onChange={(e) => setFilters({ category: e.target.value })}>
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>状态</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value as MaterialStatus | '' })}
        >
          <option value="">全部状态</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group" style={{ marginLeft: 'auto' }}>
        <button
          className={`btn btn-sm ${filters.siteCheckMode ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilters({ siteCheckMode: !filters.siteCheckMode })}
          title="只显示缺口、待领取和有问题的条目"
        >
          {filters.siteCheckMode ? '✓ 现场核对中' : '现场核对'}
          {siteCheckCount > 0 && !filters.siteCheckMode && (
            <span
              style={{
                background: filters.siteCheckMode ? 'rgba(255,255,255,0.3)' : 'var(--warning-color)',
                color: filters.siteCheckMode ? 'white' : 'white',
                padding: '1px 6px',
                borderRadius: 10,
                fontSize: 11,
                marginLeft: 4,
              }}
            >
              {siteCheckCount}
            </span>
          )}
        </button>

        <button className="btn btn-sm btn-ghost" onClick={resetFilters}>
          重置筛选
        </button>
      </div>
    </div>
  );
};
