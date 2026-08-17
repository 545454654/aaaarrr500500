import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, SignalHigh } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('5:37');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Format as 12h or 24h
      const displayHours = hours % 12 || 12;
      setTimeStr(`${displayHours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white text-zinc-800 px-5 pt-2 pb-1 flex items-center justify-between text-xs select-none border-b border-zinc-100 font-medium">
      {/* Right side in RTL (Time) */}
      <div className="flex items-center gap-1.5 font-semibold text-zinc-900 tracking-tight">
        <span>{timeStr}</span>
      </div>

      {/* Left side in RTL (Status Icons: Battery, WiFi, Signal, etc.) */}
      <div className="flex items-center gap-2 text-zinc-700">
        <span className="text-[10px] font-bold text-zinc-500">4G</span>
        <SignalHigh className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-semibold text-zinc-600">82%</span>
          <BatteryMedium className="w-4 h-4 text-zinc-800" />
        </div>
      </div>
    </div>
  );
};
