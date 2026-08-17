import React from 'react';
import { MessageSquare, X, CheckCheck, Clock } from 'lucide-react';
import { SMSMessage } from '../types';

interface SMSNotificationProps {
  notification: SMSMessage | null;
  onDismiss: () => void;
  onOpenInbox: () => void;
}

export const SMSNotification: React.FC<SMSNotificationProps> = ({
  notification,
  onDismiss,
  onOpenInbox,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto select-none animate-in slide-in-from-top-6 duration-300">
      <div
        onClick={onOpenInbox}
        className="w-full bg-zinc-900/95 text-white p-3.5 rounded-2xl shadow-xl backdrop-blur-md border border-zinc-700/50 flex items-start gap-3 cursor-pointer hover:bg-zinc-900 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <MessageSquare className="w-5 h-5 fill-current" />
        </div>

        <div className="flex-1 text-right min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-mono">{notification.timestamp}</span>
            <span className="text-xs font-bold text-red-400">{notification.sender}</span>
          </div>
          <p className="text-xs text-zinc-200 mt-1 line-clamp-2 leading-relaxed">
            {notification.body}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="إغلاق الإشعار"
          className="text-zinc-400 hover:text-zinc-200 p-1 -mr-1 -mt-1 rounded-full hover:bg-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface SMSInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: SMSMessage[];
}

export const SMSInboxModal: React.FC<SMSInboxModalProps> = ({
  isOpen,
  onClose,
  messages,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-zinc-900">رسائل المعاملات (VF-Cash)</span>
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-sm">
              لا توجد رسائل واردة حالياً
            </div>
          ) : (
            messages.map((sms) => (
              <div
                key={sms.id}
                className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 text-right space-y-2 hover:border-red-200 transition-colors"
              >
                <div className="flex items-center justify-between text-xs border-b border-zinc-200/60 pb-2">
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Clock className="w-3 h-3" />
                    <span>{sms.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-red-600">{sms.sender}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>

                <p className="text-xs text-zinc-800 leading-relaxed font-sans select-text">
                  {sms.body}
                </p>

                {sms.transactionRef && (
                  <div className="pt-1 flex justify-start">
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-mono">
                      Ref: {sms.transactionRef}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
