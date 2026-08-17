export interface Category {
  id: string;
  name: string;
  color: string; // hex string e.g. #3B82F6
  isDefault?: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationHours: number; // in hours (e.g. 2, 3.5)
  categoryId: string;
  target: string; // 對象 (文字)
  location: string; // 地點 (文字)
  content: string; // 內容 (富文字 HTML)
  createdAt: number;
}

export type ActiveTab = 'overview' | 'manage';

export interface DayScheduleSummary {
  date: string;
  dayOfWeek: string;
  dayNumber: number;
  monthNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  items: ScheduleItem[];
  categoryHours: Record<string, number>;
  totalHours: number;
}
