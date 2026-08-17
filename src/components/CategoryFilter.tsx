import React from 'react';
import { Category, ScheduleItem } from '../types';
import { Filter, Check } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | 'ALL';
  onSelectCategory: (id: string | 'ALL') => void;
  schedules: ScheduleItem[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  schedules,
}) => {
  const getCategoryCount = (catId: string) => {
    return schedules.filter((s) => s.categoryId === catId).length;
  };

  const totalCount = schedules.length;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1 w-full">
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span>篩選：</span>
      </div>

      {/* All Option */}
      <button
        type="button"
        id="filter-cat-all"
        onClick={() => onSelectCategory('ALL')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
          selectedCategoryId === 'ALL'
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {selectedCategoryId === 'ALL' && <Check className="w-3 h-3 stroke-[3]" />}
        <span>全部</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            selectedCategoryId === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {totalCount}
        </span>
      </button>

      {/* Category Chips */}
      {categories.map((cat) => {
        const count = getCategoryCount(cat.id);
        const isSelected = selectedCategoryId === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            id={`filter-cat-${cat.id}`}
            onClick={() => onSelectCategory(isSelected ? 'ALL' : cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
              isSelected
                ? 'text-slate-900 shadow-xs border-slate-400/40 ring-2 ring-slate-400/30'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            style={{
              backgroundColor: isSelected ? cat.color : undefined,
            }}
          >
            {isSelected ? (
              <Check className="w-3 h-3 stroke-[3] text-slate-900" />
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: cat.color }}
              />
            )}
            <span>{cat.name}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isSelected ? 'bg-black/15 text-slate-900' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
