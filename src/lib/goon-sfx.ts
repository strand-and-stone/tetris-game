/** Play SFX: key clacks stay synthesized; slams and moans use generated WAV bytes. */

export type ClackKind = "key" | "space" | "enter";
export type SplurtKind = "drip" | "gush" | "burst";

const SPLAT_URLS = [
  "/sfx/splat-1.wav",
  "/sfx/splat-2.wav",
  "/sfx/splat-3.wav",
  "/sfx/splat-4.wav",
  "/sfx/splat-5.mp3",
  "/sfx/splat-6.mp3",
];
const DUMP_URLS = ["/sfx/dump-1.wav", "/sfx/dump-2.wav", "/sfx/dump-3.wav"];
const MOAN_URLS = [
  "/sfx/moan-1.wav",
  "/sfx/moan-2.wav",
  "/sfx/moan-3.wav",
  "/sfx/moan-4.wav",
  "/sfx/moan-5.wav",
  "/sfx/moan-6.mp3",
  "/sfx/moan-7.mp3",
];
const WHOOSH_URLS = ["/sfx/whoosh-1.wav", "/sfx/whoosh-2.wav"];
const AIM_DOOR_URL = "/sfx/door-aim.mp3";
const LAUGH_URLS = ["/sfx/laugh-1.mp3", "/sfx/laugh-2.mp3", "/sfx/laugh-3.mp3"];
const EWW_URLS = ["/sfx/eww.mp3"];

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let muted = false;
let heated = false;
let moanUntil = 0;
let slamUntil = 0;
let whooshUntil = 0;
let preloadStarted = false;
let aimDoor: AudioBuffer | null = null;
let aimDoorLoading: Promise<AudioBuffer | null> | null = null;
const MASTER = 0.62;

const banks: Record<"splat" | "dump" | "moan" | "whoosh" | "laugh" | "eww", AudioBuffer[]> = {
  splat: [],
  dump: [],
  moan: [],
  whoosh: [],
  laugh: [],
  eww: [],
};

function chance(base: number): number {
  return heated ? Math.min(0.94, base * 1.7) : base;
}

function now(): number {
  return ctx?.currentTime ?? 0;
}

function makeNoise(ac: AudioContext): AudioBuffer {
  const seconds = 1.4;
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.72 + white * 0.28;
    data[i] = last;
  }
  return buffer;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (document.hidden) return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    noise = makeNoise(ctx);
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function canPlay(): AudioContext | null {
  if (muted) return null;
  return getCtx();
}

function noiseSource(ac: AudioContext, dest: AudioNode, start: number, offset = 0): AudioBufferSourceNode {
  const src = ac.createBufferSource();
  src.buffer = noise ?? makeNoise(ac);
  src.loop = true;
  src.connect(dest);
  src.start(start, offset);
  return src;
}

function pickBuf(list: AudioBuffer[]): AudioBuffer | null {
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)] ?? null;
}

function playBuffer(
  ac: AudioContext,
  buffer: AudioBuffer,
  volume: number,
  when = 0,
  rate = 1,
): void {
  const src = ac.createBufferSource();
  src.buffer = buffer;
  src.playbackRate.value = rate;
  const gain = ac.createGain();
  gain.gain.value = volume * MASTER;
  src.connect(gain);
  gain.connect(ac.destination);
  src.start(ac.currentTime + when);
}

async function decodeBank(ac: AudioContext, urls: string[]): Promise<AudioBuffer[]> {
  const loaded: AudioBuffer[] = [];
  await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const raw = await res.arrayBuffer();
        const decoded = await ac.decodeAudioData(raw.slice(0));
        loaded.push(decoded);
      } catch {
        // Keep synth fallback if a clip fails.
      }
    }),
  );
  return loaded;
}

function loadAimDoor(ac: AudioContext): Promise<AudioBuffer | null> {
  if (aimDoor) return Promise.resolve(aimDoor);
  if (aimDoorLoading) return aimDoorLoading;
  aimDoorLoading = (async () => {
    try {
      const res = await fetch(AIM_DOOR_URL);
      if (!res.ok) return null;
      const decoded = await ac.decodeAudioData((await res.arrayBuffer()).slice(0));
      aimDoor = decoded;
      return decoded;
    } catch {
      return null;
    }
  })();
  return aimDoorLoading;
}

