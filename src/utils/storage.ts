import { Category } from '../types';

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
};

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
