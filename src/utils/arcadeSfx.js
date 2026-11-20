/**
 * Lightweight Web Audio 8-bit chiptune synthesizer (muted by default).
 */
let audioCtx = null;
let sfxEnabled = false;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSfxEnabled() {
  return sfxEnabled;
}

export function setSfxEnabled(next) {
  sfxEnabled = Boolean(next);
  if (sfxEnabled) {
    getAudioContext();
  }
}

function playTone(freq, durationMs, type = "square", volume = 0.04, delayMs = 0) {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const startTime = ctx.currentTime + delayMs / 1000;
  const stopTime = startTime + durationMs / 1000;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(stopTime + 0.01);
}

function playNoiseBurst(durationMs, filterFreq = 2400, volume = 0.035, delayMs = 0) {
  if (!sfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const sampleCount = Math.max(1, Math.floor((ctx.sampleRate * durationMs) / 1000));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i += 1) {
    channel[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

  const startTime = ctx.currentTime + delayMs / 1000;
  const stopTime = startTime + durationMs / 1000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(startTime);
  source.stop(stopTime + 0.01);
}

export function playKeyBlip() {
  playTone(760, 18, "square", 0.015);
}

export function playHover() {
  playTone(620, 28, "triangle", 0.025);
}

export function playMove() {
  playTone(440, 35, "square", 0.032);
  playTone(540, 40, "square", 0.028, 28);
}

export function playSelect() {
  playTone(587.33, 45, "square", 0.04);
  playTone(880, 75, "square", 0.04, 42);
}

export function playClose() {
  playTone(440, 40, "square", 0.03);
  playTone(293.66, 65, "square", 0.03, 35);
}

export function playCoin() {
  // "Ka-" mechanical coin-slot strike & metallic clink
  playNoiseBurst(36, 2200, 0.04, 0);
  playTone(987.77, 36, "triangle", 0.042, 0);
  // "-CHING!" shimmering double-bell register ring
  playTone(1318.51, 55, "square", 0.036, 52);
  playTone(1567.98, 290, "triangle", 0.052, 102);
  playTone(2093.0, 230, "square", 0.022, 104);
  playTone(3135.96, 310, "sine", 0.026, 110);
}

export function playOverclock() {
  playTone(523.25, 65, "square", 0.045, 0);
  playTone(659.25, 65, "square", 0.045, 65);
  playTone(783.99, 65, "square", 0.045, 130);
  playTone(1046.5, 180, "square", 0.05, 195);
}
