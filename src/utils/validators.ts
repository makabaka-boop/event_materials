import { Material, ValidationIssue } from '../types';

const REMARK_KEYWORDS = ['缺', '少', '忘', '错', '漏', '丢'];

export function getIssues(
  material: Material,
  allMaterials: Material[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (
    material.actualQty < material.expectedQty &&
    material.expectedQty > 0 &&
    !(material.status === '暂缓')
  ) {
    issues.push({
      type: 'qty_gap',
      message: `实际数量(${material.actualQty}) 少于预计数量(${material.expectedQty})，缺 ${material.expectedQty - material.actualQty}`,
      level: 'warning',
    });
  }

  if (!material.owner.trim() && material.status !== '暂缓') {
    issues.push({
      type: 'no_owner',
      message: '未指定责任人',
      level: 'warning',
    });
  }

  const duplicates = allMaterials.filter(
    (m) =>
      m.id !== material.id &&
      m.activity === material.activity &&
      m.name.trim() === material.name.trim()
  );
  if (duplicates.length > 0) {
    issues.push({
      type: 'duplicate_name',
      message: `活动"${material.activity}"下已有同名物资`,
      level: 'error',
    });
  }

  if (material.status === '已领取' && material.actualQty === 0) {
    issues.push({
      type: 'claimed_zero',
      message: '状态为已领取但实际数量为 0',
      level: 'error',
    });
  }

  if (material.remark) {
    const hasFlag = REMARK_KEYWORDS.some((kw) => material.remark.includes(kw));
    if (hasFlag) {
      issues.push({
        type: 'remark_flag',
        message: '备注中包含异常关键词',
        level: 'warning',
      });
    }
  }

  return issues;
}

export function hasIssues(
  material: Material,
  allMaterials: Material[]
): boolean {
  return getIssues(material, allMaterials).length > 0;
}

export function isOnsiteRelevant(
  material: Material,
  allMaterials: Material[]
): boolean {
  if (material.status === '待领取') return true;
  const issues = getIssues(material, allMaterials);
  return issues.some(
    (i) => i.type === 'qty_gap' || i.type === 'remark_flag'
  );
}
