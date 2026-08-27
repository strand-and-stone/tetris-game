"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  COLS,
  PIECE_COLORS,
  PIECE_NAMES,
  ROWS,
  type Cell,
  type GameState,
  createGame,
  getShape,
  ghostY,
  hardDrop,
  placeNextSquare,
  isGhostCell,
  move,
  renderCells,
  rotate,
  softDrop,
  setSpawnOverride,
  stackPeakRow,
  startGame,
  tick,
  togglePause,
} from "@/lib/tetris";
import type { HighScore } from "@/lib/score-types";
import {
  SCORE_MILESTONES,
  type EggBurst,
  type EggCue,
  cueForBust,
  cueForClear,
  cueForGoonMode,
  cueForIdle,
  cueForLevel,
  cueForLongLock,
  cueForMilestone,
  cueForPanic,
  cueForSecret,
  cueForSquareRush,
  cueForSquareRushEnd,
  cueForStart,
  cueForSubmit,
  isNearTop,
  defaultReady,
  matchSecret,
  pickBust,
  pickPaused,
  pickReady,
  pickTicker,
  rankTag,
  setEggHeat,
} from "@/lib/gooner-eggs";
import {
  maybeMoan,
  moanForLines,
  maybeSplurt,
  playClack,
  playMoan,
  playDoor,
  maybeWhoosh,
  playEww,
  playWhoosh,
  playSlam,
  playSplurt,
  readMuted,
  setHeated,
  setMuted,
  unlockSfx,
} from "@/lib/goon-sfx";
import {
  type ChatLine,
  heatStage,
  maybeFlirt,
  threadForBust,
  threadForClear,
  threadForIntro,
  threadForPic,
} from "@/lib/sext-thread";
import {
  PERSONAS,
  pickPersona,
  readLastGirl,
  rememberGirl,
  type Persona,
} from "@/lib/personas";
import styles from "./TetrisGame.module.css";

const CHAT_LINGER = 2800;
const CHAT_OUT_LINGER = 2400;
const SQUARE_RUSH_MS = 30_000;
const SQUARE_RUSH_WARMUP_MS = 16_000;
const SQUARE_RUSH_CHECK_MS = 8_000;
const SQUARE_RUSH_COOLDOWN_MS = 75_000;
const O_CELL = 2;
const CHAT_IN_LINGER = 3000;
const CHAT_PIC_LINGER = 4500;
const BOARD_ZOOM_KEY = "edge-stack-board-zoom";
const BOARD_ZOOM_MIN = 0.64;
const BOARD_ZOOM_MAX = 1;
const BOARD_ZOOM_STEPS = [0.68, 0.84, 1] as const;

function clampBoardZoom(value: number): number {
  return Math.min(BOARD_ZOOM_MAX, Math.max(BOARD_ZOOM_MIN, Math.round(value * 100) / 100));
}

function readBoardZoom(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(BOARD_ZOOM_KEY);
  const parsed = raw ? Number(raw) : NaN;
  if (Number.isFinite(parsed)) return clampBoardZoom(parsed);
  return window.matchMedia("(max-width: 859px)").matches ? 0.84 : 1;
}

function zoomLabel(zoom: number): string {
  if (zoom <= 0.74) return "well out";
  if (zoom < 0.95) return "well mid";
  return "well in";
}

const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

type ToastItem = {
  id: number;
  text: string;
  kind: EggCue["kind"];
  side: "in" | "out";
  image?: string;
  hold: number;
};

type BurstItem = {
  id: number;
  kind: EggBurst;
  x: number;
  y: number;
  delay: number;
};

type Action =
  | "left"
  | "right"
  | "soft"
  | "hard"
  | "rotate"
  | "rotateCCW"
  | "pause"
  | "start";

type LeaderboardState = {
  scores: HighScore[];
  loading: boolean;
  error: string | null;
};

function formatScore(n: number): string {
  return n.toLocaleString("en-US");
}

function ghostCellValue(state: GameState, x: number, y: number): Cell {
  if (!state.active) return 0;
  const gy = ghostY(state);
  if (gy === null) return 0;
  for (let py = 0; py < state.active.matrix.length; py += 1) {
    for (let px = 0; px < state.active.matrix[py].length; px += 1) {
      const value = state.active.matrix[py][px];
      if (!value) continue;
      if (state.active.x + px === x && gy + py === y) return value;
    }
  }
  return 0;
}

