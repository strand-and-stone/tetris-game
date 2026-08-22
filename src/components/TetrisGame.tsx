"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  isGhostCell,
  move,
  renderCells,
  rotate,
  softDrop,
  startGame,
  tick,
  togglePause,
} from "@/lib/tetris";
import type { HighScore } from "@/lib/score-types";
import styles from "./TetrisGame.module.css";

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

  const stateRef = useRef(state);
  const dropAcc = useRef(0);
  const lastTs = useRef<number | null>(null);
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swipeStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const boardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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

  const apply = useCallback((fn: (s: GameState) => GameState) => {
    setState((prev) => {
      const next = fn(prev);
      stateRef.current = next;
      return next;
    });
  }, []);

  const runAction = useCallback(
    (action: Action) => {
      switch (action) {
        case "start":
          setSubmitState("idle");
          setSubmitError(null);
          apply(startGame);
          break;
        case "pause":
          apply(togglePause);
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
        case "hard":
          apply(hardDrop);
          break;
        case "rotate":
          apply((s) => rotate(s, 1));
          break;
        case "rotateCCW":
          apply((s) => rotate(s, -1));
          break;
        default:
          break;
      }
    },
    [apply],
  );

  useEffect(() => {
    let frame = 0;
    const loop = (ts: number) => {
      if (lastTs.current === null) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;

      const current = stateRef.current;
      if (current.status === "playing") {
        dropAcc.current += delta;
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
  }, [apply]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      const key = e.key.toLowerCase();
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
        if (stateRef.current.status === "paused") runAction("pause");
        else if (stateRef.current.status !== "playing") runAction("start");
        else runAction("hard");
        return;
      }

      const action = map[key];
      if (!action) return;
      e.preventDefault();

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

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [runAction]);

  const clearRepeat = () => {
    if (repeatRef.current) {
      clearInterval(repeatRef.current);
      repeatRef.current = null;
    }
  };

  const holdAction = (action: Action) => {
    runAction(action);
    clearRepeat();
    if (action === "left" || action === "right" || action === "soft") {
      repeatRef.current = setInterval(() => runAction(action), 65);
    }
  };

  useEffect(() => () => clearRepeat(), []);

  const onSwipeStart = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipeStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };

  const onSwipeEnd = (e: React.PointerEvent) => {
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
    if (absX < 24 && absY < 24 && dt < 250) {
      runAction("rotate");
      return;
    }
    if (absX > absY && absX > 28) {
      runAction(dx > 0 ? "right" : "left");
      return;
    }
    if (absY > absX && absY > 36) {
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
    } catch {
      setSubmitState("error");
      setSubmitError("Could not save score");
    }
  }

  const cells = renderCells(state);
  const nextShape = getShape(state.next);
  const overlay =
    state.status === "ready"
      ? { title: "One more line", hint: "18+ · no account · just edge" }
      : state.status === "paused"
        ? { title: "Edging…", hint: "Breathe. Then go again." }
        : state.status === "over"
          ? {
              title: "You busted",
              hint: `${formatScore(state.score)} pts · L${state.level} · sticky finish`,
            }
          : null;

  return (
    <div className={styles.shell}>
      <header className={styles.hero}>
        <p className={styles.brand}>Edge Stack</p>
        <h1 className={styles.title}>Clear lines. Don&apos;t bust.</h1>
        <p className={styles.lede}>Late-night Tetris for gooners who can hold it.</p>
      </header>

      <div className={styles.chrome}>
        <div className={styles.statRow} aria-label="Score panel">
          <Stat label="Score" value={formatScore(state.score)} />
          <Stat label="Level" value={String(state.level)} />
          <Stat label="Lines" value={String(state.lines)} />
          <div className={styles.next}>
            <span className={styles.statLabel}>Next</span>
            <div
              className={styles.nextGrid}
              role="img"
              aria-label={`Next piece: ${PIECE_NAMES[state.next]}`}
              style={{ gridTemplateColumns: `repeat(${nextShape[0].length}, 1fr)` }}
            >
              {nextShape.flatMap((row, y) =>
                row.map((cell, x) => (
                  <span
                    key={`${y}-${x}`}
                    className={styles.nextCell}
                    style={
                      cell
                        ? { background: PIECE_COLORS[cell as Exclude<Cell, 0>] }
                        : undefined
                    }
                  />
                )),
              )}
            </div>
          </div>
        </div>

        <section
          ref={boardRef}
          className={styles.boardWrap}
          aria-label="Tetris playfield"
          onPointerDown={onSwipeStart}
          onPointerUp={onSwipeEnd}
          onPointerCancel={() => {
            swipeStart.current = null;
          }}
        >
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
                const color =
                  cell && !ghost ? PIECE_COLORS[cell as Exclude<Cell, 0>] : undefined;
                const ghostValue = ghost ? ghostCellValue(state, x, y) : 0;
                return (
                  <span
                    key={`${y}-${x}`}
                    role="gridcell"
                    className={`${styles.cell} ${ghost ? styles.ghost : ""} ${
                      cell && !ghost ? styles.filled : ""
                    }`}
                    style={
                      ghost && ghostValue
                        ? { boxShadow: `inset 0 0 0 2px ${PIECE_COLORS[ghostValue]}` }
                        : color
                          ? { background: color }
                          : undefined
                    }
                    aria-hidden={true}
                  />
                );
              }),
            )}
          </div>

          {overlay && (
            <div className={styles.overlay} role="status">
              <p className={styles.overlayTitle}>{overlay.title}</p>
              <p className={styles.overlayHint}>{overlay.hint}</p>

              {state.status === "over" && (
                <form className={styles.scoreForm} onSubmit={submitScore}>
                  <label className={styles.scoreLabel} htmlFor="player-name">
                    Tag the goon board
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
                        ? "Posted"
                        : submitState === "saving"
                          ? "Posting…"
                          : "Post it"}
                    </button>
                  </div>
                  {submitError && <p className={styles.formError}>{submitError}</p>}
                </form>
              )}

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => runAction(state.status === "paused" ? "pause" : "start")}
              >
                {state.status === "paused"
                  ? "Keep going"
                  : state.status === "over"
                    ? "Edge again"
                    : "Start edging"}
              </button>
            </div>
          )}
        </section>
      </div>

      <div className={styles.touch} aria-label="Touch controls">
        <button
          type="button"
          className={styles.touchBtn}
          aria-label="Move left"
          onPointerDown={(e) => {
            e.preventDefault();
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
          className={styles.touchBtn}
          aria-label="Rotate"
          onPointerDown={(e) => {
            e.preventDefault();
            runAction("rotate");
          }}
        >
          ↻
        </button>
        <button
          type="button"
          className={styles.touchBtn}
          aria-label="Soft drop"
          onPointerDown={(e) => {
            e.preventDefault();
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
          className={styles.touchBtn}
          aria-label="Move right"
          onPointerDown={(e) => {
            e.preventDefault();
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
          className={`${styles.touchBtn} ${styles.touchAccent}`}
          aria-label="Hard drop"
          onPointerDown={(e) => {
            e.preventDefault();
            runAction("hard");
          }}
        >
          Drop hard
        </button>
        <button
          type="button"
          className={styles.touchBtn}
          aria-label={state.status === "playing" ? "Pause" : "Play"}
          onPointerDown={(e) => {
            e.preventDefault();
            if (state.status === "playing" || state.status === "paused") {
              runAction("pause");
            } else {
              runAction("start");
            }
          }}
        >
          {state.status === "playing" ? "Edge pause" : "Start"}
        </button>
      </div>

      <p className={styles.swipeHint}>Swipe the well · tap to twist · hold the bust</p>

      <aside className={styles.leaderboard} aria-labelledby="leaderboard-heading">
        <div className={styles.leaderHead}>
          <h2 id="leaderboard-heading" className={styles.leaderTitle}>
            Goon board
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
        {leaderboard.loading && <p className={styles.leaderMeta}>Loading streaks…</p>}
        {leaderboard.error && !leaderboard.loading && (
          <p className={styles.leaderMeta}>{leaderboard.error}</p>
        )}
        {!leaderboard.loading && !leaderboard.error && leaderboard.scores.length === 0 && (
          <p className={styles.leaderMeta}>Empty well — leave the first sticky score.</p>
        )}
        {leaderboard.scores.length > 0 && (
          <ol className={styles.leaderList}>
            {leaderboard.scores.map((entry, index) => (
              <li key={entry.id} className={styles.leaderItem}>
                <span className={styles.leaderRank}>{index + 1}</span>
                <span className={styles.leaderName}>{entry.name}</span>
                <span className={styles.leaderScore}>{formatScore(entry.score)}</span>
                <span className={styles.leaderDetail}>
                  L{entry.level} · {entry.lines} lines
                </span>
              </li>
            ))}
          </ol>
        )}
      </aside>

      <aside className={styles.help} aria-label="Keyboard controls">
        <h2 className={styles.helpTitle}>Desktop keys</h2>
        <ul className={styles.helpList}>
          <li>
            <kbd>←</kbd>
            <kbd>→</kbd> slide
          </li>
          <li>
            <kbd>↑</kbd> twist · <kbd>↓</kbd> ease it in
          </li>
          <li>
            <kbd>Space</kbd> dump · <kbd>P</kbd> edge pause
          </li>
        </ul>
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
