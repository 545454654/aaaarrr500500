import React from 'react';
import { X, Phone, MessageSquare, ArrowLeftRight, Clock, User, ShieldAlert } from 'lucide-react';
import { CallLog } from '../types';

interface CallDetailModalProps {
  callLog: CallLog | null;
  onClose: () => void;
  onCall: (phone: string, name?: string) => void;
  onTransferCash: (phone: string, name?: string) => void;
}

export const CallDetailModal: React.FC<CallDetailModalProps> = ({
  callLog,
  onClose,
  onCall,
  onTransferCash,
}) => {
  if (!callLog) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-right animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        {/* Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-zinc-400">تفاصيل جهة الاتصال</span>
        </div>

        {/* Contact Avatar & Name */}
        <div className="flex flex-col items-center py-5 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold mb-3 shadow-md">
            {callLog.contactName ? callLog.contactName.charAt(0) : <User className="w-8 h-8" />}
          </div>
          <h3 className="text-lg font-bold text-zinc-900">{callLog.contactName || callLog.phoneNumber}</h3>
          <p className="text-xs font-mono text-zinc-500 mt-0.5 dir-ltr">{callLog.phoneNumber}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onCall(callLog.phoneNumber, callLog.contactName);
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors gap-1.5"
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-semibold">اتصال</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onTransferCash(callLog.phoneNumber, callLog.contactName);
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors gap-1.5"
          >
            <ArrowLeftRight className="w-5 h-5" />
            <span className="text-xs font-semibold">تحويل كاش</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              window.open(`https://wa.me/20${callLog.phoneNumber.replace(/^0+/, '')}`, '_blank');
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors gap-1.5"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-semibold">واتساب</span>
          </button>
        </div>

        {/* Call Record metadata */}
        <div className="bg-zinc-50 rounded-2xl p-4 text-xs text-zinc-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800">{callLog.timestamp}</span>
            <div className="flex items-center gap-1">
              <span>تاريخ المكالمة:</span>
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800">
              {callLog.type === 'outgoing' ? 'صادرة' : callLog.type === 'incoming' ? 'واردة' : 'لم يرد عليها'}
            </span>
            <span>نوع المكالمة:</span>
          </div>

          {callLog.duration && (
            <div className="flex items-center justify-between">
              <span className="font-mono text-zinc-800">{callLog.duration}</span>
              <span>المدة:</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
