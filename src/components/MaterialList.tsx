import { useState, useMemo } from 'react';
import { useMaterialStore } from '../store/useMaterialStore';
import { MaterialItem } from './MaterialItem';
import { STATUS_LABELS } from '../types/material';
import type { MaterialStatus } from '../types/material';

export const MaterialList = () => {
  const {
    getFilteredMaterials,
    selectedIds,
    toggleSelectAllVisible,
    getVisibleSelectedIds,
    getHiddenSelectedIds,
    batchUpdateStatus,
    batchSetGroup,
    batchDelete,
    clearSelection,
    getAllGroups,
    materials,
  } = useMaterialStore();

  const [showBatchGroupInput, setShowBatchGroupInput] = useState(false);
  const [batchGroupValue, setBatchGroupValue] = useState('');

  const filteredMaterials = getFilteredMaterials();
  const visibleSelectedIds = getVisibleSelectedIds();
  const hiddenSelectedIds = getHiddenSelectedIds();
  const groups = getAllGroups();

  const allVisibleSelected = useMemo(() => {
    if (filteredMaterials.length === 0) return false;
    return filteredMaterials.every((m) => selectedIds.has(m.id));
  }, [filteredMaterials, selectedIds]);

  const handleBatchStatus = (status: MaterialStatus) => {
    if (visibleSelectedIds.length === 0) return;
    batchUpdateStatus(status);
  };

  const handleBatchGroup = () => {
    if (!batchGroupValue.trim() || visibleSelectedIds.length === 0) return;
    batchSetGroup(batchGroupValue.trim());
    setBatchGroupValue('');
    setShowBatchGroupInput(false);
  };

  const handleBatchDelete = () => {
    if (visibleSelectedIds.length === 0) return;
    if (confirm(`确定要删除选中的 ${visibleSelectedIds.length} 条物资吗？`)) {
      batchDelete(visibleSelectedIds);
    }
  };

  return (
    <div className="list-container">
      <div className="list-toolbar">
        <div className="list-stats">
          共 <strong>{materials.length}</strong> 条物资，筛选后{' '}
          <strong>{filteredMaterials.length}</strong> 条
        </div>

        <div className="batch-actions">
          {visibleSelectedIds.length > 0 && (
            <>
              <span className="batch-info">
                已选 <strong>{visibleSelectedIds.length}</strong> 条
                {hiddenSelectedIds.length > 0 && (
                  <>
                    {' '}
                    <span className="warning">(含 {hiddenSelectedIds.length} 条已被筛选隐藏)</span>
                  </>
                )}
              </span>

              <select
                className="btn btn-sm btn-secondary"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleBatchStatus(e.target.value as MaterialStatus);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">批量改状态</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              {!showBatchGroupInput ? (
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowBatchGroupInput(true)}
                >
                  批量分组
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 4 }}>
                  <input
                    type="text"
                    className="btn btn-sm"
                    placeholder="小组名称"
                    value={batchGroupValue}
                    onChange={(e) => setBatchGroupValue(e.target.value)}
                    list="groups-datalist"
                    style={{ width: 120 }}
                  />
                  <datalist id="groups-datalist">
                    {groups.map((g) => (
                      <option key={g} value={g} />
                    ))}
                  </datalist>
                  <button className="btn btn-sm btn-primary" onClick={handleBatchGroup}>
                    确定
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      setShowBatchGroupInput(false);
                      setBatchGroupValue('');
                    }}
                  >
                    取消
                  </button>
                </div>
              )}

              <button className="btn btn-sm btn-danger" onClick={handleBatchDelete}>
                删除
              </button>

              <button className="btn btn-sm btn-ghost" onClick={clearSelection}>
                取消选择
              </button>
            </>
          )}
        </div>
      </div>

      {hiddenSelectedIds.length > 0 && (
        <div className="hidden-selection-warning">
          ⚠ 您有 <strong>{hiddenSelectedIds.length}</strong> 条已勾选的记录被当前筛选条件隐藏了。
          批量操作仅对当前可见的 {visibleSelectedIds.length} 条生效，隐藏的记录不会被修改。
          <button
            className="btn btn-sm btn-ghost"
            style={{ marginLeft: 'auto', color: '#92400e' }}
            onClick={clearSelection}
          >
            清除所有选择
          </button>
        </div>
      )}

      <div
        className="material-item"
        style={{
          borderBottom: '1px solid var(--gray-200)',
          background: 'var(--gray-50)',
          cursor: 'pointer',
          padding: '12px 16px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          toggleSelectAllVisible();
        }}
      >
        <input
          type="checkbox"
          className="material-checkbox"
          checked={allVisibleSelected}
          onChange={() => {}}
        />
        <div className="material-content">
          <div className="material-header">
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-600)' }}>
              全选当前可见 ({filteredMaterials.length} 条)
            </span>
          </div>
        </div>
      </div>

      <div className="material-list">
        {filteredMaterials.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <p>暂无物资记录</p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <MaterialItem key={material.id} material={material} />
          ))
        )}
      </div>
    </div>
  );
};
