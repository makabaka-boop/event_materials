import { useEffect, useMemo, useState } from "react";
import { useMaterialsStore } from "@/store/materialsStore";
import { detectAnomalies } from "@/utils/anomalies";
import {
  STATUS_ORDER,
  type Material,
} from "@/types/material";
import { FilterBar } from "@/components/FilterBar";
import { Toolbar } from "@/components/Toolbar";
import { MaterialRow } from "@/components/MaterialRow";
import { DetailDrawer } from "@/components/DetailDrawer";

const NEW_DRAFT: Omit<Material, "id" | "updatedAt"> = {
  name: "",
  category: "",
  event: "",
  expectedQty: 1,
  actualQty: 0,
  group: "",
  owner: "",
  status: "pending",
  note: "",
};

export default function Home() {
  const materials = useMaterialsStore((s) => s.materials);
  const add = useMaterialsStore((s) => s.add);
  const update = useMaterialsStore((s) => s.update);
  const remove = useMaterialsStore((s) => s.remove);
  const bulkUpdateStatus = useMaterialsStore((s) => s.bulkUpdateStatus);
  const resetToSample = useMaterialsStore((s) => s.resetToSample);

  const [search, setSearch] = useState("");
  const [event, setEvent] = useState("all");
  const [category, setCategory] = useState("all");
  const [group, setGroup] = useState("all");
  const [status, setStatus] = useState("all");
  const [inspectionMode, setInspectionMode] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [draftMaterial, setDraftMaterial] = useState<Material | null>(null);

  const events = useMemo(
    () => Array.from(new Set(materials.map((m) => m.event).filter(Boolean))).sort(),
    [materials],
  );
  const categories = useMemo(
    () => Array.from(new Set(materials.map((m) => m.category).filter(Boolean))).sort(),
    [materials],
  );
  const groups = useMemo(
    () => Array.from(new Set(materials.map((m) => m.group).filter(Boolean))).sort(),
    [materials],
  );

  const anomalies = useMemo(() => detectAnomalies(materials), [materials]);
  const totalAnomalies = Object.keys(anomalies).length;

  const visibleMaterials = useMemo(() => {
    const term = search.trim().toLowerCase();
    return materials.filter((m) => {
      if (term) {
        const blob = `${m.name} ${m.note} ${m.owner} ${m.category}`.toLowerCase();
        if (!blob.includes(term)) return false;
      }
      if (inspectionMode) {
        // 现场核对模式：仅展示缺口、待领取以及备注异常的条目
        const noteAbnormal = (anomalies[m.id] ?? []).includes("note_abnormal");
        const isFocus = m.status === "shortage" || m.status === "to_pick" || noteAbnormal;
        if (!isFocus) return false;
        // 现场核对模式下仍可按活动 / 小组收窄
        if (event !== "all" && m.event !== event) return false;
        if (group !== "all" && m.group !== group) return false;
        return true;
      }
      if (event !== "all" && m.event !== event) return false;
      if (category !== "all" && m.category !== category) return false;
      if (group !== "all" && m.group !== group) return false;
      if (status !== "all" && m.status !== status) return false;
      return true;
    });
  }, [materials, search, event, category, group, status, inspectionMode, anomalies]);

  // selection bookkeeping
  const visibleIds = useMemo(() => new Set(visibleMaterials.map((m) => m.id)), [visibleMaterials]);
  const visibleSelectedIds = useMemo(
    () => Array.from(selected).filter((id) => visibleIds.has(id)),
    [selected, visibleIds],
  );
  const hiddenSelectedCount = selected.size - visibleSelectedIds.length;

  // prune selection if items deleted entirely
  useEffect(() => {
    setSelected((prev) => {
      const next = new Set<string>();
      const allIds = new Set(materials.map((m) => m.id));
      prev.forEach((id) => {
        if (allIds.has(id)) next.add(id);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [materials]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const cycleStatus = (m: Material) => {
    const idx = STATUS_ORDER.indexOf(m.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    update(m.id, { status: next });
  };

  const openCreate = () => {
    const draft: Material = {
      ...NEW_DRAFT,
      id: "__draft__",
      updatedAt: Date.now(),
    };
    setDraftMaterial(draft);
    setDrawerId("__draft__");
  };

  const handleSave = (patch: Partial<Material>) => {
    if (drawerId === "__draft__" && draftMaterial) {
      const merged = { ...draftMaterial, ...patch };
      const newId = add({
        name: merged.name,
        category: merged.category,
        event: merged.event,
        expectedQty: merged.expectedQty,
        actualQty: merged.actualQty,
        group: merged.group,
        owner: merged.owner,
        status: merged.status,
        note: merged.note,
      });
      setDraftMaterial(null);
      setDrawerId(newId);
    } else if (drawerId) {
      update(drawerId, patch);
      setDrawerId(null);
    }
  };

  const handleDelete = () => {
    if (!drawerId || drawerId === "__draft__") return;
    if (!confirm("确定要删除该物资记录？")) return;
    remove(drawerId);
    setDrawerId(null);
  };

  const handleBulkDelete = () => {
    if (!visibleSelectedIds.length) return;
    if (!confirm(`确定删除选中的 ${visibleSelectedIds.length} 条记录？`)) return;
    visibleSelectedIds.forEach((id) => remove(id));
    setSelected((prev) => {
      const next = new Set(prev);
      visibleSelectedIds.forEach((id) => next.delete(id));
      return next;
    });
  };

  const drawerMaterial =
    drawerId === "__draft__"
      ? draftMaterial
      : drawerId
        ? materials.find((m) => m.id === drawerId) ?? null
        : null;

  const drawerAnomalies = drawerMaterial && drawerMaterial.id !== "__draft__"
    ? anomalies[drawerMaterial.id] ?? []
    : [];

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="masthead-grid">
          <div>
            <div className="brand-eyebrow">Logistic Ledger · No. 03</div>
            <h1 className="brand-title">活动物资工作台</h1>
            <div className="brand-sub">
              一份给单人执行者的纸面台账，带着批量核对与现场提醒。
            </div>
          </div>
          <div className="masthead-meta">
            <div className="stamp">
              {new Date().toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
            <div>条目 {materials.length.toString().padStart(3, "0")} / 异常 {totalAnomalies.toString().padStart(2, "0")}</div>
            <div>本地存储 · localStorage</div>
          </div>
        </div>
      </header>

      <FilterBar
        events={events}
        categories={categories}
        groups={groups}
        search={search}
        setSearch={setSearch}
        event={event}
        setEvent={setEvent}
        category={category}
        setCategory={setCategory}
        group={group}
        setGroup={setGroup}
        status={status}
        setStatus={setStatus}
        inspectionMode={inspectionMode}
        toggleInspection={() => setInspectionMode((v) => !v)}
        visibleCount={visibleMaterials.length}
        totalCount={materials.length}
        anomalyCount={totalAnomalies}
      />

      {hiddenSelectedCount > 0 && (
        <div className="banner-hidden">
          <span>
            <strong>{hiddenSelectedCount}</strong> 条已勾选项被当前筛选/核对模式隐藏，
            批量操作不会作用于它们。点击"清除勾选"即可重置。
          </span>
        </div>
      )}

      {inspectionMode && (
        <div className="banner-inspection">
          <span className="label">INSPECTION MODE</span>
          <span>
            仅显示状态为缺口待补 / 待领取，或备注存在异常关键词的物资。请逐条核对。
          </span>
        </div>
      )}

      <Toolbar
        selectedCount={selected.size}
        visibleSelectedCount={visibleSelectedIds.length}
        hiddenSelectedCount={hiddenSelectedCount}
        onCreate={openCreate}
        onClearSelection={() => setSelected(new Set())}
        onResetSample={() => {
          if (confirm("将清单还原为示例数据，当前修改会被覆盖。是否继续？")) {
            resetToSample();
            setSelected(new Set());
          }
        }}
        onBulkStatus={(s) => bulkUpdateStatus(visibleSelectedIds, s)}
        onBulkDelete={handleBulkDelete}
      />

      <main className="ledger">
        <div className="ledger-rule">
          <span>物资清单 · MATERIALS</span>
          <span>共 {visibleMaterials.length.toString().padStart(2, "0")} 条</span>
        </div>
        {visibleMaterials.length === 0 ? (
          <div className="empty-state">
            没有匹配的物资。试着清除筛选，或新增一条记录。
          </div>
        ) : (
          visibleMaterials.map((m) => (
            <MaterialRow
              key={m.id}
              material={m}
              selected={selected.has(m.id)}
              onToggleSelect={() => toggleSelect(m.id)}
              onOpenDetail={() => setDrawerId(m.id)}
              onCycleStatus={() => cycleStatus(m)}
              anomalies={anomalies[m.id] ?? []}
              inspectionMode={inspectionMode}
              onQuickPicked={() =>
                update(m.id, {
                  status: "picked",
                  actualQty: Math.max(m.actualQty, m.expectedQty),
                })
              }
              onQuickShortage={() => update(m.id, { status: "shortage" })}
            />
          ))
        )}
      </main>

      <footer className="app-footer">
        <span>编辑保存即写入 localStorage</span>
        <span>Single-user · No backend</span>
      </footer>

      <DetailDrawer
        material={drawerMaterial}
        isNew={drawerId === "__draft__"}
        anomalies={drawerAnomalies}
        onClose={() => {
          setDrawerId(null);
          setDraftMaterial(null);
        }}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
