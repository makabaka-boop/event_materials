import { Search, ListChecks } from "lucide-react";

interface FilterBarProps {
  events: string[];
  categories: string[];
  groups: string[];
  search: string;
  setSearch: (v: string) => void;
  event: string;
  setEvent: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  group: string;
  setGroup: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  inspectionMode: boolean;
  toggleInspection: () => void;
  visibleCount: number;
  totalCount: number;
  anomalyCount: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待准备" },
  { value: "to_pick", label: "待领取" },
  { value: "partial", label: "部分领取" },
  { value: "picked", label: "已领取" },
  { value: "shortage", label: "缺口待补" },
  { value: "hold", label: "暂缓" },
];

export function FilterBar(props: FilterBarProps) {
  const {
    events,
    categories,
    groups,
    search,
    setSearch,
    event,
    setEvent,
    category,
    setCategory,
    group,
    setGroup,
    status,
    setStatus,
    inspectionMode,
    toggleInspection,
    visibleCount,
    totalCount,
    anomalyCount,
  } = props;

  return (
    <div className="filter-bar">
      <div className="filter-grid">
        <div className="search-box">
          <Search size={16} strokeWidth={1.5} />
          <input
            placeholder="搜索物资 / 备注 / 责任人…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {!inspectionMode && (
          <>
            <div className="pill-select">
              <select value={event} onChange={(e) => setEvent(e.target.value)}>
                <option value="all">全部活动</option>
                {events.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>
            <div className="pill-select">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">全部分类</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="pill-select">
              <select value={group} onChange={(e) => setGroup(e.target.value)}>
                <option value="all">全部小组</option>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="pill-select">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {inspectionMode && (
          <>
            <div className="pill-select">
              <select value={event} onChange={(e) => setEvent(e.target.value)}>
                <option value="all">全部活动</option>
                {events.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>
            <div className="pill-select">
              <select value={group} onChange={(e) => setGroup(e.target.value)}>
                <option value="all">全部小组</option>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <button
          className={"btn-ghost" + (inspectionMode ? " is-active" : "")}
          onClick={toggleInspection}
        >
          <ListChecks size={14} strokeWidth={1.6} />
          {inspectionMode ? "退出现场核对" : "现场核对模式"}
        </button>

        <div className="filter-counter">
          <span>
            可见 <strong>{visibleCount.toString().padStart(2, "0")}</strong> / {totalCount.toString().padStart(2, "0")}
          </span>
          <span>·</span>
          <span>
            异常 <strong>{anomalyCount.toString().padStart(2, "0")}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
