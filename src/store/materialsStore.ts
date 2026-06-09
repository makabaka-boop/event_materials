import { create } from "zustand";
import type { Material, MaterialStatus } from "@/types/material";
import { sampleMaterials } from "@/data/sampleMaterials";

const STORAGE_KEY = "event_materials_v1";

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `mat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function load(): Material[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleMaterials;
    const parsed = JSON.parse(raw) as Material[];
    if (!Array.isArray(parsed)) return sampleMaterials;
    return parsed;
  } catch {
    return sampleMaterials;
  }
}

function persist(materials: Material[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch {
    /* ignore */
  }
}

interface MaterialsState {
  materials: Material[];
  add: (data: Omit<Material, "id" | "updatedAt">) => string;
  update: (id: string, patch: Partial<Material>) => void;
  remove: (id: string) => void;
  bulkUpdateStatus: (ids: string[], status: MaterialStatus) => void;
  resetToSample: () => void;
}

export const useMaterialsStore = create<MaterialsState>((set) => ({
  materials: load(),
  add: (data) => {
    const id = genId();
    set((state) => {
      const next = [
        { ...data, id, updatedAt: Date.now() } satisfies Material,
        ...state.materials,
      ];
      persist(next);
      return { materials: next };
    });
    return id;
  },
  update: (id, patch) => {
    set((state) => {
      const next = state.materials.map((m) =>
        m.id === id ? { ...m, ...patch, updatedAt: Date.now() } : m,
      );
      persist(next);
      return { materials: next };
    });
  },
  remove: (id) => {
    set((state) => {
      const next = state.materials.filter((m) => m.id !== id);
      persist(next);
      return { materials: next };
    });
  },
  bulkUpdateStatus: (ids, status) => {
    if (!ids.length) return;
    const set_ids = new Set(ids);
    set((state) => {
      const next = state.materials.map((m) =>
        set_ids.has(m.id) ? { ...m, status, updatedAt: Date.now() } : m,
      );
      persist(next);
      return { materials: next };
    });
  },
  resetToSample: () => {
    set(() => {
      persist(sampleMaterials);
      return { materials: sampleMaterials.map((m) => ({ ...m })) };
    });
  },
}));
