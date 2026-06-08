import { Plus, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LIST, Status } from '../types';
import { getUniqueValues } from '../utils/filters';

interface Props {
  onAdd: () => void;
}

export function FilterBar({ onAdd }: Props) {
  const { materials, filter, setFilter } = useMaterialStore();

  const activities = getUniqueValues(materials, 'activity');
  const groups = getUniqueValues(materials, 'group');

  const toggleStatus = (st: Status) => {
    const current = filter.status;
    if (current.includes(st)) {
      setFilter({ status: current.filter((s) => s !== st) });
    } else {
      setFilter({ status: [...current, st] });
    }
  };

  return (
    <div className="bg-ink-800 text-white px-6 py-3 flex items-center justify-between gap-4 flex-wrap min-h-[56px]">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="搜索物资名称、备注..."
            value={filter.keyword}
            onChange={(e) => setFilter({ keyword: e.target.value })}
            className="bg-white/10 text-white placeholder-slate-400 border-0 rounded-md px-2.5 py-1.5 text-sm w-52 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/15 transition-colors"
          />
        </div>

        <select
          value={filter.activity}
          onChange={(e) => setFilter({ activity: e.target.value })}
          className="bg-white/10 text-white border-0 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 cursor-pointer [&>option]:text-slate-800"
        >
          <option value="">全部活动</option>
          {activities.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={filter.group}
          onChange={(e) => setFilter({ group: e.target.value })}
          className="bg-white/10 text-white border-0 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 cursor-pointer [&>option]:text-slate-800"
        >
          <option value="">全部小组</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_LIST.map((st) => {
            const active = filter.status.includes(st);
            return (
              <button
                key={st}
                onClick={() => toggleStatus(st)}
                className={`px-2 py-1 rounded-md text-xs transition-colors ${
                  active
                    ? 'bg-white text-ink-800 font-medium'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilter({ onsiteMode: !filter.onsiteMode })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            filter.onsiteMode
              ? 'bg-amber-500 text-white'
              : 'bg-white/10 text-slate-300 hover:bg-white/20'
          }`}
        >
          {filter.onsiteMode ? (
            <ToggleRight size={16} />
          ) : (
            <ToggleLeft size={16} />
          )}
          现场核对模式
        </button>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-ink-800 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors shadow-sm"
        >
          <Plus size={16} />
          新增物资
        </button>
      </div>
    </div>
  );
}
