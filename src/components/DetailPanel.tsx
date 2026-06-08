import { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, Save } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { StatusBadge } from './StatusBadge';
import { STATUS_LIST, DEFAULT_CATEGORIES, Material } from '../types';
import { getIssues } from '../utils/validators';

interface Props {
  material: Material;
  onClose: () => void;
}

export function DetailPanel({ material, onClose }: Props) {
  const { materials, updateMaterial, deleteMaterial } = useMaterialStore();
  const issues = getIssues(material, materials);

  const [form, setForm] = useState<Material>(material);

  useEffect(() => {
    setForm(material);
  }, [material.id]);

  const handleSave = () => {
    updateMaterial(material.id, {
      name: form.name.trim(),
      category: form.category.trim(),
      activity: form.activity.trim(),
      expectedQty: Number(form.expectedQty) || 0,
      actualQty: Number(form.actualQty) || 0,
      group: form.group.trim(),
      owner: form.owner.trim(),
      status: form.status,
      remark: form.remark,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`确定删除物资「${material.name}」吗？此操作不可撤销。`)) {
      deleteMaterial(material.id);
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-ink-900/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-800">物资详情</h3>
            <StatusBadge status={form.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {issues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-800 text-sm font-medium">
                <AlertTriangle size={14} />
                检测到 {issues.length} 个问题
              </div>
              {issues.map((iss, i) => (
                <div
                  key={i}
                  className={`text-xs flex items-start gap-1.5 ${
                    iss.level === 'error' ? 'text-brick-700' : 'text-amber-700'
                  }`}
                >
                  <span className="mt-0.5">•</span>
                  {iss.message}
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
              物资名称
            </label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                分类
              </label>
              <select
                className="select-field w-full"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">--</option>
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                所属活动
              </label>
              <input
                className="input-field"
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                预计数量
              </label>
              <input
                type="number"
                min={0}
                className="input-field font-mono"
                value={form.expectedQty}
                onChange={(e) =>
                  setForm({ ...form, expectedQty: parseInt(e.target.value, 10) || 0 })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                实际数量
              </label>
              <input
                type="number"
                min={0}
                className="input-field font-mono"
                value={form.actualQty}
                onChange={(e) =>
                  setForm({ ...form, actualQty: parseInt(e.target.value, 10) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                领取小组
              </label>
              <input
                className="input-field"
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                placeholder="如：后勤组"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                责任人
              </label>
              <input
                className="input-field"
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                placeholder="如：张三"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
              状态
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_LIST.map((st) => (
                <button
                  key={st}
                  onClick={() => setForm({ ...form, status: st })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    form.status === st
                      ? 'bg-ink-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
              备注
            </label>
            <textarea
              className="input-field min-h-[100px] resize-none leading-relaxed"
              value={form.remark}
              onChange={(e) => setForm({ ...form, remark: e.target.value })}
              placeholder="记录特殊情况、注意事项..."
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 text-brick-600 hover:bg-brick-50 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={15} />
            删除
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button onClick={handleSave} className="btn-primary flex items-center gap-1.5">
              <Save size={15} />
              保存修改
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
