export const WEEK_DAYS_ZH = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
export const WEEK_DAYS_SHORT = ['一', '二', '三', '四', '五', '六', '日'];

/**
 * Format a Date object to YYYY-MM-DD
 */
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD to a local Date object
 */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get start of the week (Monday) for a given date
 */
export function getMondayOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
  date.setDate(date.getDate() + diff);
  return date;
}

/**
 * Get all 7 days of the week starting from Monday of that week
 */
export function getDaysOfWeek(d: Date): Date[] {
  const monday = getMondayOfWeek(d);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    days.push(current);
  }
  return days;
}

/**
 * Calculate duration in hours between startTime ("HH:mm") and endTime ("HH:mm")
 */
export function calculateDurationHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 1.5;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  
  let diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
  if (diffMinutes <= 0) {
    // Cross midnight or invalid, default to 1.5h
    diffMinutes = 90;
  }
  return Math.round((diffMinutes / 60) * 10) / 10;
}

/**
 * Format date for friendly title (e.g. 2026年8月17日 星期一)
 */
export function formatFriendlyDate(dateKey: string): string {
  const d = parseDateKey(dateKey);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return `${year} 年 ${month} 月 ${day} 日 (星期${dayName})`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Generate 35 or 42 grid cells for the monthly calendar view
 */
export function getMonthCalendarCells(year: number, month: number) {
  // month is 0-indexed (0 = Jan, 7 = Aug)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Day of week for 1st of month: 0=Sun, 1=Mon, ..., 6=Sat
  // We want Monday to be index 0
  let firstDayWeekIndex = firstDayOfMonth.getDay() - 1;
  if (firstDayWeekIndex === -1) firstDayWeekIndex = 6; // Sunday becomes 6
  
  const cells: {
    date: Date;
    dateKey: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[] = [];
  
  const today = new Date();
  
  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayWeekIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const d = new Date(year, month - 1, dayNum);
    cells.push({
      date: d,
      dateKey: formatDateKey(d),
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: isSameDay(d, today),
    });
  }
  
  // Current month days
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const d = new Date(year, month, day);
    cells.push({
      date: d,
      dateKey: formatDateKey(d),
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isSameDay(d, today),
    });
  }
  
  // Next month leading days to complete full weeks (multiples of 7)
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      cells.push({
        date: d,
        dateKey: formatDateKey(d),
        dayNumber: day,
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
      });
    }
  }
  
  return cells;
}
