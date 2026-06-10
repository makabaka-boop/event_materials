import { useMaterialStore } from '../store/useMaterialStore';
import { STATUS_LABELS, STATUS_COLORS } from '../types/material';
import type { Material } from '../types/material';

interface MaterialItemProps {
  material: Material;
}

export const MaterialItem = ({ material }: MaterialItemProps) => {
  const { toggleSelect, selectedIds, setSelectedMaterial, selectedMaterialId, getMaterialIssues } =
    useMaterialStore();

  const isSelected = selectedIds.has(material.id);
  const isActive = selectedMaterialId === material.id;
  const issues = getMaterialIssues(material);
  const hasIssues = issues.length > 0;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelect(material.id);
  };

  const handleClick = () => {
    setSelectedMaterial(material.id);
  };

  return (
    <div
      className={`material-item ${isSelected ? 'selected' : ''}`}
      style={{
        borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
      }}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        className="material-checkbox"
        checked={isSelected}
        onClick={handleCheckboxClick}
        onChange={() => {}}
      />

      <div className="material-content">
        <div className="material-header">
          <span className="material-name">{material.name}</span>
          <div className="material-badges">
            <span
              className="badge badge-status"
              style={{ background: STATUS_COLORS[material.status] }}
            >
              {STATUS_LABELS[material.status]}
            </span>
            <span className="badge badge-category">{material.category}</span>
            {hasIssues && <span className="badge badge-issue">!</span>}
          </div>
        </div>

        <div className="material-details">
          <span>
            <span className="label">活动:</span> {material.event}
          </span>
          <span>
            <span className="label">小组:</span> {material.group || '未分配'}
          </span>
          <span>
            <span className="label">责任人:</span> {material.responsible || '未指定'}
          </span>
          <span>
            <span className="label">数量:</span>
            <span
              style={{
                color: material.actualQty < material.expectedQty ? 'var(--danger-color)' : 'inherit',
                fontWeight: material.actualQty < material.expectedQty ? 500 : 400,
              }}
            >
              {material.actualQty} / {material.expectedQty}
            </span>
          </span>
        </div>

        {hasIssues && (
          <div className="material-issues">
            {issues.slice(0, 2).map((issue, idx) => (
              <div key={idx} className="issue-item">
                ⚠ {issue.message}
              </div>
            ))}
            {issues.length > 2 && (
              <div className="issue-item">还有 {issues.length - 2} 个问题...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
