import { STORAGE_KEY, Material } from '../types';

interface StorageData {
  version: number;
  materials: Material[];
}

export function loadMaterials(): Material[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSeedData();
    const data = JSON.parse(raw) as StorageData;
    if (!data.materials || !Array.isArray(data.materials)) {
      return getSeedData();
    }
    return data.materials;
  } catch {
    return getSeedData();
  }
}

export function saveMaterials(materials: Material[]): void {
  const data: StorageData = { version: 1, materials };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getSeedData(): Material[] {
  const now = Date.now();
  return [
    {
      id: 'seed_1',
      name: '活动宣传海报',
      category: '宣传品',
      activity: '春季团建',
      expectedQty: 20,
      actualQty: 20,
      group: '宣传组',
      owner: '李明',
      status: '已领取',
      remark: '',
      createdAt: now - 86400000,
      updatedAt: now - 3600000,
    },
    {
      id: 'seed_2',
      name: '矿泉水',
      category: '餐饮',
      activity: '春季团建',
      expectedQty: 100,
      actualQty: 60,
      group: '后勤组',
      owner: '王芳',
      status: '部分领取',
      remark: '还差40瓶，明天采购',
      createdAt: now - 86400000,
      updatedAt: now - 7200000,
    },
    {
      id: 'seed_3',
      name: '对讲机',
      category: '设备',
      activity: '春季团建',
      expectedQty: 8,
      actualQty: 0,
      group: '技术组',
      owner: '',
      status: '待领取',
      remark: '需要找行政借',
      createdAt: now - 72000000,
      updatedAt: now - 72000000,
    },
    {
      id: 'seed_4',
      name: '定制T恤',
      category: '服装',
      activity: '春季团建',
      expectedQty: 50,
      actualQty: 0,
      group: '',
      owner: '张伟',
      status: '待准备',
      remark: '印刷中，周五到货',
      createdAt: now - 50000000,
      updatedAt: now - 50000000,
    },
    {
      id: 'seed_5',
      name: '纪念徽章',
      category: '礼品',
      activity: '春季团建',
      expectedQty: 60,
      actualQty: 60,
      group: '宣传组',
      owner: '李明',
      status: '已领取',
      remark: '',
      createdAt: now - 40000000,
      updatedAt: now - 2000000,
    },
    {
      id: 'seed_6',
      name: '急救包',
      category: '设备',
      activity: '春季团建',
      expectedQty: 3,
      actualQty: 1,
      group: '后勤组',
      owner: '王芳',
      status: '缺口待补',
      remark: '缺2个，记得带',
      createdAt: now - 30000000,
      updatedAt: now - 1000000,
    },
    {
      id: 'seed_7',
      name: '签到表打印',
      category: '文具',
      activity: '春季团建',
      expectedQty: 5,
      actualQty: 0,
      group: '宣传组',
      owner: '',
      status: '待准备',
      remark: '',
      createdAt: now - 20000000,
      updatedAt: now - 20000000,
    },
    {
      id: 'seed_8',
      name: '投影仪',
      category: '设备',
      activity: '年度总结会',
      expectedQty: 1,
      actualQty: 1,
      group: '技术组',
      owner: '赵强',
      status: '已领取',
      remark: '',
      createdAt: now - 100000000,
      updatedAt: now - 10000000,
    },
  ];
}
