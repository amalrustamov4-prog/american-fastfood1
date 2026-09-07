// Web Audio API synthesizer for kitchen sound notifications
export function playKitchenNewOrderSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Play double high-pitch ding-dong chime
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(659.25, now, 0.4); // E5
    playNote(880.0, now + 0.15, 0.6); // A5
    playNote(1174.66, now + 0.35, 0.8); // D6
  } catch (e) {
    console.warn('Audio Context not allowed without user interaction:', e);
  }
}
