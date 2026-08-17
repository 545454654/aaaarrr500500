import React from 'react';
import { X, Sparkles, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface QuickHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCode: (code: string) => void;
}

export const QuickHelpModal: React.FC<QuickHelpModalProps> = ({
  isOpen,
  onClose,
  onSelectCode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-zinc-900 text-white flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">طريقة تحويل فودافون كاش</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-right">
          {/* Main formula box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-right space-y-2">
            <span className="text-xs font-bold text-red-700 block">الكود المباشر لتحويل الأموال:</span>
            <div className="bg-white p-3 rounded-xl border border-red-200 font-mono text-center text-lg font-bold text-red-600 dir-ltr shadow-xs">
              *9*7*رقم_المستلم*المبلغ#
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              مثال: اطلب <span className="font-mono font-bold text-red-600 dir-ltr inline-block">*9*7*01010375025*250#</span> ثم اضغط زر الاتصال الأخضر، وسيطلب منك النظام إدخال الرقم السري (PIN) لتأكيد العملية فوراً!
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold text-zinc-800">خطوات التحويل:</h4>
            
            <div className="flex items-start gap-3 flex-row-reverse bg-zinc-50 p-3 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">كتابة الكود والطلب</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  اكتب *9*7* ثم رقم الموبايل ثم * ثم المبلغ ثم # واضغط اتصال.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 flex-row-reverse bg-zinc-50 p-3 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">تأكيد العملية بالرقم السري (PIN)</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  ستظهر نافذة USSD تطلب الرقم السري المكون من 6 أرقام (الافتراضي: 123456).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 flex-row-reverse bg-zinc-50 p-3 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">اكتمال التحويل واستلام الـ SMS</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  يتم خصم المبلغ وتصلك رسالة نصية قصيرة تفصيلية بتفاصيل المعاملة والرصيد المتبقي.
                </p>
              </div>
            </div>
          </div>

          {/* Direct Try Buttons */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-zinc-800 mb-2">جرب نموذج جاهز بنقرة واحدة:</h4>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectCode('*9*7*01010375025*100#');
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-zinc-100 hover:bg-red-50 hover:border-red-200 border border-zinc-200 flex items-center justify-between text-right transition-colors"
              >
                <span className="text-xs text-red-600 font-bold">تجربة الآن</span>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-zinc-900">تحويل 100 ج.م إلى ميرا عمري</span>
                  <span className="text-[11px] font-mono text-zinc-500 dir-ltr">*9*7*01010375025*100#</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCode('*9#');
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-zinc-100 hover:bg-red-50 hover:border-red-200 border border-zinc-200 flex items-center justify-between text-right transition-colors"
              >
                <span className="text-xs text-red-600 font-bold">تجربة القائمة</span>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-zinc-900">القائمة الرئيسية التفاعلية</span>
                  <span className="text-[11px] font-mono text-zinc-500 dir-ltr">*9#</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
