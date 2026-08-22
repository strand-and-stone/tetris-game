/** Short 18+ gooner banter for play events. No minors / school / real people. */

export type EggKind =
  | "clear"
  | "tetris"
  | "combo"
  | "level"
  | "panic"
  | "longLock"
  | "piece"
  | "submit"
  | "bust";

export type EggBurst = "hearts" | "slime" | "squirt" | "flash";

export type EggCue = {
  text: string;
  kind: EggKind;
  bursts?: EggBurst[];
  flash?: "pink" | "lime" | "hot";
};

const CLEAR = [
  "line milked",
  "cleared · sticky",
  "mmph — that one was wet",
  "good boy clearance",
  "siphoned",
  "edge… and release",
];

const TETRIS = [
  "TETRIS · full send",
  "four-line finish",
  "you emptied the whole stack",
  "quad nut — filthy",
  "that was a messy climax",
];

const COMBO = [
  "combo gooning",
  "chained · still leaking",
  "don't stop mid-stroke",
  "streak is throbbing",
  "again. harder.",
];

const LEVEL = [
  "level up · faster throb",
  "speedrun your ruin",
  "they drop hotter now",
  "pace check: desperate",
];

const PANIC = [
  "too close to the rim",
  "stack's kissing the tip",
  "panic edge — breathe",
  "one more and you bust",
];

const LONG_LOCK = [
  "long drop · deep",
  "buried that one",
  "from the tip to the floor",
  "slow… then slam",
];

const PIECE: Record<string, string[]> = {
  I: ["long boy incoming", "the tall one · stretch"],
  O: ["chunky square · fill me", "thick O · no twists"],
  T: ["T for tease", "three-way bump"],
  S: ["S-curve · slippery", "snake it in"],
  Z: ["Z · zigzag tease", "crooked and eager"],
  J: ["J hook · catch it", "left hook fantasy"],
  L: ["L for linger", "right angle thirst"],
};

const SUBMIT = [
  "posted to the goon board",
  "name sticky forever",
  "they saw what you did",
  "high score · ruined",
];

const BUST = [
  "you busted · sticky finish",
  "overflow · game over",
  "couldn't hold it",
];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function cueForClear(linesCleared: number, combo: number): EggCue {
  if (linesCleared >= 4) {
    return {
      text: pick(TETRIS),
      kind: "tetris",
      bursts: ["squirt", "slime", "flash"],
      flash: "hot",
    };
  }
  if (combo >= 2) {
    return {
      text: `${pick(COMBO)} ×${combo}`,
      kind: "combo",
      bursts: ["hearts", "slime"],
      flash: "pink",
    };
  }
  return {
    text: pick(CLEAR),
    kind: "clear",
    bursts: ["slime"],
    flash: "lime",
  };
}

export function cueForLevel(level: number): EggCue {
  return {
    text: `${pick(LEVEL)} · L${level}`,
    kind: "level",
    bursts: ["hearts", "flash"],
    flash: "pink",
  };
}

export function cueForPanic(): EggCue {
  return {
    text: pick(PANIC),
    kind: "panic",
    bursts: ["flash"],
    flash: "hot",
  };
}

export function cueForLongLock(): EggCue {
  return {
    text: pick(LONG_LOCK),
    kind: "longLock",
    bursts: ["squirt"],
    flash: "lime",
  };
}

export function cueForPiece(id: string): EggCue | null {
  const pool = PIECE[id];
  if (!pool) return null;
  // Soft rate: ~35% of spawns get flavor
  if (Math.random() > 0.35) return null;
  return {
    text: pick(pool),
    kind: "piece",
  };
}

export function cueForSubmit(): EggCue {
  return {
    text: pick(SUBMIT),
    kind: "submit",
    bursts: ["hearts", "slime", "flash"],
    flash: "pink",
  };
}

export function cueForBust(): EggCue {
  return {
    text: pick(BUST),
    kind: "bust",
    bursts: ["squirt", "flash"],
    flash: "hot",
  };
}

/** True if any filled cell sits in the top `rows` of the board. */
export function isNearTop(board: number[][], rows = 4): boolean {
  for (let y = 0; y < Math.min(rows, board.length); y += 1) {
    if (board[y]?.some((cell) => cell !== 0)) return true;
  }
  return false;
}
