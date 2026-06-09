import FilterBar from "@/components/FilterBar"
import IssueAlert from "@/components/IssueAlert"
import MaterialList from "@/components/MaterialList"
import DetailPanel from "@/components/DetailPanel"
import BatchActionBar from "@/components/BatchActionBar"
import { useMaterialStore } from "@/store/useMaterialStore"
import { ClipboardCheck } from "lucide-react"

export default function Home() {
  const { siteCheckMode } = useMaterialStore()

  return (
    <div className={`flex h-screen flex-col ${siteCheckMode ? "bg-gray-900" : "bg-brand-surface"}`}>
      <FilterBar />
      <IssueAlert />

      {siteCheckMode && (
        <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800 px-6 py-2">
          <ClipboardCheck className="h-4 w-4 text-brand-accent" />
          <span className="text-sm font-medium text-brand-accent">现场核对模式</span>
          <span className="text-xs text-gray-400">
            — 仅显示缺口、待领取和异常条目
          </span>
        </div>
      )}

      <MaterialList />
      <BatchActionBar />
      <DetailPanel />
    </div>
  )
}
