import React from 'react';
import { Clock, Users, Grid } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'recents' | 'contacts';
  onTabChange: (tab: 'recents' | 'contacts') => void;
  showKeypad: boolean;
  onToggleKeypad: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  showKeypad,
  onToggleKeypad,
}) => {
  return (
    <div className="w-full bg-white select-none border-t border-zinc-100 shadow-xs">
      {/* 2 Main tabs: جهات الاتصال and الحديثة */}
      <div className="flex items-center justify-around py-1.5 px-6">
        {/* جهات الاتصال (Contacts) */}
        <button
          id="nav-tab-contacts"
          type="button"
          onClick={() => onTabChange('contacts')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'contacts' ? 'text-[#00C853]' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              activeTab === 'contacts' ? 'bg-[#00C853]/15 text-[#00C853]' : 'text-zinc-400'
            }`}
          >
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium">جهات الاتصال</span>
        </button>

        {/* Floating Dialpad button if keypad is hidden */}
        {!showKeypad && (
          <button
            id="nav-floating-dialpad"
            type="button"
            onClick={onToggleKeypad}
            aria-label="إظهار لوحة الأرقام"
            className="w-12 h-12 -mt-5 rounded-full bg-[#00C853] text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Grid className="w-5 h-5" />
          </button>
        )}

        {/* الحديثة (Recents) */}
        <button
          id="nav-tab-recents"
          type="button"
          onClick={() => onTabChange('recents')}
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            activeTab === 'recents' ? 'text-[#00C853]' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              activeTab === 'recents' ? 'bg-[#00C853] text-white' : 'text-zinc-400'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold">الحديثة</span>
        </button>
      </div>

      {/* Android System Navigation Bar (≡   ○   ◁) */}
      <div className="w-full bg-white flex items-center justify-around py-1.5 px-12 text-zinc-400 border-t border-zinc-50">
        <span className="text-lg font-mono cursor-pointer hover:text-zinc-700">≡</span>
        <div className="w-3.5 h-3.5 rounded-full border-2 border-zinc-400 cursor-pointer hover:border-zinc-700" />
        <span className="text-xs font-mono cursor-pointer hover:text-zinc-700">◁</span>
      </div>
    </div>
  );
};
