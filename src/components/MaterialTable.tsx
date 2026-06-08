import { useState } from 'react';
import { AlertTriangle, Check, ChevronRight } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { Material, STATUS_LIST } from '../types';
import { StatusBadge } from './StatusBadge';
import { getIssues } from '../utils/validators';

interface Props {
  materials: Material[];
  visibleIds: string[];
}

export function MaterialTable({ materials, visibleIds }: Props) {
  const {
    selectedIds,
    toggleSelect,
    selectAllVisible,
    setActiveDetail,
    activeDetailId,
    updateMaterial,
    highlightedId,
    filter,
  } = useMaterialStore();

  const visibleMats = materials.filter((m) => visibleIds.includes(m.id));

  const allVisibleSelected =
    visibleMats.length > 0 && visibleMats.every((m) => selectedIds.has(m.id));
  const someVisibleSelected = visibleMats.some((m) => selectedIds.has(m.id));

  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: string;
  } | null>(null);

  const handleRowClick = (m: Material, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('input, button, select, label')) return;
    setActiveDetail(m.id === activeDetailId ? null : m.id);
  };

  const renderCellValue = (m: Material) => {
    const issues = getIssues(m, materials);
    const hasWarning = issues.length > 0;
    const isHighlighted = highlightedId === m.id;
    const isSelected = selectedIds.has(m.id);
    const isActive = activeDetailId === m.id;

    return (
      <tr
        key={m.id}
        onClick={(e) => handleRowClick(m, e)}
        className={`border-b border-slate-100 cursor-pointer transition-all duration-200 group
          ${isHighlighted ? 'animate-flash-green' : ''}
          ${isActive ? 'bg-ink-50' : ''}
          ${isSelected ? 'bg-ink-50/60' : ''}
          ${hasWarning ? 'border-l-[3px] border-l-amber-400' : 'border-l-[3px] border-l-transparent'}
          hover:bg-slate-50
        `}
      >
        <td className="table-cell w-10" onClick={(e) => e.stopPropagation()}>
          <label className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelect(m.id)}
              className="w-4 h-4 rounded"
            />
          </label>
        </td>

        <td className="table-cell">
          <div className="flex items-center gap-2">
            {hasWarning && (
              <span title={issues.map((i) => i.message).join('；')}>
                <AlertTriangle
                  size={14}
                  className={
                    issues.some((i) => i.level === 'error')
                      ? 'text-brick-500'
                      : 'text-amber-500 animate-pulse-soft'
                  }
                />
              </span>
            )}
            {editingCell?.id === m.id && editingCell.field === 'name' ? (
              <input
                autoFocus
                defaultValue={m.name}
                onBlur={(e) => {
                  if (e.target.value.trim()) updateMaterial(m.id, { name: e.target.value.trim() });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    updateMaterial(m.id, { name: (e.target as HTMLInputElement).value.trim() });
                    setEditingCell(null);
                  }
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                className="input-underline w-full font-medium text-slate-800"
              />
            ) : (
              <span
                className="font-medium text-slate-800 group-hover:text-ink-800"
                onDoubleClick={() => setEditingCell({ id: m.id, field: 'name' })}
              >
                {m.name}
              </span>
            )}
          </div>
        </td>

        <td className="table-cell text-slate-500 text-xs">
          {editingCell?.id === m.id && editingCell.field === 'category' ? (
            <input
              autoFocus
              defaultValue={m.category}
              onBlur={(e) => {
                updateMaterial(m.id, { category: e.target.value.trim() });
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateMaterial(m.id, { category: (e.target as HTMLInputElement).value.trim() });
                  setEditingCell(null);
                }
                if (e.key === 'Escape') setEditingCell(null);
              }}
              className="input-underline w-full text-slate-500"
            />
          ) : (
            <span onDoubleClick={() => setEditingCell({ id: m.id, field: 'category' })}>
              {m.category || '—'}
            </span>
          )}
        </td>

        <td className="table-cell text-slate-500 text-xs">{m.activity}</td>

        <td className="table-cell text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-2 font-mono text-sm">
            {editingCell?.id === m.id && editingCell.field === 'actualQty' ? (
              <input
                autoFocus
                type="number"
                min={0}
                defaultValue={m.actualQty}
                onBlur={(e) => {
                  const v = parseInt(e.target.value, 10);
                  updateMaterial(m.id, { actualQty: isNaN(v) ? 0 : v });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const v = parseInt((e.target as HTMLInputElement).value, 10);
                    updateMaterial(m.id, { actualQty: isNaN(v) ? 0 : v });
                    setEditingCell(null);
                  }
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                className="input-underline w-14 text-right font-mono"
              />
            ) : (
              <span
                className={`${
                  m.actualQty < m.expectedQty && m.expectedQty > 0
                    ? 'text-brick-600 font-semibold'
                    : 'text-slate-700'
                }`}
                onDoubleClick={() => setEditingCell({ id: m.id, field: 'actualQty' })}
              >
                {m.actualQty}
              </span>
            )}
            <span className="text-slate-300">/</span>
            <span className="text-slate-500">{m.expectedQty}</span>
          </div>
        </td>

        <td className="table-cell text-slate-500 text-xs" onClick={(e) => e.stopPropagation()}>
          {editingCell?.id === m.id && editingCell.field === 'group' ? (
            <input
              autoFocus
              defaultValue={m.group}
              onBlur={(e) => {
                updateMaterial(m.id, { group: e.target.value.trim() });
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateMaterial(m.id, { group: (e.target as HTMLInputElement).value.trim() });
                  setEditingCell(null);
                }
                if (e.key === 'Escape') setEditingCell(null);
              }}
              className="input-underline w-full text-slate-500"
            />
          ) : (
            <span onDoubleClick={() => setEditingCell({ id: m.id, field: 'group' })}>
              {m.group || '—'}
            </span>
          )}
        </td>

        <td className="table-cell text-slate-500 text-xs" onClick={(e) => e.stopPropagation()}>
          {editingCell?.id === m.id && editingCell.field === 'owner' ? (
            <input
              autoFocus
              defaultValue={m.owner}
              onBlur={(e) => {
                updateMaterial(m.id, { owner: e.target.value.trim() });
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateMaterial(m.id, { owner: (e.target as HTMLInputElement).value.trim() });
                  setEditingCell(null);
                }
                if (e.key === 'Escape') setEditingCell(null);
              }}
              className="input-underline w-full text-slate-500"
            />
          ) : (
            <span
              className={!m.owner ? 'text-amber-600 italic' : ''}
              onDoubleClick={() => setEditingCell({ id: m.id, field: 'owner' })}
            >
              {m.owner || '未指定'}
            </span>
          )}
        </td>

        <td className="table-cell" onClick={(e) => e.stopPropagation()}>
          <select
            value={m.status}
            onChange={(e) => updateMaterial(m.id, { status: e.target.value as any })}
            className="appearance-none bg-transparent border-0 p-0 text-xs cursor-pointer focus:outline-none"
          >
            {STATUS_LIST.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <StatusBadge status={m.status} compact />
        </td>

        {filter.onsiteMode && (
          <td className="table-cell" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => updateMaterial(m.id, { status: '已领取', actualQty: m.expectedQty })}
              className="flex items-center gap-1 px-2 py-1 text-xs text-jade-600 hover:bg-jade-50 rounded-md transition-colors"
            >
              <Check size={13} />
              已核对
            </button>
          </td>
        )}

        <td className="table-cell w-8 text-slate-300">
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="table-cell w-10">
                <label className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = !allVisibleSelected && someVisibleSelected;
                    }}
                    onChange={() => selectAllVisible(visibleIds)}
                    className="w-4 h-4 rounded"
                  />
                </label>
              </th>
              <th className="table-cell text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                物资名称
              </th>
              <th className="table-cell text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                分类
              </th>
              <th className="table-cell text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                活动
              </th>
              <th className="table-cell text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                实际/预计
              </th>
              <th className="table-cell text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                小组
              </th>
              <th className="table-cell text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                责任人
              </th>
              <th className="table-cell text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                状态
              </th>
              {filter.onsiteMode && (
                <th className="table-cell text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  操作
                </th>
              )}
              <th className="table-cell w-8" />
            </tr>
          </thead>
          <tbody>
            {visibleMats.length === 0 ? (
              <tr>
                <td
                  colSpan={filter.onsiteMode ? 10 : 9}
                  className="text-center py-16 text-slate-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-2xl">
                      📋
                    </div>
                    <p className="text-sm">
                      {filter.onsiteMode
                        ? '没有需要核对的异常条目 🎉'
                        : '暂无物资数据，点击右上角新增物资开始'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              visibleMats.map(renderCellValue)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
