import React, { useState, useEffect } from 'react';
import { Category, ScheduleItem, ActiveTab } from './types';
import {
  loadCategories,
  saveCategories,
  loadSchedules,
  saveSchedules,
  DEFAULT_CATEGORIES,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { StackedBarWeekChart } from './components/StackedBarWeekChart';
import { MonthCalendar } from './components/MonthCalendar';
import { DayDetailModal } from './components/DayDetailModal';
import { ScheduleForm } from './components/ScheduleForm';
import { CategoryManager } from './components/CategoryManager';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => loadSchedules());

  // Page 1 Filter State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'ALL'>('ALL');

  // Week navigation anchor for Page 1
  const [currentWeekAnchorDate, setCurrentWeekAnchorDate] = useState<Date>(new Date());

  // Day Detail Modal state
  const [selectedDateKeyForModal, setSelectedDateKeyForModal] = useState<string | null>(null);

  // Edit schedule state (for switching to Page 2 form in edit mode)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [prefilledDateKey, setPrefilledDateKey] = useState<string | null>(null);

  // Synchronize categories to localStorage
  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  // Synchronize schedules to localStorage
  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  // Handler: Add or Update Schedule
  const handleSaveSchedule = (
    data: Omit<ScheduleItem, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (data.id) {
      // Update existing
      setSchedules((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                ...data,
                id: data.id!,
                createdAt: item.createdAt,
              }
            : item
        )
      );
      setEditingSchedule(null);
    } else {
      // Create new
      const newItem: ScheduleItem = {
        ...data,
        id: `sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      setSchedules((prev) => [newItem, ...prev]);
    }
  };

  // Handler: Delete Schedule
  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  // Handler: Open edit schedule in Page 2
  const handleEditScheduleFromModal = (schedule: ScheduleItem) => {
    setEditingSchedule(schedule);
    setActiveTab('manage');
  };

  // Handler: Quick add schedule for a specific date
  const handleAddScheduleForDate = (dateKey: string) => {
    setEditingSchedule(null);
    setPrefilledDateKey(dateKey);
    setActiveTab('manage');
  };

  // Category Handlers
  const handleAddCategory = (name: string, color: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name,
      color,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Remove category
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    // If selected in filter, reset filter to ALL
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId('ALL');
    }
  };

  const handleResetDefaultCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    setSelectedCategoryId('ALL');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'overview') {
            setEditingSchedule(null);
            setPrefilledDateKey(null);
          }
        }}
        schedulesCount={schedules.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* PAGE 1: 排程展示 (OVERVIEW) */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Quick Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CategoryFilter
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
                schedules={schedules}
              />

              <button
                type="button"
                id="btn-goto-create-schedule"
                onClick={() => {
                  setEditingSchedule(null);
                  setActiveTab('manage');
                }}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <span>＋ 新增排程</span>
              </button>
            </div>

            {/* TOP BLOCK: Stacked Bar Chart for the week */}
            <section id="section-week-stacked-chart">
              <StackedBarWeekChart
                categories={categories}
                schedules={schedules}
                selectedCategoryId={selectedCategoryId}
                currentWeekAnchorDate={currentWeekAnchorDate}
                onChangeWeekAnchor={setCurrentWeekAnchorDate}
                onSelectDay={(dateKey) => setSelectedDateKeyForModal(dateKey)}
                onAddScheduleForDate={handleAddScheduleForDate}
              />
            </section>

            {/* BOTTOM BLOCK: Monthly Calendar with Colored Dots */}
            <section id="section-month-calendar">
              <MonthCalendar
                categories={categories}
                schedules={schedules}
                selectedCategoryId={selectedCategoryId}
                onSelectDay={(dateKey) => setSelectedDateKeyForModal(dateKey)}
                onAddScheduleForDate={handleAddScheduleForDate}
              />
            </section>
          </div>
        )}

        {/* PAGE 2: 排程輸入 & 種類管理 (INPUT & CATEGORY MANAGEMENT) */}
        {activeTab === 'manage' && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            {/* Form Section */}
            <section id="section-schedule-form">
              <ScheduleForm
                categories={categories}
                editingSchedule={editingSchedule}
                initialDateKey={prefilledDateKey}
                onSaveSchedule={handleSaveSchedule}
                onCancelEdit={() => {
                  setEditingSchedule(null);
                  setPrefilledDateKey(null);
                }}
              />
            </section>

            {/* Bottom Category Manager Section */}
            <section id="section-category-manager">
              <CategoryManager
                categories={categories}
                schedules={schedules}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onResetDefaultCategories={handleResetDefaultCategories}
              />
            </section>
          </div>
        )}
      </main>

      {/* Day Detail Pop-up Modal */}
      {selectedDateKeyForModal && (
        <DayDetailModal
          dateKey={selectedDateKeyForModal}
          categories={categories}
          schedules={schedules}
          onClose={() => setSelectedDateKeyForModal(null)}
          onAddNewForDate={(dateKey) => handleAddScheduleForDate(dateKey)}
          onEditSchedule={(schedule) => handleEditScheduleFromModal(schedule)}
          onDeleteSchedule={handleDeleteSchedule}
        />
      )}

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>排程管理系統 · 週排程堆疊圖與月曆管理</span>
          <span className="text-slate-400 font-medium">支援自訂分類色彩與富文字排版</span>
        </div>
      </footer>
    </div>
  );
}
