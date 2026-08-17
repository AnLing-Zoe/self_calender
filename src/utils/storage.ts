import { Category, ScheduleItem } from '../types';
import { formatDateKey } from './dateUtils';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-study', name: '讀書', color: '#93C5FD', isDefault: true }, // Pastel Blue
  { id: 'cat-job', name: '打工', color: '#FBBF77', isDefault: true },   // Pastel Peach / Warm Apricot
  { id: 'cat-date', name: '約會', color: '#F9A8D4', isDefault: true },  // Pastel Blossom Pink
];

export const PRESET_COLORS = [
  '#93C5FD', // Pastel Sky Blue
  '#FBBF77', // Pastel Peach
  '#F9A8D4', // Pastel Rose Pink
  '#A7F3D0', // Pastel Mint Green
  '#DDD6FE', // Pastel Lavender
  '#FDE68A', // Pastel Lemon Cream
  '#FECDD3', // Pastel Coral Pink
  '#99F6E4', // Pastel Ice Teal
  '#BAE6FD', // Pastel Baby Blue
  '#C7D2FE', // Pastel Periwinkle
  '#D9F99D', // Pastel Tea Green
  '#E2E8F0', // Pastel Soft Slate
];

const STORAGE_KEYS = {
  CATEGORIES: 'schedule_app_categories_v3',
  SCHEDULES: 'schedule_app_schedules_v3',
};

