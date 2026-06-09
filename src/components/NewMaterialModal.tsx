import { useState } from 'react';
import { X } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { MaterialStatus, STATUS_LABELS } from '../types';

interface NewMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewMaterialModal = ({ isOpen, onClose }: NewMaterialModalProps) => {
  const { addMaterial } = useMaterialStore();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    event: '',
    expectedQty: 0,
    actualQty: 0,
    group: '',
    responsible: '',
    status: 'pending' as MaterialStatus,
    remark: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.event.trim()) {
      return;
    }
    addMaterial(formData);
    onClose();
    setFormData({
      name: '',
      category: '',
      event: '',
      expectedQty: 0,
      actualQty: 0,
      group: '',
      responsible: '',
      status: 'pending',
      remark: '',
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-muted-200">
          <h2 className="text-lg font-semibold text-primary-900">新增物资</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-500 hover:text-muted-700 hover:bg-muted-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-muted-700 mb-1.5">
                物资名称 <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入物资名称"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1.5">
                所属活动 <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.event}
                onChange={(e) => handleChange('event', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="如：2024年会"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1.5">分类</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="如：饮品、文具"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1.5">预计数量</label>
              <input
                type="number"
                min={0}
                value={formData.expectedQty}
                onChange={(e) => handleChange('expectedQty', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1.5">实际数量</label>
              <input
                type="number"
                min={0}
                value={formData.actualQty}
                onChange={(e) => handleChange('actualQty', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1.5">领取小组</label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="如：后勤组"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-700 mb-1.5">责任人</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => handleChange('responsible', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="请输入责任人姓名"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-muted-700 mb-1.5">状态</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as MaterialStatus)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-muted-700 mb-1.5">备注</label>
              <textarea
                value={formData.remark}
                onChange={(e) => handleChange('remark', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="补充说明..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-700 bg-muted-100 hover:bg-muted-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-lg transition-colors shadow-sm"
            >
              确认新增
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMaterialModal;
