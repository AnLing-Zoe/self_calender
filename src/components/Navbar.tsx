import React from 'react';
import { ActiveTab } from '../types';
import {
  CalendarDays,
  PlusCircle,
  Clock,
  BarChart3,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  schedulesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  schedulesCount,
}) => {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              排程管理
            </h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              type="button"
              id="tab-btn-overview"
              onClick={() => onSelectTab('overview')}
              className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>排程展示</span>
            </button>

            <button
              type="button"
              id="tab-btn-manage"
              onClick={() => onSelectTab('manage')}
              className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>排程輸入</span>
            </button>
          </nav>

          {/* Right Status Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <Clock className="w-3 h-3 text-indigo-500" />
              <span>{dateStr}</span>
            </div>

            <div className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
              {schedulesCount} 筆
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