export default function TetrisGame() {
  const [state, setState] = useState<GameState>(() => createGame());
  const [leaderboard, setLeaderboard] = useState<LeaderboardState>({
    scores: [],
    loading: true,
    error: null,
  });
  const [playerName, setPlayerName] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [bursts, setBursts] = useState<BurstItem[]>([]);
  const [flash, setFlash] = useState<"pink" | "lime" | "hot" | null>(null);
  const [pressedBtn, setPressedBtn] = useState<string | null>(null);
  const [sfxOn, setSfxOn] = useState(true);
  const [goonMode, setGoonMode] = useState(false);
  const [squareRush, setSquareRush] = useState(false);
  const [ticker, setTicker] = useState(() => pickTicker(0));
  const [readyCopy, setReadyCopy] = useState(defaultReady);
  const [pausedCopy, setPausedCopy] = useState(() => ({
    title: "Edging…",
    hint: "Breathe. Then go again.",
  }));
  const [bustCopy, setBustCopy] = useState(() => ({
    title: "You busted",
    hint: "sticky finish",
  }));
  const [girl, setGirl] = useState<Persona | null>(null);
  const [picsUnlocked, setPicsUnlocked] = useState(0);
  const [picOpen, setPicOpen] = useState<string | null>(null);
  const [boardZoom, setBoardZoom] = useState(1);

  const stateRef = useRef(state);
  const dropAcc = useRef(0);
  const lastTs = useRef<number | null>(null);
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swipeStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const boardRef = useRef<HTMLElement | null>(null);
  const prevMeta = useRef({
    lines: state.lines,
    level: state.level,
    score: state.score,
    status: state.status,
    next: state.next,
    activeId: state.active?.id ?? null,
  });
  const comboRef = useRef(0);
  const panicArmed = useRef(true);
  const pieceSpawnedAt = useRef(0);
  const eggSeq = useRef(0);
  const hardDropDepth = useRef(0);
  const toastRegionId = useId();
  const pressClearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInput = useRef(0);
  const rotateStreak = useRef(0);
  const teaseArmed = useRef(true);
  const milestoneIdx = useRef(0);
  const konamiBuf = useRef<string[]>([]);
  const secretBuf = useRef("");
  const idleArmed = useRef(true);
  const tickerIdx = useRef(0);
  const girlRef = useRef<Persona>(PERSONAS[0]!);
  const picsSent = useRef<Set<number>>(new Set());
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const pinching = useRef(false);
  const goonModeRef = useRef(false);
  const squareRushLeft = useRef(0);
  const squareRushCd = useRef(0);
  const squareRushCheck = useRef(0);
  const playElapsed = useRef(0);
  const gapFireRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (girl) girlRef.current = girl;
  }, [girl]);

  useEffect(() => {
    goonModeRef.current = goonMode;
  }, [goonMode]);

  useEffect(() => {
    const next = pickPersona(readLastGirl());
    girlRef.current = next;
    setGirl(next);
    rememberGirl(next.id);
  }, []);

  useEffect(() => {
    const off = readMuted();
    if (off) {
      setMuted(true);
      setSfxOn(false);
    }
    setBoardZoom(readBoardZoom());
  }, []);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const blockScroll = (event: TouchEvent) => {
      if (event.touches.length >= 2) event.preventDefault();
    };
    el.addEventListener("touchmove", blockScroll, { passive: false });
    return () => el.removeEventListener("touchmove", blockScroll);
  }, []);

  const writeBoardZoom = useCallback((next: number) => {
    const clamped = clampBoardZoom(next);
    setBoardZoom(clamped);
    window.localStorage.setItem(BOARD_ZOOM_KEY, String(clamped));
  }, []);

  const cycleBoardZoom = useCallback(() => {
    let i = BOARD_ZOOM_STEPS.length - 1;
    while (i > 0 && boardZoom < BOARD_ZOOM_STEPS[i]! - 0.03) i -= 1;
    const next = BOARD_ZOOM_STEPS[i === 0 ? BOARD_ZOOM_STEPS.length - 1 : i - 1] ?? 1;
    writeBoardZoom(next);
    playClack("key");
  }, [boardZoom, writeBoardZoom]);

  useEffect(() => {
    setReadyCopy(pickReady());
    const id = window.setInterval(() => {
      tickerIdx.current += 1;
      setTicker(pickTicker(tickerIdx.current));
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  const noteInput = useCallback(() => {
    lastInput.current = performance.now();
    idleArmed.current = true;
  }, []);

  const toggleSfx = useCallback(() => {
    unlockSfx();
    const next = !sfxOn;
    setSfxOn(next);
    setMuted(!next);
    playClack("enter");
  }, [sfxOn]);

  const openPic = useCallback((src: string | null) => {
    setPicOpen((prev) => (prev === src ? null : src));
    if (typeof document !== "undefined") {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  }, []);

  const pushChat = useCallback((line: ChatLine | null, kind: EggCue["kind"] = "clear", linger = CHAT_LINGER) => {
    if (!line) return;
    eggSeq.current += 1;
    const id = eggSeq.current;
    const hold = line.image ? Math.max(linger, CHAT_PIC_LINGER) : linger;
    setToasts((prev) => [
      ...prev.slice(-4),
      { id, text: line.text, kind, side: line.side, image: line.image, hold },
    ]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, hold);
    if (line.side === "in") maybeWhoosh();
  }, []);

  const pushEgg = useCallback((cue: EggCue | null, opts?: { skipText?: boolean }) => {
    if (!cue) return;
    if (!opts?.skipText) {
      eggSeq.current += 1;
      const id = eggSeq.current;
      const hold =
        cue.kind === "tetris" || cue.kind === "submit" || cue.kind === "secret"
          ? 3000
          : 2400;
      setToasts((prev) => [
        ...prev.slice(-4),
        { id, text: cue.text, kind: cue.kind, side: "in", hold },
      ]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, hold);
      maybeWhoosh(0.22);
    }

    if (cue.kind === "tetris") {
      playSplurt("gush");
    } else if (cue.kind === "combo" || cue.kind === "clear") {
      maybeSplurt(0.28, "drip");
    } else if (cue.kind === "bust") {
      playSplurt("gush");
    }

    if (cue.flash) {
      setFlash(cue.flash);
      window.setTimeout(() => setFlash(null), 280);
    }

    if (cue.bursts?.length) {
      const spawned: BurstItem[] = [];
      for (const kind of cue.bursts) {
        if (kind === "flash") continue;
        const count = kind === "squirt" ? 5 : kind === "hearts" ? 4 : 6;
        for (let i = 0; i < count; i += 1) {
          eggSeq.current += 1;
          spawned.push({
            id: eggSeq.current,
            kind,
            x: 12 + Math.random() * 76,
            y: 18 + Math.random() * 55,
            delay: Math.random() * 120,
          });
        }
      }
      if (spawned.length) {
        setBursts((prev) => [...prev.slice(-18), ...spawned]);
        window.setTimeout(() => {
          const ids = new Set(spawned.map((b) => b.id));
          setBursts((prev) => prev.filter((b) => !ids.has(b.id)));
        }, 900);
      }
    }
  }, []);

  const tripGoonMode = useCallback(() => {
    if (goonMode) {
      pushEgg(cueForSecret("goon"));
      playMoan();
      return;
    }
    setGoonMode(true);
    setHeated(true);
    setEggHeat(true);
    pushEgg(cueForGoonMode());
    playMoan();
    playSplurt("burst");
  }, [goonMode, pushEgg]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const current = stateRef.current;
      if (current.status !== "playing") return;
      if (!idleArmed.current) return;
      if (performance.now() - lastInput.current < 9000) return;
      idleArmed.current = false;
      const stage = heatStage(current.lines, current.level, goonMode);
      pushChat(maybeFlirt(girlRef.current, stage, 0.7), "idle");
    }, 2200);
    return () => window.clearInterval(id);
  }, [pushChat, goonMode]);

  const bumpPress = useCallback((key: string) => {
    setPressedBtn(key);
    if (pressClearTimer.current) clearTimeout(pressClearTimer.current);
    pressClearTimer.current = setTimeout(() => setPressedBtn(null), 120);
  }, []);

  const refreshScores = useCallback(async () => {
    setLeaderboard((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch("/api/scores", { cache: "no-store" });
      const data = (await res.json()) as { scores?: HighScore[]; error?: string };
      setLeaderboard({
        scores: data.scores ?? [],
        loading: false,
        error: res.ok ? null : data.error ?? "Leaderboard unavailable",
      });
    } catch {
      setLeaderboard({
        scores: [],
        loading: false,
        error: "Leaderboard unavailable",
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/scores", { cache: "no-store" });
        const data = (await res.json()) as { scores?: HighScore[]; error?: string };
        if (cancelled) return;
        setLeaderboard({
          scores: data.scores ?? [],
          loading: false,
          error: res.ok ? null : data.error ?? "Leaderboard unavailable",
        });
      } catch {
        if (cancelled) return;
        setLeaderboard({
          scores: [],
          loading: false,
          error: "Leaderboard unavailable",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Play-event Easter eggs (diff previous snapshot — no engine rewrite)
  useEffect(() => {
    const prev = prevMeta.current;
    const linesDelta = state.lines - prev.lines;
    const leveled = state.level > prev.level;

    if (
      state.status === "playing" &&
      (prev.status === "ready" || prev.status === "over")
    ) {
      comboRef.current = 0;
      panicArmed.current = true;
      pieceSpawnedAt.current = performance.now();
      rotateStreak.current = 0;
      teaseArmed.current = true;
      idleArmed.current = true;
      lastInput.current = performance.now();
      milestoneIdx.current = 0;
      picsSent.current = new Set();
      setPicsUnlocked(0);
      playDoor();
      pushEgg(cueForStart(), { skipText: true });
      pushChat(threadForIntro(girlRef.current), "start", CHAT_IN_LINGER);
    }

    if (linesDelta > 0) {
      comboRef.current += 1;
      const cue = cueForClear(linesDelta, comboRef.current);
      pushEgg(cue, { skipText: true });
      const stage = heatStage(state.lines, state.level, goonMode);
      const thread = threadForClear(girlRef.current, stage, linesDelta, comboRef.current);
      pushChat(thread.out, cue.kind, CHAT_OUT_LINGER);
      window.setTimeout(() => {
        pushChat(thread.inn, cue.kind, CHAT_IN_LINGER);
        moanForLines(linesDelta);
      }, 520);
      pieceSpawnedAt.current = performance.now();
      hardDropDepth.current = 0;
      rotateStreak.current = 0;
      teaseArmed.current = true;
    } else if (
      state.status === "playing" &&
      state.active &&
      state.active.id !== prev.activeId &&
      prev.activeId !== null &&
      state.next !== prev.next
    ) {
      comboRef.current = 0;
      const heldMs = performance.now() - pieceSpawnedAt.current;
      const slammed = hardDropDepth.current >= 8;
      if (hardDropDepth.current >= 12 || heldMs >= 6500) {
        pushEgg(cueForLongLock());
      }
      if (!slammed) {
        const stage = heatStage(state.lines, state.level, goonMode);
        pushChat(maybeFlirt(girlRef.current, stage, 0.22), "piece");
      }
      hardDropDepth.current = 0;
      rotateStreak.current = 0;
      teaseArmed.current = true;
      pieceSpawnedAt.current = performance.now();
    } else if (prev.activeId === null && state.active?.id) {
      pieceSpawnedAt.current = performance.now();
    }

    if (leveled) {
      const match = girlRef.current;
      const pic = match.pics.find((p) => p.atLevel === state.level);
      pushEgg(cueForLevel(state.level), { skipText: true });
      if (pic && !picsSent.current.has(state.level)) {
        picsSent.current.add(state.level);
        setPicsUnlocked(match.pics.filter((p) => p.atLevel <= state.level).length);
        const stage = heatStage(state.lines, state.level, goonMode);
        const thread = threadForPic(match, pic, stage);
        pushChat(thread.out, "level", CHAT_OUT_LINGER);
        window.setTimeout(() => {
          pushChat(thread.inn, "level", CHAT_PIC_LINGER);
          maybeMoan(0.55);
        }, 560);
      }
    }

    while (
      milestoneIdx.current < SCORE_MILESTONES.length &&
      state.score >= SCORE_MILESTONES[milestoneIdx.current]!
    ) {
      const mark = SCORE_MILESTONES[milestoneIdx.current]!;
      milestoneIdx.current += 1;
      if (state.status === "playing") pushEgg(cueForMilestone(mark));
    }

    if (state.status === "playing" && state.active) {
      const danger = isNearTop(state.board, 4);
      if (danger && panicArmed.current) {
        panicArmed.current = false;
        pushEgg(cueForPanic());
      } else if (!danger) {
        panicArmed.current = true;
      }
    }

    if (state.status === "over" && prev.status !== "over") {
      const bustCue = cueForBust();
      pushEgg(bustCue, { skipText: true });
      pushChat(
        threadForBust(girlRef.current, heatStage(state.lines, state.level, goonMode)),
        "bust",
        CHAT_IN_LINGER,
      );
      maybeMoan(0.5);
      setBustCopy(pickBust(state.score, state.level));
      comboRef.current = 0;
      squareRushLeft.current = 0;
      setSquareRush(false);
    }

    prevMeta.current = {
      lines: state.lines,
      level: state.level,
      score: state.score,
      status: state.status,
      next: state.next,
      activeId: state.active?.id ?? null,
    };
  }, [state, pushEgg, pushChat, goonMode]);

  const apply = useCallback((fn: (s: GameState) => GameState) => {
    setState((prev) => {
      const next = fn(prev);
      stateRef.current = next;
      return next;
    });
  }, []);

  const stopGapFire = useCallback(() => {
    if (!gapFireRef.current) return;
    clearInterval(gapFireRef.current);
    gapFireRef.current = null;
  }, []);

  const dumpOnce = useCallback(() => {
    const current = stateRef.current;
    if (current.status !== "playing" || squareRushLeft.current <= 0) {
      stopGapFire();
      return;
    }
    apply(placeNextSquare);
    playSlam(6);
    playClack("space", true);
  }, [apply, stopGapFire]);

  const startGapFire = useCallback(() => {
    if (gapFireRef.current) return;
    dumpOnce();
    gapFireRef.current = setInterval(dumpOnce, 36);
  }, [dumpOnce]);

  const endSquareRush = useCallback(() => {
    if (squareRushLeft.current <= 0 && !squareRush) return;
    squareRushLeft.current = 0;
    squareRushCd.current = SQUARE_RUSH_COOLDOWN_MS;
    setSquareRush(false);
    stopGapFire();
    apply((s) => setSpawnOverride(s, null));
    pushEgg(cueForSquareRushEnd(), { skipText: true });
  }, [apply, pushEgg, squareRush, stopGapFire]);

  const startSquareRush = useCallback((force = false) => {
    if (stateRef.current.status !== "playing") return;
    if (squareRushLeft.current > 0) return;
    if (!force && isNearTop(stateRef.current.board, 3)) return;
    squareRushLeft.current = SQUARE_RUSH_MS;
    setSquareRush(true);
    apply((s) => setSpawnOverride(s, "O"));
    pushEgg(cueForSquareRush());
    pushChat(
      { text: "singular squares. hold dump. plug every hole", side: "in" },
      "squareRush",
      CHAT_IN_LINGER,
    );
    maybeMoan(0.55);
    playWhoosh();
  }, [apply, pushChat, pushEgg]);

  const runAction = useCallback(
    (action: Action) => {
      const status = stateRef.current.status;
      if (
        status !== "playing" &&
        action !== "start" &&
        action !== "pause"
      ) {
        return;
      }

      switch (action) {
        case "start":
          setSubmitState("idle");
          setSubmitError(null);
          comboRef.current = 0;
          panicArmed.current = true;
          hardDropDepth.current = 0;
          rotateStreak.current = 0;
          teaseArmed.current = true;
          if (stateRef.current.status === "over") {
            const next = pickPersona(girlRef.current.id);
            girlRef.current = next;
            setGirl(next);
            rememberGirl(next.id);
          }
          picsSent.current = new Set();
          setPicsUnlocked(0);
          setPicOpen(null);
          squareRushLeft.current = 0;
          squareRushCd.current = SQUARE_RUSH_WARMUP_MS;
          squareRushCheck.current = 0;
          playElapsed.current = 0;
          stopGapFire();
          setSquareRush(false);
          apply(startGame);
          break;
        case "pause":
          if (status === "playing") {
            setPausedCopy(pickPaused());
            setPicOpen(null);
            if (repeatRef.current) {
              clearInterval(repeatRef.current);
              repeatRef.current = null;
            }
            stopGapFire();
            apply(togglePause);
          } else if (status === "paused") {
            apply(togglePause);
          }
          break;
        case "left":
          apply((s) => move(s, -1, 0));
          break;
        case "right":
          apply((s) => move(s, 1, 0));
          break;
        case "soft":
          apply(softDrop);
          break;
        case "hard": {
          if (squareRushLeft.current > 0) {
            startGapFire();
            break;
          }
          const before = stateRef.current;
          if (before.active) {
            const gy = ghostY(before);
            hardDropDepth.current =
              gy === null ? 0 : Math.max(0, gy - before.active.y);
            playSlam(hardDropDepth.current);
          }
          apply(hardDrop);
          break;
        }
        case "rotate":
        case "rotateCCW": {
          rotateStreak.current += 1;
          if (rotateStreak.current >= 5 && teaseArmed.current) {
            teaseArmed.current = false;
            const stage = heatStage(stateRef.current.lines, stateRef.current.level, goonMode);
            pushChat(maybeFlirt(girlRef.current, stage, 1), "tease");
            playEww();
          }
          apply((s) => rotate(s, action === "rotate" ? 1 : -1));
          break;
        }
        default:
          break;
      }
    },
    [apply, pushEgg, pushChat, goonMode, startGapFire, stopGapFire],
  );

  useEffect(() => {
    let frame = 0;
    const loop = (ts: number) => {
      if (lastTs.current === null) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;

      const current = stateRef.current;
      if (current.status === "playing") {
        const step = Math.min(delta, 80);
        playElapsed.current += step;
        if (squareRushLeft.current > 0) {
          squareRushLeft.current -= step;
          if (squareRushLeft.current <= 0) endSquareRush();
        } else if (squareRushCd.current > 0) {
          squareRushCd.current -= step;
        } else {
          squareRushCheck.current += step;
          if (
            playElapsed.current >= SQUARE_RUSH_WARMUP_MS &&
            squareRushCheck.current >= SQUARE_RUSH_CHECK_MS
          ) {
            squareRushCheck.current = 0;
            const chance = goonModeRef.current ? 0.32 : 0.18;
            if (Math.random() < chance) startSquareRush();
          }
        }
        dropAcc.current += Math.min(delta, current.dropMs);
        if (dropAcc.current >= current.dropMs) {
          dropAcc.current = 0;
          apply(tick);
        }
      } else {
        dropAcc.current = 0;
      }

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [apply, startSquareRush, endSquareRush]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      const key = e.key.toLowerCase();
      unlockSfx();
      noteInput();

      konamiBuf.current = [...konamiBuf.current, key].slice(-KONAMI.length);
      if (KONAMI.every((step, i) => konamiBuf.current[i] === step)) {
        konamiBuf.current = [];
        tripGoonMode();
      }

      if (/^[a-z]$/.test(key)) {
        secretBuf.current = (secretBuf.current + key).slice(-12);
        const code = matchSecret(secretBuf.current);
        if (code) {
          secretBuf.current = "";
          if (code === "goon") tripGoonMode();
          else if (code === "neon") {
            if (stateRef.current.status === "playing") startSquareRush(true);
            else {
              pushEgg(cueForSecret(code));
              playMoan();
            }
          } else {
            pushEgg(cueForSecret(code));
            playMoan();
            playSplurt("gush");
          }
        }
      }

      const map: Record<string, Action> = {
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right",
        arrowdown: "soft",
        s: "soft",
        arrowup: "rotate",
        w: "rotate",
        x: "rotate",
        z: "rotateCCW",
        " ": "hard",
        p: "pause",
        escape: "pause",
      };

      if (key === "enter") {
        e.preventDefault();
        playClack("enter", e.repeat);
        if (stateRef.current.status === "paused") runAction("pause");
        else if (stateRef.current.status !== "playing") runAction("start");
        else runAction("hard");
        return;
      }

      const action = map[key];
      if (!action) return;
      if (action === "pause" && e.repeat) return;
      if (action === "hard" && e.repeat && squareRushLeft.current > 0) return;
      e.preventDefault();
      playClack(action === "hard" ? "space" : "key", e.repeat);

      if (action === "pause") {
        if (stateRef.current.status === "ready" || stateRef.current.status === "over") {
          runAction("start");
        } else {
          runAction("pause");
        }
        return;
      }

      if (stateRef.current.status === "ready" || stateRef.current.status === "over") {
        runAction("start");
        return;
      }

      runAction(action);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === " " || key === "enter") stopGapFire();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [runAction, noteInput, tripGoonMode, pushEgg, startSquareRush, stopGapFire]);

  useEffect(() => {
    const hide = () => {
      if (stateRef.current.status === "playing") runAction("pause");
    };
    const onVis = () => {
      if (document.hidden) hide();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [runAction]);

  const clearRepeat = () => {
    if (repeatRef.current) {
      clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  };

  const holdAction = (action: Action) => {
    if (
      stateRef.current.status !== "playing" &&
      action !== "pause" &&
      action !== "start"
    ) {
      return;
    }
    unlockSfx();
    noteInput();
    playClack(action === "hard" ? "space" : "key");
    runAction(action);
    clearRepeat();
    if (action === "left" || action === "right" || action === "soft") {
      repeatRef.current = setInterval(() => runAction(action), 65);
    }
  };

  useEffect(
    () => () => {
      clearRepeat();
      stopGapFire();
    },
    [stopGapFire],
  );

  const onSwipeStart = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    if (pinching.current) return;
    if (stateRef.current.status !== "playing") return;
    swipeStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };

  const onPinchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 2) return;
    pinching.current = true;
    swipeStart.current = null;
    const [a, b] = [e.touches[0], e.touches[1]];
    if (!a || !b) return;
    pinchRef.current = {
      dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      zoom: boardZoom,
    };
  };

  const onPinchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchRef.current) return;
    e.preventDefault();
    const [a, b] = [e.touches[0], e.touches[1]];
    if (!a || !b) return;
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (pinchRef.current.dist < 8) return;
    writeBoardZoom(pinchRef.current.zoom * (dist / pinchRef.current.dist));
  };

  const onPinchEnd = () => {
    pinchRef.current = null;
    pinching.current = false;
  };

  const onSwipeEnd = (e: React.PointerEvent) => {
    if (pinching.current) {
      swipeStart.current = null;
      return;
    }
    if (e.pointerType === "mouse" || !swipeStart.current) return;
    if (stateRef.current.status !== "playing") {
      swipeStart.current = null;
      return;
    }

    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    const dt = Date.now() - swipeStart.current.t;
    swipeStart.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    unlockSfx();
    noteInput();
    if (absX < 24 && absY < 24 && dt < 250) {
      playClack("key");
      runAction("rotate");
      return;
    }
    if (absX > absY && absX > 28) {
      playClack("key");
      runAction(dx > 0 ? "right" : "left");
      return;
    }
    if (absY > absX && absY > 36) {
      playClack(dy > 0 ? "space" : "key");
      runAction(dy > 0 ? "hard" : "rotate");
    }
  };

  async function submitScore(event: React.FormEvent) {
    event.preventDefault();
    if (submitState === "saving" || submitState === "saved") return;
    setSubmitState("saving");
    setSubmitError(null);
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: playerName,
          score: state.score,
          lines: state.lines,
          level: state.level,
        }),
      });
      const data = (await res.json()) as {
        scores?: HighScore[];
        error?: string;
      };
      if (!res.ok) {
        setSubmitState("error");
        setSubmitError(data.error ?? "Could not save score");
        return;
      }
      setLeaderboard({
        scores: data.scores ?? [],
        loading: false,
        error: null,
      });
      setSubmitState("saved");
      pushEgg(cueForSubmit());
      playMoan();
      playSplurt("gush");
    } catch {
      setSubmitState("error");
      setSubmitError("Could not save score");
    }
  }

  const cells = renderCells(state);
  const nextShape = squareRush ? ([[2]] as Cell[][]) : getShape(state.next);
  const overlay =
    state.status === "ready"
      ? readyCopy
      : state.status === "paused"
        ? pausedCopy
        : state.status === "over"
          ? bustCopy
          : null;

  const danger = state.status === "playing" && isNearTop(state.board, 4);
  const peakRow = stackPeakRow(state.board);
  const chatAnchorRow = Math.max(3, peakRow - 2);
  const chatBottomPct = ((ROWS - chatAnchorRow) / ROWS) * 100;

  return (
    <div
      className={`${styles.shell}${goonMode ? ` ${styles.shellGoon}` : ""}${
        boardZoom >= 0.92 ? ` ${styles.shellZoomIn}` : ""
      }`}
      style={{ ["--board-zoom" as string]: String(boardZoom) }}
    >
      <header className={styles.hero}>
        <p className={styles.brand}>Edge Stack</p>
        <h1 className={styles.title}>late night Tetris for gooners who can&apos;t hold it</h1>
        <p className={styles.lede} key={ticker}>
          {ticker}
        </p>
        <div className={styles.heroMeta}>
          {goonMode && (
            <span className={styles.goonBadge} aria-live="polite">
              goon cave
            </span>
          )}
              {squareRush && (
            <span className={styles.squareBadge} aria-live="polite">
              square mode
            </span>
          )}
          <button
            type="button"
            className={`${styles.muteBtn}${sfxOn ? "" : ` ${styles.muteOff}`}`}
            aria-pressed={!sfxOn}
            aria-label={sfxOn ? "Mute sounds" : "Unmute sounds"}
            onClick={toggleSfx}
          >
            {sfxOn ? "sfx messy" : "sfx muted"}
          </button>
          <button
            type="button"
            className={styles.muteBtn}
            aria-label={`Zoom playfield. Currently ${Math.round(boardZoom * 100)} percent`}
            onClick={cycleBoardZoom}
          >
            {zoomLabel(boardZoom)}
          </button>
          {(state.status === "playing" || state.status === "paused") && (
            <button
              type="button"
              className={styles.muteBtn}
              aria-pressed={state.status === "paused"}
              aria-label={state.status === "paused" ? "Resume game" : "Pause game"}
              onClick={() => {
                unlockSfx();
                playClack("key");
                runAction("pause");
              }}
            >
              {state.status === "paused" ? "resume" : "pause"}
            </button>
          )}
        </div>
      </header>

      <div className={styles.chrome}>
        <p className={styles.mantra}>PNC after the bust · deny it · dump it</p>
        <div className={styles.statRow} aria-label="Score panel">
          <Stat label="Load" value={formatScore(state.score)} />
          <Stat label="Pace" value={String(state.level)} />
          <Stat label="Milked" value={String(state.lines)} />
          <div className={styles.next}>
            <span className={styles.statLabel}>Drip</span>
            <div
              className={styles.nextGrid}
              role="img"
              aria-label={
                squareRush ? "Next piece: single square" : `Next piece: ${PIECE_NAMES[state.next]}`
              }
              style={{ gridTemplateColumns: `repeat(${nextShape[0].length}, 1fr)` }}
            >
              {nextShape.flatMap((row, y) =>
                row.map((cell, x) => (
                  <span
                    key={`${y}-${x}`}
                    className={`${styles.nextCell}${
                      squareRush && cell ? ` ${styles.nextRainbow}` : ""
                    }`}
                    style={
                      cell && !squareRush
                        ? { background: PIECE_COLORS[cell as Exclude<Cell, 0>] }
                        : undefined
                    }
                  />
                )),
              )}
            </div>
          </div>
        </div>

        <div
          className={`${styles.boardOuter}${
            flash === "pink"
              ? ` ${styles.flashPink}`
              : flash === "lime"
                ? ` ${styles.flashLime}`
                : flash === "hot"
                  ? ` ${styles.flashHot}`
                  : ""
          }${danger ? ` ${styles.boardDanger}` : ""}${goonMode ? ` ${styles.boardGoon}` : ""}${
            squareRush ? ` ${styles.boardSquare}` : ""
          }`}
        >
        <section
          ref={boardRef}
          className={styles.boardWrap}
          aria-label="Tetris playfield"
          onPointerDown={onSwipeStart}
          onPointerUp={onSwipeEnd}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
          onTouchStart={onPinchStart}
          onTouchMove={onPinchMove}
          onTouchEnd={onPinchEnd}
          onTouchCancel={onPinchEnd}
        >
          {girl && (
            <div className={styles.chatHead} aria-label={`Chatting with ${girl.name}`}>
              <GirlAvatar
                src={girl.pics[Math.max(0, picsUnlocked - 1)]?.src ?? girl.pics[0]!.src}
                name={girl.name}
                onOpen={openPic}
              />
              <div className={styles.chatHeadCopy}>
                <p className={styles.chatHeadName}>
                  chatting with {girl.name}
                </p>
                <p className={styles.chatHeadTag}>{girl.tag}</p>
              </div>
            </div>
          )}
          <div
            className={styles.board}
            role="grid"
            aria-rowcount={ROWS}
            aria-colcount={COLS}
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {cells.flatMap((row, y) =>
              row.map((cell, x) => {
                const ghost = isGhostCell(state, x, y);
                const ghostValue = ghost ? ghostCellValue(state, x, y) : 0;
                const rainbow =
                  squareRush &&
                  ((cell === O_CELL && !ghost) || (ghost && ghostValue === O_CELL));
                const color =
                  cell && !ghost && !rainbow
                    ? PIECE_COLORS[cell as Exclude<Cell, 0>]
                    : undefined;
                return (
                  <span
                    key={`${y}-${x}`}
                    role="gridcell"
                    className={`${styles.cell} ${ghost ? styles.ghost : ""} ${
                      cell && !ghost ? styles.filled : ""
                    } ${rainbow && !ghost ? styles.cellRainbow : ""} ${
                      rainbow && ghost ? styles.ghostRainbow : ""
                    }`}
                    style={{
                      animationDelay: `${(x + y) * -70}ms`,
                      ...(ghost && ghostValue && !rainbow
                        ? { boxShadow: `inset 0 0 0 2px ${PIECE_COLORS[ghostValue]}` }
                        : color
                          ? { background: color }
                          : undefined),
                    }}
                    aria-hidden={true}
                  />
                );
              }),
            )}
          </div>

          <div
            className={styles.eggLayer}
            aria-live="polite"
            id={toastRegionId}
            style={{ bottom: `${chatBottomPct}%` }}
          >
            {toasts.map((toast) =>
              toast.image ? (
                <button
                  key={toast.id}
                  type="button"
                  className={`${styles.eggToast} ${styles.chatIn} ${styles.chatPic}`}
                  style={{ ["--toast-ms" as string]: toast.hold }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPic(toast.image!);
                  }}
                >
                  <img src={toast.image} alt="" />
                  <span>{toast.text}</span>
                </button>
              ) : (
                <p
                  key={toast.id}
                  className={`${styles.eggToast} ${
                    toast.side === "out" ? styles.chatOut : styles.chatIn
                  }`}
                  style={{ ["--toast-ms" as string]: toast.hold }}
                >
                  {toast.text}
                </p>
              ),
            )}
            {bursts.map((burst) => (
              <span
                key={burst.id}
                className={`${styles.eggBurst} ${
                  burst.kind === "hearts"
                    ? styles.burstHearts
                    : burst.kind === "squirt"
                      ? styles.burstSquirt
                      : styles.burstSlime
                }`}
                style={{
                  left: `${burst.x}%`,
                  top: `${burst.y}%`,
                  animationDelay: `${burst.delay}ms`,
                }}
                aria-hidden={true}
              />
            ))}
          </div>

          {overlay && (
            <div
              className={styles.overlay}
              role="status"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onPointerCancel={(e) => e.stopPropagation()}
            >
              {girl && (
                <div className={styles.matchPreview}>
                  <GirlAvatar
                    src={girl.pics[0]!.src}
                    name={girl.name}
                    onOpen={openPic}
                    size="lg"
                  />
                  <p className={styles.matchPreviewName}>
                    {state.status === "over"
                      ? `left on read by ${girl.name}`
                      : `matched with ${girl.name}`}
                  </p>
                  <p className={styles.matchPreviewTag}>{girl.tag}</p>
                </div>
              )}
              <p className={styles.overlayTitle}>{overlay.title}</p>
              <p className={styles.overlayHint}>{overlay.hint}</p>

              {state.status === "over" && (
                <form className={styles.scoreForm} onSubmit={submitScore}>
                  <label className={styles.scoreLabel} htmlFor="player-name">
                    Sign the gooncave
                  </label>
                  <div className={styles.scoreRow}>
                    <input
                      id="player-name"
                      className={styles.scoreInput}
                      name="player-name"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={12}
                      placeholder="GOON"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
                      disabled={submitState === "saving" || submitState === "saved"}
                    />
                    <button
                      type="submit"
                      className={styles.primaryBtn}
                      disabled={
                        submitState === "saving" ||
                        submitState === "saved" ||
                        playerName.trim().length < 1
                      }
                    >
                      {submitState === "saved"
                        ? "Stuck"
                        : submitState === "saving"
                          ? "Sticking…"
                          : "Stick it"}
                    </button>
                  </div>
                  {submitError && <p className={styles.formError}>{submitError}</p>}
                </form>
              )}

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => {
                  unlockSfx();
                  playClack("enter");
                  runAction(state.status === "paused" ? "pause" : "start");
                }}
              >
                {state.status === "paused"
                  ? "Stay denied"
                  : state.status === "over"
                    ? "Goon again"
                    : "Start the sesh"}
              </button>
            </div>
          )}
          {picOpen && (
            <button
              type="button"
              className={styles.picFloat}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openPic(null);
              }}
              aria-label="Close photo"
            >
              <img src={picOpen} alt={girl?.name ?? "photo"} />
            </button>
          )}
        </section>
        </div>
      </div>

      <div className={styles.touch} aria-label="Touch controls">
        <button
          type="button"
          className={`${styles.touchBtn} ${styles.touchWide} ${
            pressedBtn === "rotate" ? styles.touchPressed : ""
          }`}
          aria-label="Twist"
          onPointerDown={(e) => {
            e.preventDefault();
            bumpPress("rotate");
            holdAction("rotate");
          }}
        >
          Twist
        </button>
        <button
          type="button"
          className={`${styles.touchBtn} ${pressedBtn === "left" ? styles.touchPressed : ""}`}
          aria-label="Move left"
          onPointerDown={(e) => {
            e.preventDefault();
            bumpPress("left");
            holdAction("left");
          }}
          onPointerUp={clearRepeat}
          onPointerLeave={clearRepeat}
          onPointerCancel={clearRepeat}
        >
          ←
        </button>
        <button
          type="button"
          className={`${styles.touchBtn} ${pressedBtn === "soft" ? styles.touchPressed : ""}`}
          aria-label="Soft drop"
          onPointerDown={(e) => {
            e.preventDefault();
            bumpPress("soft");
            holdAction("soft");
          }}
          onPointerUp={clearRepeat}
          onPointerLeave={clearRepeat}
          onPointerCancel={clearRepeat}
        >
          ↓
        </button>
        <button
          type="button"
          className={`${styles.touchBtn} ${pressedBtn === "right" ? styles.touchPressed : ""}`}
          aria-label="Move right"
          onPointerDown={(e) => {
            e.preventDefault();
            bumpPress("right");
            holdAction("right");
          }}
          onPointerUp={clearRepeat}
          onPointerLeave={clearRepeat}
          onPointerCancel={clearRepeat}
        >
          →
        </button>
        <button
          type="button"
          className={`${styles.touchBtn} ${styles.touchWide} ${styles.touchAccent} ${
            pressedBtn === "hard" ? styles.touchPressed : ""
          }`}
          aria-label="Dump"
          onPointerDown={(e) => {
            e.preventDefault();
            bumpPress("hard");
            holdAction("hard");
          }}
          onPointerUp={stopGapFire}
          onPointerLeave={stopGapFire}
          onPointerCancel={stopGapFire}
        >
          Dump
        </button>
      </div>

      <div className={styles.touchMeta}>
        <button
          type="button"
          className={styles.pauseLink}
          aria-label={
            state.status === "playing"
              ? "Pause game"
              : state.status === "paused"
                ? "Resume game"
                : "Play"
          }
          onClick={() => {
            unlockSfx();
            playClack("key");
            if (state.status === "playing" || state.status === "paused") {
              runAction("pause");
            } else {
              runAction("start");
            }
          }}
        >
          {state.status === "playing" ? "pause" : state.status === "paused" ? "resume" : "play"}
        </button>
        <span className={styles.swipeHint}>swipe sloppy · pinch the well · stay denied</span>
      </div>

      <aside className={styles.leaderboard} aria-labelledby="leaderboard-heading">
        <div className={styles.leaderHead}>
          <h2 id="leaderboard-heading" className={styles.leaderTitle}>
            Gooncave board
          </h2>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={() => void refreshScores()}
            disabled={leaderboard.loading}
          >
            Refresh
          </button>
        </div>
        {leaderboard.loading && <p className={styles.leaderMeta}>Loading loads…</p>}
        {leaderboard.error && !leaderboard.loading && (
          <p className={styles.leaderMeta}>{leaderboard.error}</p>
        )}
        {!leaderboard.loading && !leaderboard.error && leaderboard.scores.length === 0 && (
          <p className={styles.leaderMeta}>Empty cave — first drip gets the wall.</p>
        )}
        {leaderboard.scores.length > 0 && (
          <ol className={styles.leaderList}>
            {leaderboard.scores.map((entry, index) => (
              <li key={entry.id} className={styles.leaderItem}>
                <span className={styles.leaderRank}>{index + 1}</span>
                <span className={styles.leaderName}>{entry.name}</span>
                <span className={styles.leaderScore}>{formatScore(entry.score)}</span>
                <span className={styles.leaderDetail}>
                  {rankTag(index)} · L{entry.level} · {entry.lines} milked
                </span>
              </li>
            ))}
          </ol>
        )}
      </aside>

      <aside className={styles.help} aria-label="Keyboard controls">
        <h2 className={styles.helpTitle}>Desktop keys · they clack</h2>
        <ul className={styles.helpList}>
          <li>
            <kbd>←</kbd>
            <kbd>→</kbd> slide it
          </li>
          <li>
            <kbd>↑</kbd> twist · <kbd>↓</kbd> ease it in
          </li>
          <li>
            <kbd>Space</kbd> dump · <kbd>P</kbd> deny / pause
          </li>
          <li className={styles.helpEgg}>
            codes: <kbd>GOON</kbd> <kbd>RUIN</kbd> <kbd>THROB</kbd> <kbd>MILK</kbd> <kbd>NUT</kbd>{" "}
            <kbd>HORNY</kbd> <kbd>NEON</kbd> · or konami
          </li>
        </ul>
        <p className={styles.glossary}>
          EDGE = hold it · PNC = after you bust · GOON = the practice · RUIN = finish messy
        </p>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function GirlAvatar({
  src,
  name,
  onOpen,
  size = "sm",
}: {
  src: string;
  name: string;
  onOpen: (src: string) => void;
  size?: "sm" | "lg";
}) {
  return (
    <div className={`${styles.avatarWrap} ${size === "lg" ? styles.avatarLg : ""}`}>
      <button
        type="button"
        className={styles.avatarBtn}
        aria-label={`See ${name}`}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(src);
        }}
      >
        <img src={src} alt="" />
      </button>
      <div className={styles.avatarPeek} aria-hidden="true">
        <img src={src} alt="" />
        <span>{name}</span>
      </div>
    </div>
  );
}
