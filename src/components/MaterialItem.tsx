import { AlertTriangle, Edit2 } from 'lucide-react';
import { useMaterialStore } from '../store/useMaterialStore';
import { MaterialWithAnomalies, STATUS_LABELS, STATUS_COLORS } from '../types';

interface MaterialItemProps {
  material: MaterialWithAnomalies;
  isSelected: boolean;
  isSiteCheckMode: boolean;
}

const MaterialItem = ({ material, isSelected, isSiteCheckMode }: MaterialItemProps) => {
  const { toggleSelect, openDetailPanel } = useMaterialStore();

  const hasAnomaly = material.anomalies.length > 0;
  const qtyDiff = material.actualQty - material.expectedQty;

  return (
    <div
      className={`border-b border-muted-200 transition-colors ${
        isSelected ? 'bg-primary-50' : 'hover:bg-muted-50'
      } ${hasAnomaly && isSiteCheckMode ? 'bg-warning-50/50' : ''}`}
    >
      <div className="flex items-center px-6 py-4 gap-4">
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(material.id)}
            className="w-4 h-4 rounded border-muted-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-primary-900 truncate">{material.name}</h3>
            {hasAnomaly && (
              <span className="flex-shrink-0 text-danger-500" title={material.anomalies.map(a => a.message).join('\n')}>
                <AlertTriangle size={16} />
              </span>
            )}
            <span
              className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[material.status]}`}
            >
              {STATUS_LABELS[material.status]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-600">
            <span className="flex items-center gap-1">
              <span className="text-muted-400">分类：</span>
              {material.category || '-'}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-muted-400">活动：</span>
              {material.event}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-muted-400">小组：</span>
              {material.group || '-'}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-muted-400">责任人：</span>
              <span className={!material.responsible ? 'text-danger-500' : ''}>
                {material.responsible || '未填写'}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <div className="text-sm text-muted-500 mb-0.5">预计 / 实际</div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-muted-700">{material.expectedQty}</span>
              <span className="text-muted-400">/</span>
              <span
                className={`font-semibold ${
                  qtyDiff < 0 ? 'text-danger-600' : qtyDiff === 0 ? 'text-success-600' : 'text-primary-600'
                }`}
              >
                {material.actualQty}
              </span>
              {qtyDiff < 0 && (
                <span className="text-xs text-danger-500 font-medium">(-{Math.abs(qtyDiff)})</span>
              )}
            </div>
          </div>

          <button
            onClick={() => openDetailPanel(material.id)}
            className="p-2 text-muted-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="编辑详情"
          >
            <Edit2 size={18} />
          </button>
        </div>
      </div>

      {material.remark && (
        <div className="px-6 pb-3 -mt-1">
          <p className="text-sm text-muted-600 bg-muted-50 px-3 py-2 rounded-lg">
            <span className="text-muted-400">备注：</span>
            {material.remark}
          </p>
        </div>
      )}

      {hasAnomaly && isSiteCheckMode && (
        <div className="px-6 pb-3 -mt-1">
          <div className="text-sm bg-warning-50 border border-warning-200 px-3 py-2 rounded-lg">
            <div className="font-medium text-warning-700 mb-1">异常提醒：</div>
            <ul className="space-y-0.5">
              {material.anomalies.map((anomaly, index) => (
                <li key={index} className="text-warning-600 text-xs">
                  • {anomaly.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialItem;
