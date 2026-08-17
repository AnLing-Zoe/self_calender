import React from 'react';
import { Category, ScheduleItem } from '../types';
import { parseDateKey } from '../utils/dateUtils';
import {
  X,
  Plus,
  Clock,
  MapPin,
  User,
  Edit2,
  Trash2,
  FileText,
  Calendar,
} from 'lucide-react';

interface DayDetailModalProps {
  dateKey: string | null;
  categories: Category[];
  schedules: ScheduleItem[];
  onClose: () => void;
  onAddNewForDate: (dateKey: string) => void;
  onEditSchedule: (schedule: ScheduleItem) => void;
  onDeleteSchedule: (scheduleId: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dateKey,
  categories,
  schedules,
  onClose,
  onAddNewForDate,
  onEditSchedule,
  onDeleteSchedule,
}) => {
  if (!dateKey) return null;

  const categoryMap = new Map<string, Category>();
  categories.forEach((c) => categoryMap.set(c.id, c));

  const daySchedules = schedules.filter((s) => s.date === dateKey);
  const parsedDate = parseDateKey(dateKey);
  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  const dayOfWeekName = ['日', '一', '二', '三', '四', '五', '六'][parsedDate.getDay()];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                {year} 年 {month} 月 {day} 日
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <span className="font-semibold text-indigo-600">星期{dayOfWeekName}</span>
                <span>·</span>
                <span>{daySchedules.length} 項行程</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="modal-btn-add-today"
              onClick={() => {
                onClose();
                onAddNewForDate(dateKey);
              }}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              title="新增此日行程"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="modal-btn-close"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="關閉"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Schedule List */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {daySchedules.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
              <p className="font-medium text-slate-600 text-sm">此日尚無排程</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddNewForDate(dateKey);
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增行程</span>
              </button>
            </div>
          ) : (
            daySchedules.map((schedule) => {
              const cat = categoryMap.get(schedule.categoryId) || {
                id: schedule.categoryId,
                name: '未分類',
                color: '#CBD5E1',
              };

              return (
                <div
                  key={schedule.id}
                  id={`day-schedule-card-${schedule.id}`}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 transition-all hover:border-slate-300 relative overflow-hidden"
                >
                  {/* Category color indicator */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: cat.color }}
                  />

                  {/* Top row: Category Badge & Time & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-xs font-bold text-slate-900 border border-black/10 flex items-center gap-1"
                        style={{ backgroundColor: cat.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        {cat.name}
                      </span>

                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {schedule.startTime} - {schedule.endTime || '結束'} ({schedule.durationHours}h)
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        id={`btn-edit-schedule-${schedule.id}`}
                        onClick={() => {
                          onClose();
                          onEditSchedule(schedule);
                        }}
                        title="編輯此排程"
                        className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        id={`btn-delete-schedule-${schedule.id}`}
                        onClick={() => {
                          if (window.confirm(`確定要刪除「${schedule.title || cat.name}」排程嗎？`)) {
                            onDeleteSchedule(schedule.id);
                          }
                        }}
                        title="刪除此排程"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title / Main Subject */}
                  {schedule.title && (
                    <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                      {schedule.title}
                    </h4>
                  )}

                  {/* Metadata Row: Target & Location */}
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-600 mb-2">
                    {schedule.target && (
                      <div className="flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">對象:</span>
                        <span className="text-slate-800">{schedule.target}</span>
                      </div>
                    )}

                    {schedule.location && (
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">地點:</span>
                        <span className="text-slate-800">{schedule.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Rich Text Content */}
                  {schedule.content && schedule.content !== '<p></p>' && (
                    <div className="mt-1.5 pt-2 border-t border-slate-100">
                      <div
                        className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-2 rounded-lg border border-slate-100 prose prose-slate max-w-none [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-1 [&_p:last-child]:mb-0 [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-2 [&_blockquote]:italic"
                        dangerouslySetInnerHTML={{ __html: schedule.content }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-white text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
