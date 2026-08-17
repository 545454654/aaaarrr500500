import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Grid, User, X } from 'lucide-react';
import { playPhoneRing, playCallEndTone, playDTMFTone } from '../utils/audio';

interface CallScreenProps {
  phoneNumber: string;
  contactName?: string;
  onEndCall: () => void;
}

export const CallScreen: React.FC<CallScreenProps> = ({
  phoneNumber,
  contactName,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [showInCallKeypad, setShowInCallKeypad] = useState(false);
  const [callState, setCallState] = useState<'calling' | 'connected'>('calling');

  useEffect(() => {
    // Play realistic ringback tone
    const stopRing = playPhoneRing();

    // Connect after 2.8s
    const connectTimer = setTimeout(() => {
      setCallState('connected');
      stopRing();
    }, 2800);

    return () => {
      stopRing();
      clearTimeout(connectTimer);
    };
  }, []);

  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const handleEndCall = () => {
    playCallEndTone();
    onEndCall();
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white flex flex-col justify-between p-6 select-none animate-in fade-in duration-200">
      {/* Top Details */}
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-3xl font-bold mb-4 shadow-2xl relative">
          {contactName ? (
            <span className="text-3xl text-zinc-100">{contactName.charAt(0)}</span>
          ) : (
            <User className="w-12 h-12 text-zinc-400" />
          )}
          {callState === 'calling' && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">
          {contactName || phoneNumber}
        </h2>
        <p className="text-sm font-mono text-zinc-400 dir-ltr mb-3" style={{ direction: 'ltr' }}>{phoneNumber}</p>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-3.5 py-1 rounded-full font-medium ${
            callState === 'calling' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {callState === 'calling' ? 'جاري الاتصال...' : formatTimer(seconds)}
          </span>
        </div>
      </div>

      {/* In-call keypad popup */}
      {showInCallKeypad && (
        <div className="bg-zinc-800/95 backdrop-blur-md rounded-3xl p-4 border border-zinc-700 shadow-2xl max-w-xs mx-auto w-full animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-700">
            <button
              type="button"
              onClick={() => setShowInCallKeypad(false)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-xs text-zinc-300 font-semibold">لوحة المفاتيح أثناء المكالمة</span>
          </div>
          <div className="grid grid-cols-3 gap-2" dir="ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => playDTMFTone(k, 120)}
                className="h-10 bg-zinc-700 hover:bg-zinc-600 active:scale-95 rounded-xl font-mono text-lg font-bold text-white transition-all"
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Control Buttons Grid */}
      <div className="w-full max-w-xs mx-auto space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Mute */}
          <button
            type="button"
            id="btn-call-mute"
            onClick={() => setIsMuted(!isMuted)}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-white text-zinc-900 shadow-lg' : 'bg-zinc-800/90 text-white hover:bg-zinc-700'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">
              {isMuted ? 'مكتوم' : 'كتم الصوت'}
            </span>
          </button>

          {/* Keypad */}
          <button
            type="button"
            id="btn-call-keypad"
            onClick={() => setShowInCallKeypad(!showInCallKeypad)}
            className="flex flex-col items-center gap-1.5"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              showInCallKeypad ? 'bg-white text-zinc-900 shadow-lg' : 'bg-zinc-800/90 text-white hover:bg-zinc-700'
            }`}>
              <Grid className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">المفاتيح</span>
          </button>

          {/* Speaker */}
          <button
            type="button"
            id="btn-call-speaker"
            onClick={() => setIsSpeaker(!isSpeaker)}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isSpeaker ? 'bg-white text-zinc-900 shadow-lg' : 'bg-zinc-800/90 text-white hover:bg-zinc-700'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-6 h-6 text-emerald-600" /> : <VolumeX className="w-6 h-6" />}
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">
              {isSpeaker ? 'مكبر الصوت' : 'مكبر الصوت'}
            </span>
          </button>
        </div>

        {/* End Call Button */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            id="btn-end-call"
            onClick={handleEndCall}
            aria-label="إنهاء المكالمة"
            className="w-16 h-16 rounded-full bg-[#DE4F38] hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 active:scale-95 transition-all"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

