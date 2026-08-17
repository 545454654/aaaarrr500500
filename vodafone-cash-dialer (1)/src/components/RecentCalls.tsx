import React from 'react';
import { PhoneOutgoing, PhoneIncoming, PhoneMissed, Info } from 'lucide-react';
import { CallLog } from '../types';

interface RecentCallsProps {
  callLogs: CallLog[];
  filter: 'all' | 'missed';
  onFilterChange: (filter: 'all' | 'missed') => void;
  onSelectCall: (phone: string, name?: string) => void;
  onOpenCashTransferFor: (phone: string, name?: string) => void;
  onShowCallDetails?: (log: CallLog) => void;
}

export const RecentCalls: React.FC<RecentCallsProps> = ({
  callLogs,
  filter,
  onFilterChange,
  onSelectCall,
  onOpenCashTransferFor,
  onShowCallDetails,
}) => {
  const filteredLogs = callLogs.filter((log) => {
    if (filter === 'missed') return log.type === 'missed';
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col overflow-y-auto px-5 py-1 select-none">
      {/* Title "الحديثة" on the right */}
      <div className="pt-2 pb-1 text-right">
        <h1 className="text-[28px] font-bold text-zinc-950 tracking-tight font-sans">الحديثة</h1>
      </div>

      {/* Sub-tabs: الكل and مكالمات لم يرد عليها */}
      <div className="flex items-center justify-start gap-8 pb-3 border-b border-zinc-100/60">
        <button
          id="tab-recents-all"
          type="button"
          onClick={() => onFilterChange('all')}
          className={`relative pb-2 text-[15px] font-bold transition-colors ${
            filter === 'all' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600 font-normal'
          }`}
        >
          الكل
          {filter === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00C853] rounded-full" />
          )}
        </button>

        <button
          id="tab-recents-missed"
          type="button"
          onClick={() => onFilterChange('missed')}
          className={`relative pb-2 text-[15px] font-bold transition-colors ${
            filter === 'missed' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600 font-normal'
          }`}
        >
          مكالمات لم يرد عليها
          {filter === 'missed' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00C853] rounded-full" />
          )}
        </button>
      </div>

      {/* List of Recent Calls */}
      <div className="flex-1 space-y-0.5 pt-2 pb-2">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <p className="text-sm font-normal">لا توجد مكالمات حديثة</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isVF = log.isVodafoneCash || log.phoneNumber.startsWith('*9');

            return (
              <div
                key={log.id}
                id={`call-item-${log.id}`}
                onClick={() => onSelectCall(log.phoneNumber, log.contactName)}
                className="group w-full flex items-center justify-between py-3 px-1 hover:bg-zinc-50/70 active:bg-zinc-100 transition-colors cursor-pointer"
              >
                {/* Left Side: Info icon (i) in circle & Date timestamp (8/10, 8/6) */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowCallDetails?.(log);
                    }}
                    aria-label="تفاصيل المكالمة"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    <Info className="w-5 h-5 stroke-[1.8]" />
                  </button>

                  <span className="text-[13px] font-normal text-zinc-400 font-mono">{log.timestamp}</span>
                </div>

                {/* Right Side: Contact Name, Subtext & Call Type Arrow */}
                <div className="flex items-center justify-end gap-3.5">
                  <div className="flex flex-col items-end text-right">
                    <span className="text-[17px] font-bold text-zinc-950 leading-snug">
                      {log.contactName || log.phoneNumber}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isVF ? (
                        <span className="text-xs text-red-600 font-medium">فودافون كاش</span>
                      ) : (
                        <span className="text-xs text-zinc-400 font-normal">الجوال</span>
                      )}
                    </div>
                  </div>

                  {/* Call Icon Direction (e.g. Outgoing Arrow) */}
                  <div className="flex items-center justify-center text-zinc-400">
                    {log.type === 'outgoing' && (
                      <PhoneOutgoing className="w-4 h-4 stroke-[2.2]" />
                    )}
                    {log.type === 'incoming' && (
                      <PhoneIncoming className="w-4 h-4 text-emerald-500 stroke-[2.2]" />
                    )}
                    {log.type === 'missed' && (
                      <PhoneMissed className="w-4 h-4 text-rose-500 stroke-[2.2]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