function preload(): void {
  if (preloadStarted) return;
  const ac = getCtx();
  if (!ac) return;
  preloadStarted = true;
  void (async () => {
    const [splat, dump, moan, whoosh, laugh, eww] = await Promise.all([
      decodeBank(ac, SPLAT_URLS),
      decodeBank(ac, DUMP_URLS),
      decodeBank(ac, MOAN_URLS),
      decodeBank(ac, WHOOSH_URLS),
      decodeBank(ac, LAUGH_URLS),
      decodeBank(ac, EWW_URLS),
      loadAimDoor(ac),
    ]);
    banks.splat = splat;
    banks.dump = dump;
    banks.moan = moan;
    banks.whoosh = whoosh;
    banks.laugh = laugh;
    banks.eww = eww;
  })();
}

export function unlockSfx(): void {
  const ac = getCtx();
  if (ac && ac.state === "suspended") void ac.resume();
  if (ac) void loadAimDoor(ac);
  preload();
}

export function setMuted(next: boolean): void {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("edge-stack-sfx", next ? "off" : "on");
  }
}

export function readMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("edge-stack-sfx") === "off";
}

export function setHeated(next: boolean): void {
  heated = next;
}

export function isHeated(): boolean {
  return heated;
}

/** Mechanical key switch: plastic click + short thock. */
export function playClack(kind: ClackKind = "key", repeat = false): void {
  const ac = canPlay();
  if (!ac) return;

  const t = ac.currentTime;
  const jitter = 0.86 + Math.random() * 0.28;
  const vol = (repeat ? 0.42 : 1) * (kind === "space" ? 1.15 : kind === "enter" ? 1.05 : 1);

  const thock = ac.createOscillator();
  thock.type = "triangle";
  const thockHz = (kind === "space" ? 148 : kind === "enter" ? 170 : 198) * jitter;
  thock.frequency.setValueAtTime(thockHz, t);
  thock.frequency.exponentialRampToValueAtTime(Math.max(60, thockHz * 0.42), t + 0.038);

  const thockGain = ac.createGain();
  thockGain.gain.setValueAtTime(0.0001, t);
  thockGain.gain.exponentialRampToValueAtTime(0.2 * vol * MASTER, t + 0.004);
  thockGain.gain.exponentialRampToValueAtTime(0.0001, t + (kind === "space" ? 0.07 : 0.046));

  const click = ac.createOscillator();
  click.type = "square";
  click.frequency.setValueAtTime((kind === "space" ? 2100 : 2650) * jitter, t);

  const clickFilter = ac.createBiquadFilter();
  clickFilter.type = "highpass";
  clickFilter.frequency.value = 1400;

  const clickGain = ac.createGain();
  clickGain.gain.setValueAtTime(0.0001, t);
  clickGain.gain.exponentialRampToValueAtTime(0.055 * vol * MASTER, t + 0.0015);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.014);

  const grain = ac.createBiquadFilter();
  grain.type = "bandpass";
  grain.frequency.value = 3200 * jitter;
  grain.Q.value = 1.6;

  const grainGain = ac.createGain();
  grainGain.gain.setValueAtTime(0.0001, t);
  grainGain.gain.exponentialRampToValueAtTime(0.09 * vol * MASTER, t + 0.002);
  grainGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

  const src = noiseSource(ac, grain, t, Math.random() * 0.4);
  grain.connect(grainGain);
  grainGain.connect(ac.destination);

  thock.connect(thockGain);
  thockGain.connect(ac.destination);
  click.connect(clickFilter);
  clickFilter.connect(clickGain);
  clickGain.connect(ac.destination);

  thock.start(t);
  click.start(t);
  thock.stop(t + 0.08);
  click.stop(t + 0.02);
  src.stop(t + 0.03);
}

