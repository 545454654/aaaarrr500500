import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { USSDState } from '../types';

interface USSDModalProps {
  ussd: USSDState;
  onCancel: () => void;
  onSubmit: (value: string) => void;
  onAcknowledge: () => void;
}

export const USSDModal: React.FC<USSDModalProps> = ({
  ussd,
  onCancel,
  onSubmit,
  onAcknowledge,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue('');
    if (ussd.isOpen && ussd.showInput) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [ussd.isOpen, ussd.showInput, ussd.step]);

  if (!ussd.isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && ussd.showInput) return;
    onSubmit(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      {/* Android/OneUI Realistic USSD Dialog Frame */}
      <div className="w-full max-w-sm bg-[#F3F4F6] text-zinc-900 rounded-[28px] shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header bar with Vodafone branding & title */}
        <div className="bg-[#E5E7EB] px-6 py-4 flex items-center justify-between border-b border-zinc-300/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
              Vodafone Cash
            </span>
          </div>
          <span className="text-xs font-medium text-zinc-500 font-mono">USSD Service</span>
        </div>

        {/* Content Body */}
        <div className="p-6 text-right">
          {/* Dialing / Running USSD state */}
          {ussd.status === 'dialing' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
              <h3 className="text-base font-semibold text-zinc-800">جاري تشغيل رمز USSD...</h3>
              <p className="text-xs text-zinc-500 mt-1 font-mono">{ussd.message}</p>
            </div>
          )}

          {/* Interactive Prompt / PIN state */}
          {ussd.status === 'prompt' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                    {ussd.title || 'فودافون كاش - تأكيد العملية'}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1.5 whitespace-pre-line leading-relaxed font-sans">
                    {ussd.message}
                  </p>
                </div>
              </div>

              {ussd.showInput && (
                <div className="mt-3">
                  <input
                    ref={inputRef}
                    id="input-ussd-response"
                    type={ussd.inputType === 'pin' ? 'password' : 'text'}
                    inputMode={ussd.inputType === 'pin' || ussd.inputType === 'number' ? 'numeric' : 'text'}
                    maxLength={ussd.inputType === 'pin' ? 6 : 30}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={ussd.placeholder || (ussd.inputType === 'pin' ? '•••••• (الرقم السري)' : 'اكتب هنا...')}
                    className="w-full h-12 px-4 bg-white border-2 border-zinc-300 rounded-2xl text-center font-mono text-lg tracking-widest text-zinc-900 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 shadow-inner"
                  />
                  {ussd.inputType === 'pin' && (
                    <p className="text-[11px] text-zinc-400 text-center mt-1.5 font-sans">
                      الرقم السري للمحفظة: <span className="font-mono font-bold text-zinc-700">500500</span>
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  id="btn-ussd-cancel"
                  onClick={onCancel}
                  className="flex-1 h-11 rounded-2xl text-xs font-bold text-zinc-700 bg-zinc-200/80 hover:bg-zinc-300 active:scale-98 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  id="btn-ussd-send"
                  className="flex-1 h-11 rounded-2xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-98 shadow-md shadow-red-600/20 transition-all"
                >
                  إرسال
                </button>
              </div>
            </form>
          )}

          {/* Success Message Dialog */}
          {ussd.status === 'message' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-emerald-900 leading-snug">
                    {ussd.title || 'تمت العملية بنجاح'}
                  </h3>
                  <p className="text-xs text-zinc-700 mt-2 whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded-xl border border-zinc-200">
                    {ussd.message}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="btn-ussd-ok"
                  onClick={onAcknowledge}
                  className="w-full h-11 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-md shadow-emerald-600/20 transition-all"
                >
                  موافق
                </button>
              </div>
            </div>
          )}

          {/* Error Message Dialog */}
          {ussd.status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 flex-row-reverse">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-rose-900 leading-snug">فشل تنفيذ الطلب</h3>
                  <p className="text-xs text-zinc-700 mt-2 whitespace-pre-line leading-relaxed bg-white p-3 rounded-xl border border-rose-200">
                    {ussd.message}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  id="btn-ussd-dismiss"
                  onClick={onAcknowledge}
                  className="w-full h-11 rounded-2xl text-xs font-bold text-zinc-800 bg-zinc-200 hover:bg-zinc-300 active:scale-98 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
