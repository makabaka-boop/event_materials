import { useMaterialStore } from "@/store/useMaterialStore"
import { detectIssues } from "@/utils/issues"
import { ISSUE_LABELS } from "@/types"
import type { IssueType } from "@/types"
import { AlertTriangle, ChevronDown } from "lucide-react"
import { useState } from "react"

const ISSUE_COLORS: Record<IssueType, { bg: string; border: string; text: string; icon: string }> = {
  qty_gap: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "text-red-500" },
  no_responsible: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-500" },
  duplicate_name: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "text-purple-500" },
  pickedup_zero: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: "text-orange-500" },
  notes_abnormal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", icon: "text-teal-500" },
}

export default function IssueAlert() {
  const { items, setFilters } = useMaterialStore()
  const [expanded, setExpanded] = useState(false)
  const issues = detectIssues(items)

  if (issues.length === 0) return null

  const totalIssueItems = issues.reduce((sum, i) => sum + i.materialIds.length, 0)

  return (
    <div className="border-b border-gray-200/60 bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-brand-dark"
        >
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          发现 {issues.length} 类问题，涉及 {totalIssueItems} 条物资
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-wrap gap-2">
          {issues.map((issue) => {
            const colors = ISSUE_COLORS[issue.type]
            return (
              <button
                key={issue.type}
                onClick={() => {
                  if (issue.type === "qty_gap") setFilters({ status: "" })
                }}
                className={`flex items-center gap-2 rounded-lg border ${colors.border} ${colors.bg} px-3 py-2 text-left transition-colors hover:opacity-80`}
              >
                <AlertTriangle className={`h-3.5 w-3.5 ${colors.icon}`} />
                <div>
                  <span className={`text-xs font-semibold ${colors.text}`}>
                    {ISSUE_LABELS[issue.type]}
                  </span>
                  <span className={`ml-1.5 text-xs ${colors.text} opacity-70`}>
                    {issue.materialIds.length} 条
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