function synthMoan(ac: AudioContext): void {
  const t = ac.currentTime;
  const flavor = Math.floor(Math.random() * 4);
  const base = [310, 285, 340, 265][flavor]!;
  const dur = [0.45, 0.64, 0.88, 0.54][flavor]!;
  const peak = [0.18, 0.2, 0.22, 0.19][flavor]! * MASTER;
  moanUntil = t + dur + 0.12;

  const body = ac.createOscillator();
  body.type = "sine";
  body.frequency.setValueAtTime(base, t);
  const glide = flavor === 2 ? base * 1.32 : flavor === 3 ? base * 0.78 : base * (0.94 + Math.random() * 0.14);
  body.frequency.linearRampToValueAtTime(glide, t + dur * 0.62);
  body.frequency.linearRampToValueAtTime(glide * 0.94, t + dur);

  const grit = ac.createOscillator();
  grit.type = "sawtooth";
  grit.frequency.setValueAtTime(base * 0.5, t);
  grit.frequency.linearRampToValueAtTime(glide * 0.5, t + dur * 0.62);

  const lfo = ac.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = flavor === 2 ? 5.1 : 4.4;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = flavor === 2 ? 10 : 7;
  lfo.connect(lfoGain);
  lfoGain.connect(body.frequency);

  const f1 = ac.createBiquadFilter();
  f1.type = "bandpass";
  f1.Q.value = 5.8;
  f1.frequency.setValueAtTime([620, 540, 820, 480][flavor]!, t);
  if (flavor === 2) f1.frequency.linearRampToValueAtTime(900, t + dur * 0.5);

  const f2 = ac.createBiquadFilter();
  f2.type = "bandpass";
  f2.Q.value = 5.0;
  f2.frequency.setValueAtTime([980, 1050, 1280, 900][flavor]!, t);

  const toneLp = ac.createBiquadFilter();
  toneLp.type = "lowpass";
  toneLp.frequency.value = flavor === 2 ? 1900 : 1500;

  const bodyGain = ac.createGain();
  bodyGain.gain.setValueAtTime(0.0001, t);
  bodyGain.gain.exponentialRampToValueAtTime(peak, t + 0.07);
  bodyGain.gain.setValueAtTime(peak * 0.86, t + dur * 0.55);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const gritGain = ac.createGain();
  gritGain.gain.setValueAtTime(0.0001, t);
  gritGain.gain.exponentialRampToValueAtTime(peak * 0.18, t + 0.08);
  gritGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const breath = ac.createBiquadFilter();
  breath.type = "bandpass";
  breath.frequency.value = 1900;
  breath.Q.value = 0.75;
  const breathGain = ac.createGain();
  breathGain.gain.setValueAtTime(0.0001, t);
  breathGain.gain.exponentialRampToValueAtTime(0.04 * MASTER, t + 0.05);
  breathGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const src = noiseSource(ac, breath, t, Math.random() * 0.5);
  breath.connect(breathGain);
  breathGain.connect(ac.destination);

  body.connect(f1);
  f1.connect(f2);
  f2.connect(toneLp);
  toneLp.connect(bodyGain);
  bodyGain.connect(ac.destination);

  grit.connect(gritGain);
  gritGain.connect(toneLp);

  body.start(t);
  grit.start(t);
  lfo.start(t);
  body.stop(t + dur + 0.02);
  grit.stop(t + dur + 0.02);
  lfo.stop(t + dur + 0.02);
  src.stop(t + dur + 0.02);
}

/** Occasional female-register moan byte. Samples first, synth fallback. */
export function playMoan(): void {
  const ac = canPlay();
  if (!ac) return;
  if (now() < moanUntil) return;

  const clip = pickBuf(banks.moan);
  if (clip) {
    const rate = 0.94 + Math.random() * 0.1;
    moanUntil = ac.currentTime + clip.duration / rate + 0.08;
    playBuffer(ac, clip, 0.42, 0, rate);
    return;
  }
  synthMoan(ac);
}

/** Wet lock: mushy splat clip, or synthesized drip if samples are still loading. */
export function playSplurt(kind: SplurtKind = "drip"): void {
  const ac = canPlay();
  if (!ac) return;

  const clip = pickBuf(banks.splat);
  if (clip) {
    const vol = kind === "burst" ? 0.2 : kind === "gush" ? 0.16 : 0.11;
    playBuffer(ac, clip, vol, 0, 0.97 + Math.random() * 0.04);
    return;
  }

  const t = ac.currentTime;
  const scale = kind === "burst" ? 1.25 : kind === "gush" ? 1 : 0.72;
  const dur = kind === "burst" ? 0.28 : kind === "gush" ? 0.22 : 0.14;

  const wet = ac.createBiquadFilter();
  wet.type = "lowpass";
  wet.Q.value = 7;
  wet.frequency.setValueAtTime(220, t);
  wet.frequency.exponentialRampToValueAtTime(380 * scale, t + 0.04);
  wet.frequency.exponentialRampToValueAtTime(120, t + dur);

  const wetGain = ac.createGain();
  wetGain.gain.setValueAtTime(0.0001, t);
  wetGain.gain.exponentialRampToValueAtTime(0.28 * scale * MASTER, t + 0.012);
  wetGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const blorp = ac.createOscillator();
  blorp.type = "sine";
  blorp.frequency.setValueAtTime(140 * scale, t);
  blorp.frequency.exponentialRampToValueAtTime(48, t + dur * 0.85);

  const blorpGain = ac.createGain();
  blorpGain.gain.setValueAtTime(0.0001, t);
  blorpGain.gain.exponentialRampToValueAtTime(0.16 * scale * MASTER, t + 0.01);
  blorpGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  const src = noiseSource(ac, wet, t, Math.random() * 0.6);
  wet.connect(wetGain);
  wetGain.connect(ac.destination);
  blorp.connect(blorpGain);
  blorpGain.connect(ac.destination);

  blorp.start(t);
  blorp.stop(t + dur + 0.02);
  src.stop(t + dur + 0.02);
}

