import React from 'react';
import { Search } from 'lucide-react';

interface TopBarProps {
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenSettings,
  onOpenSearch,
}) => {
  return (
    <div className="w-full bg-white px-5 pt-3 pb-1 flex items-center justify-between select-none">
      {/* Top Left in RTL (Hexagon with dot and Search icon matching the screenshot) */}
      <div className="flex items-center gap-4">
        {/* Hexagon icon with inner circle like Samsung/Android Phone app */}
        <button
          id="btn-top-hexagon"
          type="button"
          onClick={onOpenSettings}
          aria-label="الإعدادات والمحفظة"
          className="p-1 text-zinc-800 hover:text-zinc-900 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6 stroke-zinc-800 fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.5L20.66 7.5V17.5L12 22.5L3.34 17.5V7.5L12 2.5Z" />
            <circle cx="12" cy="12" r="2.5" className="fill-zinc-800 stroke-none" />
          </svg>
        </button>

        {/* Search icon */}
        <button
          id="btn-top-search"
          type="button"
          onClick={onOpenSearch}
          aria-label="بحث"
          className="p-1 text-zinc-800 hover:text-zinc-900 active:scale-95 transition-all"
        >
          <Search className="w-6 h-6 stroke-[2.2]" />
        </button>
      </div>

      {/* Right side is intentionally empty to match the clean phone app screenshot */}
      <div />
    </div>
  );
};

