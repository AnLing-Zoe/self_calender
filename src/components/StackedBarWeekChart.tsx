import React, { useState } from 'react';
import { Category, ScheduleItem } from '../types';
import {
  getDaysOfWeek,
  formatDateKey,
  isSameDay,
  WEEK_DAYS_ZH,
} from '../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Sparkles,
  Info,
} from 'lucide-react';

interface StackedBarWeekChartProps {
  categories: Category[];
  schedules: ScheduleItem[];
  selectedCategoryId: string | 'ALL';
  currentWeekAnchorDate: Date;
  onChangeWeekAnchor: (d: Date) => void;
  onSelectDay: (dateKey: string) => void;
  onAddScheduleForDate?: (dateKey: string) => void;
}

export const StackedBarWeekChart: React.FC<StackedBarWeekChartProps> = ({
  categories,
  schedules,
  selectedCategoryId,
  currentWeekAnchorDate,
  onChangeWeekAnchor,
  onSelectDay,
}) => {
  const [hoveredSchedule, setHoveredSchedule] = useState<{
    item: ScheduleItem;
    category: Category;
    x: number;
    y: number;
  } | null>(null);

  const weekDays = getDaysOfWeek(currentWeekAnchorDate);
  const today = new Date();

  const categoryMap = new Map<string, Category>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  // Filter schedules if category filter is active
  const filteredSchedules = schedules.filter((s) => {
    if (selectedCategoryId === 'ALL') return true;
    return s.categoryId === selectedCategoryId;
  });

  // Calculate day data
  const dayColumns = weekDays.map((dayDate, index) => {
    const dateKey = formatDateKey(dayDate);
    const dayItems = filteredSchedules.filter((s) => s.date === dateKey);

    // Group items or stack them
    const totalDayHours = dayItems.reduce((sum, item) => sum + (item.durationHours || 1.5), 0);

    return {
      date: dayDate,
      dateKey,
      dayName: WEEK_DAYS_ZH[index],
      dayNumber: dayDate.getDate(),
      monthNumber: dayDate.getMonth() + 1,
      isToday: isSameDay(dayDate, today),
      items: dayItems,
      totalHours: totalDayHours,
    };
  });

  // Determine maximum height scale (at least 8 hours for nice proportion)
  const maxDayHours = Math.max(8, ...dayColumns.map((d) => d.totalHours));
  // Round up max scale to even number
  const yMax = Math.ceil(maxDayHours / 2) * 2;
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax].map((v) => Math.round(v * 10) / 10);

  // Total weekly stats
  const totalWeeklyHours = dayColumns.reduce((sum, d) => sum + d.totalHours, 0);
  const totalWeeklyCount = dayColumns.reduce((sum, d) => sum + d.items.length, 0);

  // Category breakdown for this week
  const weekCategoryStats: { [catId: string]: number } = {};
  dayColumns.forEach((d) => {
    d.items.forEach((item) => {
      weekCategoryStats[item.categoryId] = (weekCategoryStats[item.categoryId] || 0) + (item.durationHours || 1.5);
    });
  });

  const handlePrevWeek = () => {
    const d = new Date(currentWeekAnchorDate);
    d.setDate(d.getDate() - 7);
    onChangeWeekAnchor(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentWeekAnchorDate);
    d.setDate(d.getDate() + 7);
    onChangeWeekAnchor(d);
  };

  const handleTodayWeek = () => {
    onChangeWeekAnchor(new Date());
  };

  const firstDay = weekDays[0];
  const lastDay = weekDays[6];
  const weekRangeTitle = `${firstDay.getFullYear()} 年 ${firstDay.getMonth() + 1}/${firstDay.getDate()} ~ ${
    lastDay.getMonth() + 1
  }/${lastDay.getDate()}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-5 transition-all relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              本週排程堆疊圖
            </h2>
            <p className="text-[11px] text-slate-400">
              {weekRangeTitle}
            </p>
          </div>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/70">
          <button
            type="button"
            id="btn-prev-week"
            onClick={handlePrevWeek}
            title="上一週"
            className="p-1 rounded hover:bg-white text-slate-600 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="btn-current-week-today"
            onClick={handleTodayWeek}
            className="px-2 py-0.5 text-xs font-semibold rounded hover:bg-white text-slate-700 transition-all cursor-pointer"
          >
            本週
          </button>

          <button
            type="button"
            id="btn-next-week"
            onClick={handleNextWeek}
            title="下一週"
            className="p-1 rounded hover:bg-white text-slate-600 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-4 relative">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 h-44 sm:h-56 relative z-0">
          {/* Y-axis Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none -z-10 pb-8">
            {yTicks.slice().reverse().map((tick, i) => (
              <div key={i} className="w-full flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-slate-300 w-5 text-right select-none">
                  {tick}h
                </span>
                <div className="flex-1 border-b border-dashed border-slate-200/60" />
              </div>
            ))}
          </div>

          {/* 7 Day Columns */}
          {dayColumns.map((day) => {
            const hasItems = day.items.length > 0;
            const barHeightPercent = Math.min(100, (day.totalHours / yMax) * 100);

            return (
              <div
                key={day.dateKey}
                className="flex flex-col items-center h-full group"
                id={`week-col-${day.dateKey}`}
              >
                {/* Bar Container Area */}
                <div
                  onClick={() => onSelectDay(day.dateKey)}
                  className={`w-full flex-1 flex flex-col justify-end items-center pb-1.5 cursor-pointer relative rounded-lg transition-all duration-200 hover:bg-slate-50 p-0.5 ${
                    day.isToday ? 'bg-indigo-50/40' : ''
                  }`}
                  title={`查看 ${day.dateKey} 行程`}
                >
                  {/* Total hours label on top of bar */}
                  {hasItems && (
                    <div className="mb-0.5 text-[10px] sm:text-xs font-bold text-slate-600">
                      {day.totalHours}h
                    </div>
                  )}

                  {/* The Stacked Bar Column */}
                  <div className="w-full max-w-[40px] h-full flex flex-col justify-end">
                    {hasItems ? (
                      <div
                        className="w-full rounded-t-md overflow-hidden flex flex-col shadow-2xs transition-all duration-200 group-hover:scale-[1.02]"
                        style={{ height: `${Math.max(16, barHeightPercent)}%` }}
                      >
                        {day.items.map((item, idx) => {
                          const cat = categoryMap.get(item.categoryId) || {
                            id: item.categoryId,
                            name: '未分類',
                            color: '#CBD5E1',
                          };
                          const itemHeightPercent = (item.durationHours / (day.totalHours || 1)) * 100;

                          return (
                            <div
                              key={item.id || idx}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoveredSchedule({
                                  item,
                                  category: cat,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top,
                                });
                              }}
                              onMouseLeave={() => setHoveredSchedule(null)}
                              className="w-full relative transition-opacity hover:opacity-90 active:opacity-100 flex items-center justify-center border-b border-white/40 last:border-b-0 cursor-pointer"
                              style={{
                                height: `${itemHeightPercent}%`,
                                backgroundColor: cat.color,
                                minHeight: '10px',
                              }}
                            >
                              {/* Inner Mini Label if height is enough */}
                              {itemHeightPercent > 28 && (
                                <span className="text-[9px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] truncate px-0.5 select-none pointer-events-none">
                                  {cat.name}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Empty column subtle placeholder
                      <div className="w-full h-1 rounded-full bg-slate-200/60 mb-0 group-hover:bg-indigo-300 transition-colors" />
                    )}
                  </div>
                </div>

                {/* Day Header at Bottom */}
                <button
                  type="button"
                  onClick={() => onSelectDay(day.dateKey)}
                  className={`w-full pt-1.5 pb-1 flex flex-col items-center rounded-lg transition-all cursor-pointer ${
                    day.isToday
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold ${
                      day.isToday ? 'text-indigo-100' : 'text-slate-400'
                    }`}
                  >
                    {day.dayName}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      day.isToday ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredSchedule && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-xs max-w-xs border border-slate-800 transition-all"
          style={{
            left: `${hoveredSchedule.x}px`,
            top: `${hoveredSchedule.y - 6}px`,
          }}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: hoveredSchedule.category.color }}
            />
            <span className="text-indigo-200">[{hoveredSchedule.category.name}]</span>
            <span className="truncate">{hoveredSchedule.item.title || hoveredSchedule.category.name}</span>
          </div>

          <div className="space-y-0.5 text-slate-300 text-[11px] pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>
                {hoveredSchedule.item.startTime} - {hoveredSchedule.item.endTime || '結束'} ({hoveredSchedule.item.durationHours}h)
              </span>
            </div>
            {hoveredSchedule.item.location && (
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{hoveredSchedule.item.location}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Week Summary Breakdown Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const hours = weekCategoryStats[cat.id] || 0;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-[11px]"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 font-medium">{cat.name}</span>
                <span className="font-bold text-slate-900">{hours}h</span>
              </div>
            );
          })}
        </div>

        <div className="text-xs font-semibold text-slate-600">
          本週合計：<span className="text-slate-900 font-bold">{totalWeeklyHours}h</span> ({totalWeeklyCount} 筆)
        </div>
      </div>
    </div>
  );
};