/** Hard drop: dry plastic lock thud. No wet splat. */
export function playSlam(depth = 8): void {
  const ac = canPlay();
  if (!ac) return;
  if (ac.currentTime < slamUntil) return;
  slamUntil = ac.currentTime + 0.16;

  const dump = pickBuf(banks.dump);
  const vol = 0.22 + Math.min(0.1, depth / 100);
  if (dump) {
    playBuffer(ac, dump, vol, 0, 0.98 + Math.random() * 0.04);
    return;
  }

  const t = ac.currentTime;
  const thud = ac.createOscillator();
  thud.type = "sine";
  thud.frequency.setValueAtTime(92, t);
  thud.frequency.exponentialRampToValueAtTime(48, t + 0.07);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.14 * MASTER, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  thud.connect(gain);
  gain.connect(ac.destination);
  thud.start(t);
  thud.stop(t + 0.1);
}

/** AIM buddy-in door. Always this clip when a sesh starts. */
export function playDoor(): void {
  const ac = canPlay();
  if (!ac) return;
  if (aimDoor) {
    playBuffer(ac, aimDoor, 0.7, 0, 1);
    return;
  }
  void loadAimDoor(ac).then((clip) => {
    if (!clip || muted) return;
    const live = canPlay();
    if (!live) return;
    playBuffer(live, clip, 0.7, 0, 1);
  });
}

/** Soft air whoosh for an incoming text. Samples first, synth fallback. */
export function playWhoosh(): void {
  const ac = canPlay();
  if (!ac) return;
  if (ac.currentTime < whooshUntil) return;

  const clip = pickBuf(banks.whoosh);
  if (clip) {
    const rate = 0.9 + Math.random() * 0.18;
    whooshUntil = ac.currentTime + 1.6;
    playBuffer(ac, clip, 0.2, 0, rate);
    return;
  }

  const t = ac.currentTime;
  whooshUntil = t + 1.6;
  const air = ac.createBiquadFilter();
  air.type = "bandpass";
  air.Q.value = 0.9;
  air.frequency.setValueAtTime(2800, t);
  air.frequency.exponentialRampToValueAtTime(420, t + 0.22);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.1 * MASTER, t + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
  const src = noiseSource(ac, air, t, Math.random() * 0.4);
  air.connect(gain);
  gain.connect(ac.destination);
  src.stop(t + 0.28);
}

export function playLaugh(): void {
  const ac = canPlay();
  if (!ac) return;
  const clip = pickBuf(banks.laugh);
  if (!clip) return;
  playBuffer(ac, clip, 0.28, 0, 0.96 + Math.random() * 0.08);
}

export function playEww(): void {
  const ac = canPlay();
  if (!ac) return;
  const clip = pickBuf(banks.eww);
  if (!clip) return;
  playBuffer(ac, clip, 0.32, 0, 1);
}

/** Incoming texts stay quiet most of the time. Whoosh or a little laugh. */
export function maybeWhoosh(baseChance = 0.28): void {
  if (Math.random() >= chance(baseChance)) return;
  if (banks.laugh.length && Math.random() < 0.45) playLaugh();
  else playWhoosh();
}

export function maybeMoan(baseChance: number): void {
  if (Math.random() < chance(baseChance)) playMoan();
}

/** Double, triple, or tetris — she moans. Singles stay quiet. */
export function moanForLines(linesCleared: number): void {
  if (linesCleared >= 2) playMoan();
}

export function maybeSplurt(baseChance: number, kind: SplurtKind = "drip"): void {
  if (Math.random() < chance(baseChance)) playSplurt(kind);
}
