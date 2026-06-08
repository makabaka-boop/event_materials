import FilterBar from '@/components/FilterBar';
import MaterialList from '@/components/MaterialList';
import DetailPanel from '@/components/DetailPanel';
import BatchActionBar from '@/components/BatchActionBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-muted-50 flex flex-col">
      <FilterBar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto h-full">
          <MaterialList />
        </div>
      </main>

      <DetailPanel />
      <BatchActionBar />
    </div>
  );
}