import { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { MaterialStatus, STATUS_LABELS, STATUS_COLORS } from '../types';

const DetailPanel = () => {
  const {
    isDetailPanelOpen,
    closeDetailPanel,
    activeMaterialId,
    materials,
    updateMaterial,
    deleteMaterial,
  } = useMaterialStore();

  const activeMaterial = materials.find((m) => m.id === activeMaterialId);

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

  const [anomalies, setAnomalies] = useState<Array<{ type: string; message: string }>>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (activeMaterial) {
      setFormData({
        name: activeMaterial.name,
        category: activeMaterial.category,
        event: activeMaterial.event,
        expectedQty: activeMaterial.expectedQty,
        actualQty: activeMaterial.actualQty,
        group: activeMaterial.group,
        responsible: activeMaterial.responsible,
        status: activeMaterial.status,
        remark: activeMaterial.remark,
      });

      setShowDeleteConfirm(false);

      const detected: Array<{ type: string; message: string }> = [];
      if (activeMaterial.actualQty < activeMaterial.expectedQty) {
        detected.push({
          type: 'quantity_shortage',
          message: `实际数量(${activeMaterial.actualQty})少于预计数量(${activeMaterial.expectedQty})`,
        });
      }
      if (!activeMaterial.responsible.trim()) {
        detected.push({ type: 'no_responsible', message: '责任人未填写' });
      }
      const duplicates = materials.filter(
        (m) =>
          m.event === activeMaterial.event &&
          m.name === activeMaterial.name &&
          m.id !== activeMaterial.id
      );
      if (duplicates.length > 0) {
        detected.push({ type: 'duplicate_name', message: '同一活动下存在重复的物资名称' });
      }
      if (activeMaterial.status === 'received' && activeMaterial.actualQty === 0) {
        detected.push({ type: 'received_zero', message: '状态为已领取但实际数量为0' });
      }
      const hasProblemStatus = ['shortage', 'ready', 'partial'].includes(activeMaterial.status);
      const hasQuantityIssue = activeMaterial.actualQty < activeMaterial.expectedQty;
      if ((hasProblemStatus || hasQuantityIssue) && !activeMaterial.remark.trim()) {
        detected.push({ type: 'remark_missing', message: '存在待处理问题但未填写备注说明' });
      }
      setAnomalies(detected);
    }
  }, [activeMaterial, materials]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (activeMaterialId) {
      updateMaterial(activeMaterialId, { [field]: value });
    }
  };

  const handleDelete = () => {
    if (activeMaterialId) {
      deleteMaterial(activeMaterialId);
      closeDetailPanel();
    }
  };

  if (!isDetailPanelOpen || !activeMaterial) return null;

  return (
    <div className="fixed inset-0 z-30 flex">
      <div className="absolute inset-0 bg-black/30" onClick={closeDetailPanel} />

      <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
        <div className="flex items-center justify-between px-6 py-4 border-b border-muted-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-primary-900">物资详情</h2>
            {anomalies.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-danger-100 text-danger-700 rounded-full text-xs font-medium">
                <AlertTriangle size={12} />
                {anomalies.length} 项异常
              </span>
            )}
          </div>
          <button
            onClick={closeDetailPanel}
            className="p-1.5 text-muted-500 hover:text-muted-700 hover:bg-muted-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {anomalies.length > 0 && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-warning-700 font-medium mb-2">
                <AlertTriangle size={16} />
                异常提醒
              </div>
              <ul className="space-y-1.5">
                {anomalies.map((anomaly, index) => (
                  <li key={index} className="text-sm text-warning-600 flex items-start gap-2">
                    <span className="text-warning-500 mt-0.5">•</span>
                    {anomaly.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-primary-900">{formData.name}</h3>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[formData.status]}`}
            >
              {STATUS_LABELS[formData.status]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1.5">物资名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1.5">分类</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1.5">所属活动</label>
              <input
                type="text"
                value={formData.event}
                onChange={(e) => handleChange('event', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1.5">领取小组</label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1.5">预计数量</label>
              <input
                type="number"
                min={0}
                value={formData.expectedQty}
                onChange={(e) => handleChange('expectedQty', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-600 mb-1.5">实际数量</label>
              <input
                type="number"
                min={0}
                value={formData.actualQty}
                onChange={(e) => handleChange('actualQty', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-muted-600 mb-1.5">责任人</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => handleChange('responsible', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  !formData.responsible.trim() ? 'border-danger-300' : 'border-muted-300'
                }`}
                placeholder="请输入责任人姓名"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-muted-600 mb-1.5">状态</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-600 mb-1.5">备注</label>
            <textarea
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-muted-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="添加备注信息..."
            />
          </div>

          <div className="pt-4 border-t border-muted-200">
            <div className="text-xs text-muted-400 space-y-1">
              <p>创建时间：{new Date(activeMaterial.createdAt).toLocaleString('zh-CN')}</p>
              <p>更新时间：{new Date(activeMaterial.updatedAt).toLocaleString('zh-CN')}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-muted-200 bg-muted-50">
          {!showDeleteConfirm ? (
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                删除
              </button>
              <button
                onClick={closeDetailPanel}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-lg transition-colors shadow-sm"
              >
                完成
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-danger-600">确认删除此物资？</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-sm text-muted-600 hover:bg-muted-200 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-sm text-white bg-danger-600 hover:bg-danger-700 rounded-lg transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DetailPanel;
