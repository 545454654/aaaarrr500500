// Dual-Tone Multi-Frequency (DTMF) Sound Generator
// Standard telephone keypad frequency matrix
const DTMF_FREQUENCIES: Record<string, [number, number]> = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477],
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playDTMFTone(key: string, durationMs: number = 100) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const freqs = DTMF_FREQUENCIES[key];
    if (!freqs) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freqs[0], now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freqs[1], now);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + durationMs / 1000);
    osc2.stop(now + durationMs / 1000);
  } catch {
    // Audio may be blocked by browser policy until first click, ignore silently
  }
}

export function playSuccessTone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.00, now + 0.12); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // ignore
  }
}

export function playPhoneRing(): () => void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return () => {};

    let isPlaying = true;
    let timerId: NodeJS.Timeout | null = null;

    const playRingCycle = () => {
      if (!isPlaying || !ctx) return;
      const now = ctx.currentTime;

      // Ring burst (dual tone: 440Hz + 480Hz US standard or 400Hz + 450Hz Euro standard)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(425, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(475, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.setValueAtTime(0.06, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);

      timerId = setTimeout(playRingCycle, 3200);
    };

    playRingCycle();

    return () => {
      isPlaying = false;
      if (timerId) clearTimeout(timerId);
    };
  } catch {
    return () => {};
  }
}

export function playCallEndTone() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Busy / disconnect tone: 3 short beeps
    [0, 0.25, 0.5].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(425, now + offset);
      gain.gain.setValueAtTime(0.08, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.15);
    });
  } catch {
    // ignore
  }
}

export function playNotificationChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Triple chime for Vodafone Cash notification
    [0, 0.08, 0.18].forEach((timeOffset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqs[idx], now + timeOffset);
      
      gain.gain.setValueAtTime(0.1, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.2);
    });
  } catch {
    // ignore
  }
}




