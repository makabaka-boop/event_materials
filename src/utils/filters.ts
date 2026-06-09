import { Material, FilterState } from '../types';
import { isOnsiteRelevant } from './validators';

export function filterMaterials(
  materials: Material[],
  filter: FilterState
): Material[] {
  return materials.filter((m) => {
    if (filter.activity && m.activity !== filter.activity) return false;
    if (filter.group && m.group !== filter.group) return false;
    if (filter.status.length > 0 && !filter.status.includes(m.status))
      return false;
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      const text = `${m.name} ${m.category} ${m.activity} ${m.remark} ${m.owner} ${m.group}`.toLowerCase();
      if (!text.includes(kw)) return false;
    }
    if (filter.onsiteMode && !isOnsiteRelevant(m, materials)) return false;
    return true;
  });
}

export function getUniqueValues(
  materials: Material[],
  key: keyof Material
): string[] {
  const set = new Set<string>();
  materials.forEach((m) => {
    const v = m[key];
    if (typeof v === 'string' && v.trim()) set.add(v.trim());
  });
  return Array.from(set).sort();
}
