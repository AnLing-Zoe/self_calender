import React, { useState, useEffect } from 'react';
import { Category, ScheduleItem } from '../types';
import { RichTextEditor } from './RichTextEditor';
import {
  formatDateKey,
  calculateDurationHours,
} from '../utils/dateUtils';
import {
  Calendar,
  Clock,
  Tag,
  User,
  MapPin,
  FileText,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ScheduleFormProps {
  categories: Category[];
  editingSchedule: ScheduleItem | null;
  initialDateKey?: string | null;
  onSaveSchedule: (schedule: Omit<ScheduleItem, 'id' | 'createdAt'> & { id?: string }) => Promise<void>;
  onCancelEdit?: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  categories,
  editingSchedule,
  initialDateKey,
  onSaveSchedule,
  onCancelEdit,
}) => {
  const [date, setDate] = useState(
    editingSchedule ? editingSchedule.date : initialDateKey || formatDateKey(new Date())
  );
  const [startTime, setStartTime] = useState(editingSchedule ? editingSchedule.startTime : '09:00');
  const [endTime, setEndTime] = useState(editingSchedule ? editingSchedule.endTime : '11:30');
  const [durationHours, setDurationHours] = useState(
    editingSchedule ? editingSchedule.durationHours : 2.5
  );
  const [categoryId, setCategoryId] = useState(
    editingSchedule ? editingSchedule.categoryId : categories[0]?.id || ''
  );
  const [title, setTitle] = useState(editingSchedule ? editingSchedule.title : '');
  const [target, setTarget] = useState(editingSchedule ? editingSchedule.target : '');
  const [location, setLocation] = useState(editingSchedule ? editingSchedule.location : '');
  const [content, setContent] = useState(editingSchedule ? editingSchedule.content : '');

  const [errors, setErrors] = useState<{ date?: string; categoryId?: string }>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if editingSchedule changes
  useEffect(() => {
    if (editingSchedule) {
      setDate(editingSchedule.date);
      setStartTime(editingSchedule.startTime || '09:00');
      setEndTime(editingSchedule.endTime || '11:30');
      setDurationHours(editingSchedule.durationHours || 2.5);
      setCategoryId(editingSchedule.categoryId);
      setTitle(editingSchedule.title || '');
      setTarget(editingSchedule.target || '');
      setLocation(editingSchedule.location || '');
      setContent(editingSchedule.content || '');
    }
  }, [editingSchedule]);

  // Update categoryId if default changes and currently empty
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  // Recalculate duration when start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const calc = calculateDurationHours(startTime, endTime);
      setDurationHours(calc);
    }
  }, [startTime, endTime]);

  // Date Quick Selectors
  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    setDate(formatDateKey(d));
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { date?: string; categoryId?: string } = {};
    if (!date) {
      newErrors.date = '請選擇排程日期（必填）';
    }
    if (!categoryId) {
      newErrors.categoryId = '請選擇排程種類（必填）';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Default title if empty
    const computedTitle =
      title.trim() ||
      `${selectedCategory?.name || '行程'} - ${target || location || '日常安排'}`;

    setIsSaving(true);
    setSaveError('');
    try {
      await onSaveSchedule({
        id: editingSchedule ? editingSchedule.id : undefined,
        title: computedTitle,
        date,
        startTime,
        endTime,
        durationHours: durationHours || 1.5,
        categoryId,
        target: target.trim(),
        location: location.trim(),
        content: content.trim(),
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '排程儲存失敗');
      setIsSaving(false);
      return;
    }
    setIsSaving(false);

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);

    // Reset if not editing
    if (!editingSchedule) {
      setTitle('');
      setTarget('');
      setLocation('');
      setContent('');
    }
  };

  const handleReset = () => {
    if (window.confirm('確定要清空表單內容嗎？')) {
      setDate(formatDateKey(new Date()));
      setStartTime('09:00');
      setEndTime('11:30');
      setDurationHours(2.5);
      if (categories.length > 0) setCategoryId(categories[0].id);
      setTitle('');
      setTarget('');
      setLocation('');
      setContent('');
      setErrors({});
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-6 transition-all relative">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {editingSchedule ? '編輯排程' : '排程輸入'}
            </h2>
            <p className="text-[11px] text-slate-400">
              * 標記為必填項目
            </p>
          </div>
        </div>

        {editingSchedule && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>取消</span>
          </button>
        )}
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="my-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{editingSchedule ? '排程已更新！' : '排程已新增！'}</span>
        </div>
      )}

      {saveError && (
        <div className="my-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Row 1: Date & Time */}
        <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Date Picker */}
          <div className="min-w-0 space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>日期</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>

            <input
              type="date"
              id="input-schedule-date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
              }}
              required
              className={`block w-full min-w-0 max-w-full px-3 py-2 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                errors.date
                  ? 'border-rose-300 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white'
              }`}
            />

            {errors.date && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.date}
              </p>
            )}

            {/* Quick date presets */}
            <div className="flex items-center gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                今天
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                明天
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(2)}
                className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                後天
              </button>
            </div>
          </div>

          {/* Time Picker & Duration */}
          <div className="min-w-0 space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>時間</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {durationHours} 小時
              </span>
            </label>

            <div className="grid min-w-0 grid-cols-2 gap-2">
              <input
                type="time"
                id="input-schedule-start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="block w-full min-w-0 max-w-full px-2.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <input
                type="time"
                id="input-schedule-end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="block w-full min-w-0 max-w-full px-2.5 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Category & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Category Dropdown (必選) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>種類</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>

            <div className="relative">
              <select
                id="select-schedule-category"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: undefined }));
                }}
                required
                className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 bg-white cursor-pointer ${
                  errors.categoryId
                    ? 'border-rose-300 ring-rose-100 bg-rose-50/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Selected Category Color Dot */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs"
                  style={{ backgroundColor: selectedCategory?.color || '#93C5FD' }}
                />
              </div>
            </div>

            {errors.categoryId && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Schedule Title / 主旨 */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>排程主旨</span>
              <span className="text-slate-400 font-normal">(選填)</span>
            </label>

            <input
              type="text"
              id="input-schedule-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：演算法複習、門市早班、晚餐約會"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Row 3: Target (對象) & Location (地點) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Target 對象 */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>對象</span>
              <span className="text-slate-400 font-normal">(文字)</span>
            </label>

            <input
              type="text"
              id="input-schedule-target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="例如：自己、讀書會、店長、小美"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white placeholder:text-slate-300"
            />
          </div>

          {/* Location 地點 */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>地點</span>
              <span className="text-slate-400 font-normal">(文字)</span>
            </label>

            <input
              type="text"
              id="input-schedule-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例如：總圖書館、中山店、信義威秀"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Row 4: Rich Text Content 內容 (富文字) */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>內容備註</span>
            <span className="text-slate-400 font-normal">(富文字)</span>
          </label>

          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="詳細事項、待辦要點或備註..."
          />
        </div>

        {/* Form Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            id="btn-reset-form"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>清空</span>
          </button>

          <div className="flex items-center gap-2">
            {editingSchedule && onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
              >
                取消
              </button>
            )}

            <button
              type="submit"
              id="btn-save-schedule"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-400 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-wait"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? '同步中…' : editingSchedule ? '儲存更新' : '確認儲存'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
