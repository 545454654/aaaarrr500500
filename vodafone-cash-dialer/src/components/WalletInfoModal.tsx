import React, { useState } from 'react';
import {
  Wallet,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  KeyRound,
  PlusCircle,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { Transaction } from '../types';

interface WalletInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions: Transaction[];
  pin: string;
  onChangePin: (newPin: string) => void;
  onAddFunds: (amount: number) => void;
  onSelectQuickCode: (code: string) => void;
}

export const WalletInfoModal: React.FC<WalletInfoModalProps> = ({
  isOpen,
  onClose,
  balance,
  transactions,
  pin,
  onChangePin,
  onAddFunds,
  onSelectQuickCode,
}) => {
  const [depositAmount, setDepositAmount] = useState<string>('10');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);
  const [newPinVal, setNewPinVal] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!isNaN(amt) && amt > 0) {
      onAddFunds(amt);
      setDepositSuccessMsg(`تم إيداع مبلغ ${amt.toLocaleString()} ج.م بنجاح في المحفظة!`);
      setTimeout(() => setDepositSuccessMsg(null), 3000);
      setDepositAmount('');
    }
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinVal.length >= 4 && /^\d+$/.test(newPinVal)) {
      onChangePin(newPinVal);
      setPinSuccessMsg(`تم تغيير الرقم السري إلى ${newPinVal} بنجاح!`);
      setTimeout(() => setPinSuccessMsg(null), 3000);
      setNewPinVal('');
    }
  };

  const copyToDialer = (code: string) => {
    onSelectQuickCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 border border-zinc-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#DE4F38] text-white flex items-center justify-between shadow-sm">
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-sans">إعدادات محفظة فودافون كاش</span>
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-right">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white rounded-2xl p-5 relative overflow-hidden shadow-md border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span className="bg-[#DE4F38] text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                Vodafone Cash
              </span>
              <span className="font-semibold text-zinc-300">رصيد المحفظة الحالي</span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline justify-end gap-1.5 font-mono py-1">
              <span className="text-sm font-normal text-zinc-400">ج.م</span>
              <span className="text-white">{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/90 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">الحالة:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  نشطة ومؤكدة
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {showPin ? pin : '••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-zinc-400 hover:text-zinc-200 p-0.5"
                  title="إظهار / إخفاء الرقم السري"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <KeyRound className="w-3.5 h-3.5 text-red-400" />
                <span className="text-zinc-400">الرقم السري:</span>
              </div>
            </div>
          </div>

          {/* Deposit Section (إيداع رصيد بالمحفظة) */}
          <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">أدخل أي مبلغ لإضافته فوراً إلى رصيدك</span>
              <div className="flex items-center gap-1.5 text-zinc-900 text-xs font-bold">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>إيداع رصيد في المحفظة (Deposit)</span>
              </div>
            </div>

            {depositSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{depositSuccessMsg}</span>
              </div>
            )}

            {/* Quick amount buttons */}
            <div className="flex items-center gap-1.5 justify-end flex-wrap">
              {[10, 50, 100, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt.toString())}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    depositAmount === amt.toString()
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:border-emerald-500'
                  }`}
                >
                  +{amt} ج.م
                </button>
              ))}
            </div>

            {/* Deposit Form */}
            <form onSubmit={handleDepositSubmit} className="flex items-center gap-2">
              <button
                type="submit"
                id="btn-submit-deposit"
                className="px-4 h-10 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إيداع الآن</span>
              </button>

              <div className="relative flex-1">
                <input
                  id="input-deposit-amount"
                  type="number"
                  min="1"
                  step="any"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="مثال: 10"
                  className="w-full h-10 px-3 bg-white border border-zinc-300 rounded-xl text-right font-mono text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-zinc-900"
                />
                <span className="absolute left-3 top-2.5 text-xs text-zinc-400 font-sans pointer-events-none">
                  ج.م
                </span>
              </div>
            </form>
          </div>

          {/* Change Password (تغيير الرقم السري) */}
          <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">الرقم السري لتأكيد المعاملات (PIN)</span>
              <div className="flex items-center gap-1.5 text-zinc-900 text-xs font-bold">
                <KeyRound className="w-4 h-4 text-[#DE4F38]" />
                <span>تغيير الرقم السري (Change Password)</span>
              </div>
            </div>

            {pinSuccessMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{pinSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSavePin} className="space-y-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  id="btn-save-new-pin"
                  className="px-4 h-10 bg-[#DE4F38] hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm"
                >
                  حفظ الرقم السري
                </button>

                <input
                  id="input-change-password"
                  type="text"
                  maxLength={6}
                  value={newPinVal}
                  onChange={(e) => setNewPinVal(e.target.value)}
                  placeholder="أدخل الرقم السري الجديد (مثال: 500500)"
                  className="flex-1 h-10 px-3 bg-white border border-zinc-300 rounded-xl text-center font-mono text-sm font-bold tracking-widest outline-none focus:border-[#DE4F38] focus:ring-1 focus:ring-[#DE4F38] text-zinc-900"
                />
              </div>
              <p className="text-[11px] text-zinc-400 text-right">
                الرقم السري الحالي هو: <span className="font-mono font-bold text-zinc-800">{pin}</span>
              </p>
            </form>
          </div>

          {/* Quick USSD Codes section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">اضغط لنسخ الكود وتجربته فوراً</span>
              <div className="flex items-center gap-1 text-zinc-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>أكواد فودافون كاش السريعة</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {[
                {
                  code: '*9*7*01010375025*100#',
                  label: 'تحويل 100 ج.م إلى ميرا عمري',
                  desc: 'كود تحويل الأموال المباشر',
                },
                {
                  code: '*9*7*01098688815*500#',
                  label: 'تحويل 500 ج.م إلى بابا',
                  desc: 'كود تحويل سريع',
                },
                {
                  code: '*9#',
                  label: 'قائمة فودافون كاش الرئيسية التفاعلية',
                  desc: 'فتح القائمة الرئيسية للخدمات',
                },
                {
                  code: '*9*13#',
                  label: 'الاستعلام عن الرصيد المتبقي',
                  desc: 'معرفة الرصيد بإدخال الرقم السري',
                },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => copyToDialer(item.code)}
                  className="w-full bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200 rounded-xl p-2.5 flex items-center justify-between text-right transition-all group"
                >
                  <div className="p-1.5 text-zinc-400 group-hover:text-red-600 transition-colors">
                    {copiedCode === item.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-zinc-900">{item.label}</span>
                    <span className="text-[11px] font-mono text-red-600 font-medium dir-ltr" style={{ direction: 'ltr' }}>
                      {item.code}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transactions Log */}
          <div>
            <h4 className="text-xs font-bold text-zinc-800 mb-2">سجل العمليات والإيداعات</h4>
            <div className="space-y-1.5">
              {transactions.length === 0 ? (
                <div className="text-center py-5 text-zinc-400 text-xs bg-zinc-50 rounded-xl border border-zinc-200">
                  لا توجد معاملات سابقة بعد
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-white border border-zinc-200 rounded-xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex flex-col items-start font-mono">
                      <span
                        className={`font-bold ${
                          tx.type === 'transfer_out' ? 'text-red-600' : 'text-emerald-600'
                        }`}
                      >
                        {tx.type === 'transfer_out' ? '-' : '+'}
                        {tx.amount.toFixed(2)} ج.م
                      </span>
                      {tx.fee > 0 && (
                        <span className="text-[10px] text-zinc-400">رسوم: {tx.fee} ج.م</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold text-zinc-900">
                          {tx.type === 'transfer_out'
                            ? `تحويل إلى ${tx.recipientName || tx.recipientNumber}`
                            : `إيداع / استلام (${tx.senderNumber || 'المحفظة'})`}
                        </span>
                        <span className="text-[10px] text-zinc-400">{tx.timestamp}</span>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          tx.type === 'transfer_out'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {tx.type === 'transfer_out' ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

