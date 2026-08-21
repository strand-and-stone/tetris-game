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
  const stateRef = useRef(state);
  const dropAcc = useRef(0);
  const lastTs = useRef<number | null>(null);
  const repeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
      repeatRef.current = setInterval(() => runAction(action), 70);
    }
  };

  useEffect(() => () => clearRepeat(), []);

  const cells = renderCells(state);
  const nextShape = getShape(state.next);
  const overlay =
    state.status === "ready"
      ? { title: "Ready", hint: "Press Play or Enter" }
      : state.status === "paused"
        ? { title: "Paused", hint: "Press P or Resume" }
        : state.status === "over"
          ? { title: "Game Over", hint: "Press Play to stack again" }
          : null;

  return (
    <div className={styles.shell}>
      <header className={styles.hero}>
        <p className={styles.brand}>Strand &amp; Stone</p>
        <h1 className={styles.title}>Harbor Stack</h1>
        <p className={styles.lede}>
          Classic Tetris for the browser — clear lines, climb levels, keep the tide rising.
        </p>
      </header>

      <div className={styles.stage}>
        <aside className={styles.hud} aria-label="Score panel">
          <Stat label="Score" value={formatScore(state.score)} />
          <Stat label="Level" value={String(state.level)} />
          <Stat label="Lines" value={String(state.lines)} />
          <div className={styles.next}>
            <span className={styles.statLabel}>Next</span>
            <div
              className={styles.nextGrid}
              role="img"
              aria-label={`Next piece: ${PIECE_NAMES[state.next]}`}
              style={{
                gridTemplateColumns: `repeat(${nextShape[0].length}, 1fr)`,
              }}
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
        </aside>

        <section className={styles.boardWrap} aria-label="Tetris playfield">
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
                        ? {
                            boxShadow: `inset 0 0 0 2px ${PIECE_COLORS[ghostValue]}`,
                          }
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
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => runAction(state.status === "paused" ? "pause" : "start")}
              >
                {state.status === "paused" ? "Resume" : "Play"}
              </button>
            </div>
          )}
        </section>

        <aside className={styles.help} aria-label="Controls">
          <h2 className={styles.helpTitle}>Controls</h2>
          <ul className={styles.helpList}>
            <li>
              <kbd>←</kbd>
              <kbd>→</kbd> move
            </li>
            <li>
              <kbd>↑</kbd> / <kbd>X</kbd> rotate
            </li>
            <li>
              <kbd>↓</kbd> soft drop
            </li>
            <li>
              <kbd>Space</kbd> hard drop
            </li>
            <li>
              <kbd>P</kbd> pause
            </li>
          </ul>
          {state.status === "playing" && (
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => runAction("pause")}
            >
              Pause
            </button>
          )}
        </aside>
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
          aria-label="Rotate clockwise"
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
          className={`${styles.touchBtn} ${styles.touchWide}`}
          aria-label="Hard drop"
          onPointerDown={(e) => {
            e.preventDefault();
            runAction("hard");
          }}
        >
          Drop
        </button>
        <button
          type="button"
          className={`${styles.touchBtn} ${styles.touchWide}`}
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
          {state.status === "playing" ? "Pause" : "Play"}
        </button>
      </div>
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