// Generate realistic seed schedules around the current date (August 2026)
function generateSeedSchedules(): ScheduleItem[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const currentDay = now.getDate();

  const makeDate = (dayOffset: number) => {
    const d = new Date(year, month, currentDay + dayOffset);
    return formatDateKey(d);
  };

  return [
    {
      id: 'seed-1',
      title: '演算法與資料結構複習',
      date: makeDate(0), // Today (Monday)
      startTime: '09:30',
      endTime: '12:30',
      durationHours: 3,
      categoryId: 'cat-study',
      target: '資工系讀書會成員',
      location: '總圖書館 4F 討論室 B',
      content: '<p>今日重點複習 <strong>動態規劃 (Dynamic Programming)</strong> 與 <strong>Graph 圖形演算法</strong>：</p><ul><li>LeetCode 典型題解析 3 題</li><li>討論背包問題變化型</li><li>下次換我導讀 Dijkstra 演算法</li></ul>',
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'seed-2',
      title: '咖啡廳晚班工讀',
      date: makeDate(0), // Today (Monday)
      startTime: '17:00',
      endTime: '22:00',
      durationHours: 5,
      categoryId: 'cat-job',
      target: '店長、晚班同事 阿豪',
      location: '星巴克 中山門市',
      content: '<p>晚班工作重點：</p><ul><li>咖啡豆與耗材盤點進貨確認</li><li>義式咖啡機夜間高溫逆洗與消毒</li><li>結帳收銀機日結對帳單列印</li></ul>',
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'seed-3',
      title: '英文多益聽力練習',
      date: makeDate(1), // Tomorrow (Tuesday)
      startTime: '10:00',
      endTime: '12:00',
      durationHours: 2,
      categoryId: 'cat-study',
      target: '自己',
      location: '自習室 / 宿舍',
      content: '<p>完成 <em>Official Guide Test 3</em> 聽力模擬測驗，檢討 Part 3 & 4 錯題並整理單字筆記。</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-4',
      title: '晚餐約會與看電影',
      date: makeDate(1), // Tuesday
      startTime: '18:30',
      endTime: '21:30',
      durationHours: 3,
      categoryId: 'cat-date',
      target: '小婷',
      location: '信義威秀影城 & 義大利麵餐廳',
      content: '<p>已訂位 <strong>Bellini Pasta Pasta</strong> (18:30)，預計 20:00 看新上映科幻大片 <em>《星際遠航》</em>。記得帶電影折價券！</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-5',
      title: '書店假日工讀班',
      date: makeDate(2), // Wednesday
      startTime: '13:00',
      endTime: '17:00',
      durationHours: 4,
      categoryId: 'cat-job',
      target: '書店主管 芳姐',
      location: '誠品書店 信義店 3F',
      content: '<p>協助新書專題陳列上架、處理讀者尋書諮詢與退書打包作業。</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-6',
      title: '期末專案分工會議',
      date: makeDate(3), // Thursday
      startTime: '14:00',
      endTime: '16:30',
      durationHours: 2.5,
      categoryId: 'cat-study',
      target: '專案組員 (陳同學、林同學)',
      location: '工程一館 302 研討室',
      content: '<p>審查系統架構設計圖、確認 API 接口規格與前端切版進度。預計下週一進行第一輪 Integration 測試。</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-7',
      title: '咖啡館午後甜點約會',
      date: makeDate(4), // Friday
      startTime: '15:00',
      endTime: '18:00',
      durationHours: 3,
      categoryId: 'cat-date',
      target: '小婷',
      location: '赤峰街 老宅手沖咖啡館',
      content: '<p>品嚐招牌千層蛋糕與耶加雪菲手沖咖啡，帶拍立得相機拍照記錄散步行程。</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-8',
      title: '週末全天打工班',
      date: makeDate(5), // Saturday
      startTime: '10:00',
      endTime: '18:00',
      durationHours: 8,
      categoryId: 'cat-job',
      target: '全體外場同仁',
      location: '早午餐美式餐廳',
      content: '<p>週末尖峰客流服務、帶位出餐與桌面巡查。中午 14:00-15:00 休息用餐。</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-9',
      title: '日文檢定考前總複習',
      date: makeDate(6), // Sunday
      startTime: '09:00',
      endTime: '13:00',
      durationHours: 4,
      categoryId: 'cat-study',
      target: '日文助教',
      location: '社區閱覽室',
      content: '<p>複習 <strong>N2 必考文法 50 條</strong> 及讀解長篇閱讀題型抓分技巧。</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-10',
      title: '夜市散步約會',
      date: makeDate(6), // Sunday
      startTime: '19:00',
      endTime: '21:30',
      durationHours: 2.5,
      categoryId: 'cat-date',
      target: '小婷',
      location: '饒河街觀光夜市',
      content: '<p>品嚐胡椒餅、藥燉排骨與地瓜球，放鬆迎接下週新開始！</p>',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'seed-11',
      title: '打工早班',
      date: makeDate(-4),
      startTime: '08:00',
      endTime: '12:00',
      durationHours: 4,
      categoryId: 'cat-job',
      target: '店長',
      location: '中山門市',
      content: '<p>開店準備作業與物料清點。</p>',
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'seed-12',
      title: '微積分習題演練',
      date: makeDate(-3),
      startTime: '14:00',
      endTime: '17:00',
      durationHours: 3,
      categoryId: 'cat-study',
      target: '讀書夥伴',
      location: '系館自習室',
      content: '<p>多重積分練習與習題答疑。</p>',
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'seed-13',
      title: '美術館展覽約會',
      date: makeDate(-2),
      startTime: '13:30',
      endTime: '17:00',
      durationHours: 3.5,
      categoryId: 'cat-date',
      target: '小婷',
      location: '臺北市立美術館',
      content: '<p>參觀現代藝術雙年展與文創設計商店。</p>',
      createdAt: Date.now() - 86400000 * 4,
    },
  ];
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch (e) {
    console.error('Failed to load categories from localStorage', e);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to localStorage', e);
  }
}

export function loadSchedules(): ScheduleItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    if (!raw) {
      const seeds = generateSeedSchedules();
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(seeds));
      return seeds;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Failed to load schedules from localStorage', e);
    return [];
  }
}

export function saveSchedules(schedules: ScheduleItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  } catch (e) {
    console.error('Failed to save schedules to localStorage', e);
  }
}
