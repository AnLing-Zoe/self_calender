import React, { useState } from 'react';
import { Category, ScheduleItem } from '../types';
import { PRESET_COLORS } from '../utils/storage';
import {
  Palette,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  schedules: ScheduleItem[];
  onAddCategory: (name: string, color: string) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onResetDefaultCategories: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  schedules,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetDefaultCategories,
}) => {
  // Adding state
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[3]); // emerald default
  const [addError, setAddError] = useState('');

  // Editing state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const getUsageCount = (catId: string) => {
    return schedules.filter((s) => s.categoryId === catId).length;
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const handleCancelEdit = () => {
    setEditingCatId(null);
    setEditName('');
    setEditColor('');
  };

  const handleSaveEdit = (cat: Category) => {
    if (!editName.trim()) return;
    onUpdateCategory({
      ...cat,
      name: editName.trim(),
      color: editColor,
    });
    setEditingCatId(null);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setAddError('請輸入分類名稱');
      return;
    }
    // Check duplicate name
    if (categories.some((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      setAddError('已有相同名稱的分類');
      return;
    }

    onAddCategory(newCatName.trim(), newCatColor);
    setNewCatName('');
    setNewCatColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setIsAdding(false);
    setAddError('');
  };

  const handleDelete = (cat: Category) => {
    if (categories.length <= 1) {
      alert('系統至少需保留一個排程分類！');
      return;
    }

    const count = getUsageCount(cat.id);
    const msg =
      count > 0
        ? `分類「${cat.name}」目前有 ${count} 筆排程使用中。刪除後該排程將歸為未分類或需重新指定。確定要刪除嗎？`
        : `確定要刪除「${cat.name}」分類嗎？`;

    if (window.confirm(msg)) {
      onDeleteCategory(cat.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3.5 sm:p-6 transition-all mt-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-xs">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              種類與顏色管理
            </h2>
            <p className="text-[11px] text-slate-400">
              點擊可編輯名稱或更換顏色
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="btn-reset-categories"
            onClick={() => {
              if (window.confirm('確定要還原預設種類（讀書、打工、約會）嗎？')) {
                onResetDefaultCategories();
              }
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="還原預設三大種類"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">還原</span>
          </button>

          {!isAdding && (
            <button
              type="button"
              id="btn-open-add-category"
              onClick={() => setIsAdding(true)}
              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增種類</span>
            </button>
          )}
        </div>
      </div>

      {/* Add New Category Panel */}
      {isAdding && (
        <form
          onSubmit={handleAddNew}
          className="my-5 p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              新增自訂排程種類
            </span>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setAddError('');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                分類名稱 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="input-new-category-name"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (addError) setAddError('');
                }}
                placeholder="例如：運動健身、社團活動、個人專案"
                className="w-full px-3.5 py-2 rounded-xl border border-purple-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                autoFocus
              />
              {addError && <p className="text-[11px] text-rose-500 mt-1">{addError}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>代表色彩</span>
                <span className="font-mono text-[11px] text-slate-500">{newCatColor}</span>
              </label>

              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCatColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                      newCatColor === c
                        ? 'ring-2 ring-purple-600 ring-offset-2 scale-110 border-white'
                        : 'border-black/10 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}

                {/* Custom Color Input */}
                <label className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-white overflow-hidden relative">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <Palette className="w-3 h-3 text-slate-500 pointer-events-none" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setAddError('');
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 hover:bg-white text-slate-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              id="btn-confirm-add-category"
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
            >
              確定新增種類
            </button>
          </div>
        </form>
      )}

      {/* Category List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-6">
        {categories.map((cat) => {
          const isEditing = editingCatId === cat.id;
          const usageCount = getUsageCount(cat.id);

          return (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              {isEditing ? (
                // Editing View
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      編輯分類名稱
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                      <span>選擇顏色</span>
                      <span className="font-mono text-[10px] text-slate-400">{editColor}</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-1">
                      {PRESET_COLORS.slice(0, 8).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditColor(c)}
                          className={`w-5 h-5 rounded-full border transition-transform ${
                            editColor === c
                              ? 'ring-2 ring-indigo-600 ring-offset-1 scale-110 border-white'
                              : 'border-black/10'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <label className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer relative overflow-hidden">
                        <input
                          type="color"
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                        />
                        <Palette className="w-2.5 h-2.5 text-slate-400" />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="p-1 rounded-md text-slate-500 hover:bg-slate-200 text-xs transition-colors"
                      title="取消"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat)}
                      className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-indigo-700 transition-colors shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>儲存</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Display View
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* Color Circle Swatch */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs text-white"
                        style={{ backgroundColor: cat.color }}
                      >
                        <span className="font-bold text-xs">
                          {cat.name.slice(0, 1)}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-800">
                            {cat.name}
                          </h4>
                          {cat.isDefault && (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/60 px-1.5 py-0.2 rounded">
                              預設
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          共 {usageCount} 項排程使用中
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        id={`btn-edit-cat-${cat.id}`}
                        onClick={() => handleStartEdit(cat)}
                        title="編輯種類名稱與色彩"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        id={`btn-delete-cat-${cat.id}`}
                        onClick={() => handleDelete(cat)}
                        title="刪除種類"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Color Bar Preview */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">色彩碼：</span>
                      <span className="font-mono font-medium text-slate-700">{cat.color}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      預覽標籤
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
