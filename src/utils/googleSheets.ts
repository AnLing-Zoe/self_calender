import {Category, ScheduleItem} from '../types';
import {calculateDurationHours} from './dateUtils';

const SHEET_ID = '1EzKFvdVVi-spSxF2-8AnwuET1wl9IPZNOXmdu0dZfGo';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL?.trim();

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    if (char === '"' && quoted && csv[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && csv[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char]!);
}

function toDateKey(value: string): string {
  const parts = value.trim().split(/[/-]/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return '';
  return `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
}

function rowsToCategories(rows: string[][]): Category[] {
  const [headers = [], ...dataRows] = rows;
  const nameColumn = headers.indexOf('種類');
  const colorColumn = headers.indexOf('色號');

  return dataRows.flatMap((row) => {
    const name = row[nameColumn]?.trim();
    if (!name) return [];
    return [{id: `sheet-${name}`, name, color: row[colorColumn]?.trim() || '#93C5FD'}];
  });
}

function rowsToSchedules(rows: string[][], categories: Category[]): ScheduleItem[] {
  const [headers = [], ...dataRows] = rows;
  const column = (name: string) => headers.indexOf(name);

  return dataRows.flatMap((row, index) => {
    const date = toDateKey(row[column('日期')] || '');
    if (!date) return [];

    const categoryName = row[column('種類')]?.trim() || '未分類';
    const category = categories.find((item) => item.name === categoryName);
    const startTime = row[column('時間起')]?.trim() || '09:00';
    const endTime = row[column('時間迄')]?.trim() || '10:30';
    const note = row[column('內容備註')]?.trim() || '';
    const createdAt = Number(row[column('建立時間')]) || Date.now();

    return [{
      id: row[column('ID')]?.trim() || `sheet-row-${index + 2}`,
      title: row[column('排程主旨')]?.trim() || categoryName,
      date,
      startTime,
      endTime,
      durationHours: calculateDurationHours(startTime, endTime),
      categoryId: category?.id || `sheet-${categoryName}`,
      target: row[column('對象')]?.trim() || '',
      location: row[column('地點')]?.trim() || '',
      content: note ? `<p>${escapeHtml(note).replace(/\n/g, '<br>')}</p>` : '',
      createdAt,
    }];
  });
}

export async function loadGoogleSheetData(fallbackCategories: Category[]): Promise<{
  categories: Category[];
  schedules: ScheduleItem[];
}> {
  const response = await fetch(API_URL || CSV_URL, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Google Sheet 讀取失敗 (${response.status})`);

  if (API_URL) {
    const result = await response.json();
    if (!result.ok || !Array.isArray(result.rows)) throw new Error(result.error || 'Google Sheet 回應格式錯誤');
    const categories = Array.isArray(result.categories) ? rowsToCategories(result.categories) : fallbackCategories;
    return {categories, schedules: rowsToSchedules(result.rows, categories)};
  }
  const rows = parseCsv(await response.text());
  return {categories: fallbackCategories, schedules: rowsToSchedules(rows, fallbackCategories)};
}

async function write(payload: object) {
  if (!API_URL) throw new Error('尚未設定 VITE_GOOGLE_SHEETS_API_URL，無法寫入 Google Sheet');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || 'Google Sheet 寫入失敗');
  return result;
}

export function saveScheduleToGoogleSheet(schedule: ScheduleItem, categoryName: string) {
  return write({action: 'save', schedule, categoryName}).then((result) => result.schedule as ScheduleItem | undefined);
}

export function deleteScheduleFromGoogleSheet(schedule: ScheduleItem) {
  return write({action: 'delete', schedule});
}

export function saveCategoryToGoogleSheet(category: Category, previousName?: string) {
  return write({action: 'saveCategory', category, previousName});
}

export function deleteCategoryFromGoogleSheet(category: Category) {
  return write({action: 'deleteCategory', category});
}

export function replaceCategoriesInGoogleSheet(categories: Category[]) {
  return write({action: 'replaceCategories', categories});
}
