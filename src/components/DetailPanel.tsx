import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LABELS, STATUS_COLORS } from '../types/material';
import type { MaterialStatus } from '../types/material';

export const DetailPanel = () => {
  const {
    selectedMaterialId,
    materials,
    updateMaterial,
    deleteMaterial,
    setShowDetailPanel,
    getMaterialIssues,
    getAllCategories,
    getAllEvents,
    getAllGroups,
  } = useMaterialStore();

  const material = materials.find((m) => m.id === selectedMaterialId) || null;
  const issues = material ? getMaterialIssues(material) : [];
  const categories = getAllCategories();
  const events = getAllEvents();
  const groups = getAllGroups();

  if (!material || !selectedMaterialId) {
    return (
      <div className="detail-panel">
        <div className="detail-panel-header">
          <h2>物资详情</h2>
          <button className="btn btn-sm btn-ghost" onClick={() => setShowDetailPanel(false)}>
            ✕
          </button>
        </div>
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>选择一条物资查看详情</p>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: string | number) => {
    updateMaterial(material.id, { [field]: value });
  };

  const handleDelete = () => {
    if (confirm('确定要删除这条物资吗？')) {
      deleteMaterial(material.id);
      setShowDetailPanel(false);
    }
  };

  const handleQuickQty = (type: 'actual' | 'expected', delta: number) => {
    const field = type === 'actual' ? 'actualQty' : 'expectedQty';
    const current = material[field];
    const newValue = Math.max(0, current + delta);
    handleChange(field, newValue);
  };

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <h2>物资详情</h2>
        <button className="btn btn-sm btn-ghost" onClick={() => setShowDetailPanel(false)}>
          ✕
        </button>
      </div>

      <div className="detail-panel-body">
        {issues.length > 0 && (
          <div className="detail-issues">
            <h3>⚠ 发现 {issues.length} 个问题</h3>
            <ul>
              {issues.map((issue, idx) => (
                <li key={idx}>• {issue.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="detail-form-group">
          <label>物资名称</label>
          <input
            type="text"
            value={material.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="请输入物资名称"
          />
        </div>

        <div className="detail-form-row">
          <div className="detail-form-group">
            <label>分类</label>
            <input
              type="text"
              value={material.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="分类"
              list="categories-datalist"
            />
            <datalist id="categories-datalist">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="detail-form-group">
            <label>状态</label>
            <select
              value={material.status}
              onChange={(e) => handleChange('status', e.target.value as MaterialStatus)}
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
          <label>所属活动</label>
          <input
            type="text"
            value={material.event}
            onChange={(e) => handleChange('event', e.target.value)}
            placeholder="活动名称"
            list="events-datalist"
          />
          <datalist id="events-datalist">
            {events.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </div>

        <div className="detail-form-group">
          <label>数量</label>
          <div className="quantity-inputs">
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--gray-500)',
                  marginBottom: 4,
                }}
              >
                实际
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleQuickQty('actual', -1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  value={material.actualQty}
                  onChange={(e) => handleChange('actualQty', parseInt(e.target.value) || 0)}
                  style={{ textAlign: 'center' }}
                />
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleQuickQty('actual', 1)}
                >
                  +
                </button>
              </div>
            </div>
            <span className="quantity-divider">/</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--gray-500)',
                  marginBottom: 4,
                }}
              >
                预计
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleQuickQty('expected', -1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  value={material.expectedQty}
                  onChange={(e) => handleChange('expectedQty', parseInt(e.target.value) || 0)}
                  style={{ textAlign: 'center' }}
                />
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleQuickQty('expected', 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color:
                material.actualQty < material.expectedQty
                  ? 'var(--danger-color)'
                  : 'var(--gray-500)',
            }}
          >
            {material.actualQty >= material.expectedQty
              ? '✓ 数量充足'
              : `缺口 ${material.expectedQty - material.actualQty} 件`}
          </div>
        </div>

        <div className="detail-form-row">
          <div className="detail-form-group">
            <label>领取小组</label>
            <input
              type="text"
              value={material.group}
              onChange={(e) => handleChange('group', e.target.value)}
              placeholder="小组名称"
              list="groups-datalist"
            />
            <datalist id="groups-datalist">
              {groups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>
          <div className="detail-form-group">
            <label>责任人</label>
            <input
              type="text"
              value={material.responsible}
              onChange={(e) => handleChange('responsible', e.target.value)}
              placeholder="责任人姓名"
              style={{
                borderColor: !material.responsible.trim()
                  ? 'var(--warning-color)'
                  : undefined,
              }}
            />
          </div>
        </div>

        <div className="detail-form-group">
          <label>备注</label>
          <textarea
            value={material.remark}
            onChange={(e) => handleChange('remark', e.target.value)}
            placeholder="添加备注信息..."
          />
        </div>

        <div
          style={{
            fontSize: 12,
            color: 'var(--gray-400)',
            marginTop: 16,
            paddingTop: 16,
            borderTop: '1px solid var(--gray-100)',
          }}
        >
          <div>创建时间：{new Date(material.createdAt).toLocaleString('zh-CN')}</div>
          <div>更新时间：{new Date(material.updatedAt).toLocaleString('zh-CN')}</div>
        </div>
      </div>

      <div className="detail-panel-footer">
        <button className="btn btn-sm btn-danger" onClick={handleDelete}>
          删除
        </button>
        <span
          className="badge badge-status"
          style={{ background: STATUS_COLORS[material.status] }}
        >
          {STATUS_LABELS[material.status]}
        </span>
      </div>
    </div>
  );
};
