import React from 'react';
import { Phone, Delete, MessageSquare, GripHorizontal, X } from 'lucide-react';
import { playDTMFTone } from '../utils/audio';

interface KeypadProps {
  dialInput: string;
  onNumberClick: (char: string) => void;
  onDeleteClick: () => void;
  onClearClick: () => void;
  onCallClick: () => void;
  onWhatsAppClick?: () => void;
  onToggleKeypad?: () => void;
  soundEnabled: boolean;
}

interface KeypadKey {
  main: string;
  sub: string;
  isVoicemail?: boolean;
}

const KEYS: KeypadKey[] = [
  { main: '1', sub: '', isVoicemail: true },
  { main: '2', sub: 'ABC' },
  { main: '3', sub: 'DEF' },
  { main: '4', sub: 'GHI' },
  { main: '5', sub: 'JKL' },
  { main: '6', sub: 'MNO' },
  { main: '7', sub: 'PQRS' },
  { main: '8', sub: 'TUV' },
  { main: '9', sub: 'WXYZ' },
  { main: '*', sub: '' },
  { main: '0', sub: '+' },
  { main: '#', sub: '' },
];

export const Keypad: React.FC<KeypadProps> = ({
  dialInput,
  onNumberClick,
  onDeleteClick,
  onClearClick,
  onCallClick,
  onWhatsAppClick,
  onToggleKeypad,
  soundEnabled,
}) => {
  const handleKeyPress = (main: string) => {
    if (soundEnabled) {
      playDTMFTone(main, 110);
    }
    onNumberClick(main);
  };

  return (
    <div dir="ltr" className="w-full bg-white flex flex-col items-center select-none pt-1 pb-2 px-6 border-t border-zinc-100/70">
      {/* Number Input display (Matching the coral-red '+20 10 10375025 x' in screenshot) */}
      <div className="w-full flex items-center justify-between min-h-[44px] px-2 mb-1">
        <div className="w-8" />
        <div 
          className="flex-1 text-center font-mono text-[26px] font-semibold text-[#DE4F38] tracking-wider truncate"
        >
          {dialInput ? (
            <span>{dialInput}</span>
          ) : (
            <span className="text-zinc-300 text-base font-normal font-sans" dir="rtl">اطلب رقماً أو كوداً...</span>
          )}
        </div>

        {dialInput ? (
          <button
            id="btn-dialer-delete"
            type="button"
            onClick={onDeleteClick}
            onContextMenu={(e) => {
              e.preventDefault();
              onClearClick();
            }}
            aria-label="مسح الرقم"
            className="w-8 h-8 flex items-center justify-center text-[#DE4F38] hover:bg-red-50 active:scale-90 transition-all rounded-full"
          >
            <Delete className="w-5 h-5 rotate-180 fill-[#DE4F38]/20" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* 3x4 Grid of Dialpad buttons (1 on Left, 2 in Middle, 3 on Right) */}
      <div className="w-full max-w-[340px] grid grid-cols-3 gap-y-2.5 gap-x-6 my-1">
        {KEYS.map((key) => (
          <button
            key={key.main}
            id={`btn-key-${key.main === '*' ? 'star' : key.main === '#' ? 'hash' : key.main}`}
            type="button"
            onClick={() => handleKeyPress(key.main)}
            className="group flex flex-col items-center justify-center h-[54px] w-full rounded-2xl active:bg-zinc-100 hover:bg-zinc-50/70 transition-colors"
          >
            <span className="text-[28px] font-normal text-zinc-900 leading-none">
              {key.main}
            </span>
            {key.isVoicemail ? (
              <span className="text-xs text-zinc-400 mt-0.5 leading-none">➿</span>
            ) : (
              <span className="text-[10px] font-medium text-zinc-400 mt-0.5 tracking-wider uppercase leading-none">
                {key.sub || <span className="opacity-0">.</span>}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Action Row: Keypad toggle on left, WhatsApp quick icon in middle, Call button on right */}
      <div className="w-full max-w-[340px] flex items-center justify-between px-2 mt-2.5">
        {/* Toggle Keypad visibility / minimize (6 dots on left) */}
        <button
          id="btn-toggle-keypad-dots"
          type="button"
          onClick={onToggleKeypad}
          aria-label="إخفاء لوحة الأرقام"
          className="w-11 h-11 flex items-center justify-center rounded-full text-zinc-800 hover:bg-zinc-100 active:scale-95 transition-all"
        >
          <GripHorizontal className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* WhatsApp Quick Action (Circle button in middle) */}
        <button
          id="btn-whatsapp-action"
          type="button"
          onClick={onWhatsAppClick}
          aria-label="مراسلة عبر واتساب"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] active:scale-95 shadow-sm transition-all"
        >
          <MessageSquare className="w-5 h-5 fill-current stroke-none" />
        </button>

        {/* Call Button (Green pill on right matching screenshot) */}
        <button
          id="btn-make-call"
          type="button"
          onClick={onCallClick}
          aria-label="اتصال أو تشغيل USSD"
          className="flex-1 max-w-[155px] h-12 flex items-center justify-center rounded-full bg-[#00C853] hover:bg-[#00B248] text-white active:scale-95 shadow-md shadow-emerald-500/20 transition-all"
        >
          <Phone className="w-5 h-5 fill-current stroke-none" />
        </button>
      </div>
    </div>
  );
};

