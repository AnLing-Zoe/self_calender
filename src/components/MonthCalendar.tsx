import React, { useState } from 'react';
import { Category, ScheduleItem } from '../types';
import {
  getMonthCalendarCells,
  WEEK_DAYS_SHORT,
  isSameDay,
} from '../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
} from 'lucide-react';

interface MonthCalendarProps {
  categories: Category[];
  schedules: ScheduleItem[];
  selectedCategoryId: string | 'ALL';
  onSelectDay: (dateKey: string) => void;
  onAddScheduleForDate: (dateKey: string) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  categories,
  schedules,
  selectedCategoryId,
  onSelectDay,
  onAddScheduleForDate,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  const categoryMap = new Map<string, Category>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  // Filter schedules based on category filter
  const filteredSchedules = schedules.filter((s) => {
    if (selectedCategoryId === 'ALL') return true;
    return s.categoryId === selectedCategoryId;
  });

  const cells = getMonthCalendarCells(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-5 transition-all">
      {/* Calendar Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {currentYear}年 {currentMonth + 1}月
            </h2>
            <p className="text-[11px] text-slate-400">
              點擊日期查看行程明細
            </p>
          </div>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/70">
          <button
            type="button"
            id="btn-prev-month"
            onClick={handlePrevMonth}
            title="上個月"
            className="p-1 rounded hover:bg-white text-slate-600 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="btn-next-month"
            onClick={handleNextMonth}
            title="下個月"
            className="p-1 rounded hover:bg-white text-slate-600 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mt-3 text-center">
        {WEEK_DAYS_SHORT.map((dayName, i) => (
          <div
            key={i}
            className={`py-1 text-[11px] font-bold rounded-md ${
              i === 5 || i === 6 ? 'text-rose-500 bg-rose-50/40' : 'text-slate-500 bg-slate-50/60'
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar 7x5 or 7x6 Grid Cells */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mt-1.5">
        {cells.map((cell) => {
          const dayItems = filteredSchedules.filter((s) => s.date === cell.dateKey);
          const hasSchedules = dayItems.length > 0;
          const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6;

          return (
            <div
              key={cell.dateKey}
              id={`calendar-cell-${cell.dateKey}`}
              onClick={() => onSelectDay(cell.dateKey)}
              className={`min-h-[58px] sm:min-h-[88px] p-1 sm:p-2 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between group relative ${
                cell.isCurrentMonth
                  ? isWeekend
                    ? 'bg-slate-50/40 border-slate-200/60 hover:bg-slate-100'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-indigo-200'
                  : 'bg-slate-50/20 border-slate-100 text-slate-300'
              } ${cell.isToday ? 'ring-2 ring-indigo-500 bg-indigo-50/20' : ''}`}
            >
              {/* Cell Header: Day Number & Today indicator */}
              <div className="flex items-center justify-between">
                <span
                  className={`w-5 h-5 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${
                    cell.isToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : cell.isCurrentMonth
                      ? isWeekend
                        ? 'text-rose-600'
                        : 'text-slate-800'
                      : 'text-slate-300'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {/* Quick Add Button on Hover */}
                {cell.isCurrentMonth && (
                  <button
                    type="button"
                    title={`新增 ${cell.dateKey} 排程`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddScheduleForDate(cell.dateKey);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-4 h-4 rounded bg-slate-200 hover:bg-indigo-600 hover:text-white text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              {/* Colored Dots Container */}
              <div className="mt-0.5 flex flex-col gap-0.5">
                {hasSchedules ? (
                  <div className="flex flex-wrap items-center gap-1 py-0.5">
                    {dayItems.slice(0, 4).map((item, idx) => {
                      const cat = categoryMap.get(item.categoryId) || {
                        id: item.categoryId,
                        name: '未分類',
                        color: '#CBD5E1',
                      };
                      return (
                        <div
                          key={item.id || idx}
                          title={`${cat.name}: ${item.title || ''}`}
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-2xs transition-transform transform group-hover:scale-110"
                          style={{ backgroundColor: cat.color }}
                        />
                      );
                    })}

                    {dayItems.length > 4 && (
                      <span className="text-[9px] font-bold text-slate-500">
                        +{dayItems.length - 4}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-2" />
                )}

                {/* Text summary badges on wider screens */}
                {hasSchedules && (
                  <div className="hidden md:flex flex-col gap-0.5">
                    {dayItems.slice(0, 1).map((item, idx) => {
                      const cat = categoryMap.get(item.categoryId);
                      return (
                        <div
                          key={item.id || idx}
                          className="text-[9px] font-medium text-slate-700 truncate px-1 py-0.2 rounded bg-slate-100 flex items-center gap-1"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat?.color || '#CBD5E1' }}
                          />
                          <span className="truncate">{item.title || cat?.name || '行程'}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
