// Web Audio API synthesized audio: cute quacks and joyous victory celebration sounds!
// 100% offline, zero latency, works instantly across all browsers.

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

// 🦆 Cute duck quack sound
export function playQuack() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Pitch glide downward
    osc1.frequency.setValueAtTime(380, now);
    osc1.frequency.exponentialRampToValueAtTime(220, now + 0.18);

    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(260, now + 0.18);

    // Formant filter for nasal duck quack
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(3.5, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  } catch {
    // Fallback if audio is restricted
  }
}

// 🎉 Joyous Celebration / Victory Fanfare when a Wordle is solved!
export function playCelebrationSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Celebratory ascending fanfare chord progression (C5, E5, G5, C6 arpeggio with rich harmonics)
    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.14 }, // C5
      { freq: 659.25, time: 0.12, dur: 0.14 }, // E5
      { freq: 783.99, time: 0.24, dur: 0.16 }, // G5
      { freq: 1046.50, time: 0.38, dur: 0.45 }, // C6
      { freq: 1318.51, time: 0.42, dur: 0.40 }, // E6 harmonic
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.22, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });

    // Add bright chime sparkles
    const chimeTimes = [0.05, 0.15, 0.28, 0.45, 0.55];
    chimeTimes.forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500 + i * 250, now + t);

      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.08, now + t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t);
      osc.stop(now + t + 0.15);
    });
  } catch {
    // Fallback if audio is restricted
  }
}
