import { useState, useEffect } from 'react';
import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LABELS } from '../types/material';
import type { MaterialStatus } from '../types/material';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMaterialModal = ({ isOpen, onClose }: AddMaterialModalProps) => {
  const { addMaterial, getAllCategories, getAllEvents, getAllGroups } = useMaterialStore();
  const categories = getAllCategories();
  const events = getAllEvents();
  const groups = getAllGroups();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    event: '',
    expectedQty: 1,
    actualQty: 0,
    group: '',
    responsible: '',
    status: 'pending' as MaterialStatus,
    remark: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        category: '',
        event: '',
        expectedQty: 1,
        actualQty: 0,
        group: '',
        responsible: '',
        status: 'pending',
        remark: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('请输入物资名称');
      return;
    }
    if (!formData.event.trim()) {
      alert('请输入所属活动');
      return;
    }

    addMaterial({
      name: formData.name.trim(),
      category: formData.category.trim(),
      event: formData.event.trim(),
      expectedQty: formData.expectedQty,
      actualQty: formData.actualQty,
      group: formData.group.trim(),
      responsible: formData.responsible.trim(),
      status: formData.status,
      remark: formData.remark.trim(),
    });

    onClose();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>新增物资</h2>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="detail-form-group">
              <label>物资名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="请输入物资名称"
                autoFocus
              />
            </div>

            <div className="detail-form-row">
              <div className="detail-form-group">
                <label>分类</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="分类"
                  list="add-categories"
                />
                <datalist id="add-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="detail-form-group">
                <label>状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="detail-form-group">
              <label>所属活动 *</label>
              <input
                type="text"
                value={formData.event}
                onChange={(e) => handleChange('event', e.target.value)}
                placeholder="活动名称"
                list="add-events"
              />
              <datalist id="add-events">
                {events.map((e) => (
                  <option key={e} value={e} />
                ))}
              </datalist>
            </div>

            <div className="detail-form-row">
              <div className="detail-form-group">
                <label>预计数量</label>
                <input
                  type="number"
                  min="0"
                  value={formData.expectedQty}
                  onChange={(e) => handleChange('expectedQty', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="detail-form-group">
                <label>实际数量</label>
                <input
                  type="number"
                  min="0"
                  value={formData.actualQty}
                  onChange={(e) => handleChange('actualQty', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="detail-form-row">
              <div className="detail-form-group">
                <label>领取小组</label>
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => handleChange('group', e.target.value)}
                  placeholder="小组名称"
                  list="add-groups"
                />
                <datalist id="add-groups">
                  {groups.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>
              <div className="detail-form-group">
                <label>责任人</label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => handleChange('responsible', e.target.value)}
                  placeholder="责任人姓名"
                />
              </div>
            </div>

            <div className="detail-form-group">
              <label>备注</label>
              <textarea
                value={formData.remark}
                onChange={(e) => handleChange('remark', e.target.value)}
                placeholder="添加备注信息..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
