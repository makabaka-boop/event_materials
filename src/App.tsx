import { useState } from 'react';
import { FilterBar } from './components/FilterBar';
import { MaterialList } from './components/MaterialList';
import { DetailPanel } from './components/DetailPanel';
import { AddMaterialModal } from './components/AddMaterialModal';
import { useMaterialStore } from './store/useMaterialStore';

function App() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { showDetailPanel, filters, addSampleData } = useMaterialStore();

  return (
    <div className="app">
      <div className="header">
        <h1>📦 活动物资管理工作台</h1>
        <div className="header-actions">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              if (confirm('确定要加载示例数据吗？这会清空当前所有数据。')) {
                addSampleData();
              }
            }}
            title="加载示例数据"
          >
            示例数据
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + 新增物资
          </button>
        </div>
      </div>

      {filters.siteCheckMode && (
        <div className="site-mode-banner">
          <span>🔍 现场核对模式</span>
          <span>- 只显示待领取、有缺口和异常的物资</span>
          <button onClick={() => useMaterialStore.getState().setFilters({ siteCheckMode: false })}>
            退出模式
          </button>
        </div>
      )}

      <FilterBar />

      <div className="main-content">
        <MaterialList />
        {showDetailPanel && <DetailPanel />}
      </div>

      <AddMaterialModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}

export default App;
