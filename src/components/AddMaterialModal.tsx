import { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LIST, DEFAULT_CATEGORIES, Status } from '../types';

interface Props {
  onClose: () => void;
}

export function AddMaterialModal({ onClose }: Props) {
  const addMaterial = useMaterialStore((s) => s.addMaterial);
  const materials = useMaterialStore((s) => s.materials);

  const existingActivities = Array.from(
    new Set(materials.map((m) => m.activity).filter(Boolean))
  );
  const existingGroups = Array.from(
    new Set(materials.map((m) => m.group).filter(Boolean))
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [activity, setActivity] = useState(existingActivities[0] || '');
  const [expectedQty, setExpectedQty] = useState(1);
  const [actualQty, setActualQty] = useState(0);
  const [group, setGroup] = useState(existingGroups[0] || '');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<Status>('待准备');
  const [remark, setRemark] = useState('');
  const [keepOpen, setKeepOpen] = useState(true);

  const canSubmit = name.trim() && activity.trim() && expectedQty >= 0;

  const submit = (andClose: boolean) => {
    if (!canSubmit) return;
    addMaterial({
      name: name.trim(),
      category: category.trim(),
      activity: activity.trim(),
      expectedQty,
      actualQty,
      group: group.trim(),
      owner: owner.trim(),
      status,
      remark: remark.trim(),
    });
    setName('');
    setExpectedQty(1);
    setActualQty(0);
    setOwner('');
    setRemark('');
    if (andClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Plus size={18} className="text-ink-800" />
            新增物资
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              物资名称 <span className="text-brick-500">*</span>
            </label>
            <input
              autoFocus
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：宣传海报"
              onKeyDown={(e) => e.key === 'Enter' && canSubmit && submit(!keepOpen)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                分类
              </label>
              <select
                className="select-field w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                所属活动 <span className="text-brick-500">*</span>
              </label>
              <input
                className="input-field"
                value={activity}
                list="activity-list"
                onChange={(e) => setActivity(e.target.value)}
                placeholder="如：春季团建"
              />
              <datalist id="activity-list">
                {existingActivities.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                预计数量 <span className="text-brick-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                className="input-field font-mono"
                value={expectedQty}
                onChange={(e) => setExpectedQty(parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                实际数量
              </label>
              <input
                type="number"
                min={0}
                className="input-field font-mono"
                value={actualQty}
                onChange={(e) => setActualQty(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                领取小组
              </label>
              <input
                className="input-field"
                value={group}
                list="group-list"
                onChange={(e) => setGroup(e.target.value)}
                placeholder="如：后勤组"
              />
              <datalist id="group-list">
                {existingGroups.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                责任人
              </label>
              <input
                className="input-field"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="如：张三"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              状态
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_LIST.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    status === st
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
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              备注
            </label>
            <textarea
              className="input-field min-h-[60px] resize-none"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="可选"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepOpen}
              onChange={(e) => setKeepOpen(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            保存后继续添加
          </label>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button
              onClick={() => submit(!keepOpen)}
              disabled={!canSubmit}
              className="btn-primary flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={15} />
              {keepOpen ? '保存' : '保存并关闭'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
