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
  | "bust"
  | "idle"
  | "secret"
  | "milestone"
  | "tease"
  | "start"
  | "squareRush";

export type EggBurst = "hearts" | "slime" | "squirt" | "flash";

export type EggCue = {
  text: string;
  kind: EggKind;
  bursts?: EggBurst[];
  flash?: "pink" | "lime" | "hot";
};

let heated = false;

export function setEggHeat(on: boolean): void {
  heated = on;
}

const CLEAR = [
  "line milked",
  "cleared · sticky",
  "mmph — that one was wet",
  "good boy clearance",
  "siphoned",
  "edge… and release",
  "sloppy wipe",
  "that's it, drain it",
  "messy little siphon",
  "one more drip for the well",
  "you leaked on purpose",
  "stroke, clear, repeat",
  "denied, then drained",
  "PNC can wait",
  "goon fuel spent",
  "that row was throbbing",
  "wiped sloppy · stay in it",
  "edge broken on purpose",
];

const TETRIS = [
  "TETRIS · full send",
  "four-line finish",
  "you emptied the whole stack",
  "quad nut — filthy",
  "that was a messy climax",
  "four at once · ruined",
  "absolute goon finish",
  "you just painted the well",
  "can't walk after that one",
  "quad ruin · no PNC yet",
  "gooncave applauds",
  "that's a ruined orgasm of a clear",
];

const COMBO = [
  "combo gooning",
  "chained · still leaking",
  "don't stop mid-stroke",
  "streak is throbbing",
  "again. harder.",
  "keep pumping",
  "no refractory period",
  "stacked and sloppy",
  "denial broken · keep going",
  "goon streak locked",
];

const LEVEL = [
  "level up · faster throb",
  "speedrun your ruin",
  "they drop hotter now",
  "pace check: desperate",
  "quicker strokes from here",
  "the well wants it faster",
  "goon fuel: overclocked",
  "less time to edge it",
];

const PANIC = [
  "too close to the rim",
  "stack's kissing the tip",
  "panic edge — breathe",
  "one more and you bust",
  "don't tap out now",
  "that's a dangerous load",
  "so full it hurts",
  "PNC incoming if you slip",
  "gooncave is flooding",
  "hold it. hold it.",
];

const LONG_LOCK = [
  "long drop · deep",
  "buried that one",
  "from the tip to the floor",
  "slow… then slam",
  "all the way in",
  "held it · then stuffed it",
  "edged the drop then ruined it",
  "seated sloppy",
];

const PIECE: Record<string, string[]> = {
  I: [
    "long boy incoming",
    "the tall one · stretch",
    "put the pole in",
    "yardstick thirst",
    "I-beam · goon fuel",
    "straight down the well",
  ],
  O: [
    "chunky square · fill me",
    "thick O · no twists",
    "blunt and heavy",
    "plug the hole",
    "fat load incoming",
    "no spin. just seat it.",
  ],
  T: [
    "T for tease",
    "three-way bump",
    "the bump that begs",
    "press the middle",
    "T-bone the stack",
    "tease, then commit",
  ],
  S: [
    "S-curve · slippery",
    "snake it in",
    "slick little S",
    "twist me sideways",
    "slippery when edged",
    "S for sloppy",
  ],
  Z: [
    "Z · zigzag tease",
    "crooked and eager",
    "nasty angle",
    "it never sits still",
    "Z for needy",
    "crooked drip",
  ],
  J: [
    "J hook · catch it",
    "left hook fantasy",
    "hook it behind",
    "come here",
    "J wants the corner",
    "hook, then milk",
  ],
  L: [
    "L for linger",
    "right angle thirst",
    "lean on it",
    "leave it in",
    "L for leak",
    "angle it. ruin it.",
  ],
};

const SUBMIT = [
  "posted to the goon board",
  "name sticky forever",
  "they saw what you did",
  "high score · ruined",
  "everyone knows you busted",
  "signed in slop",
  "tagged the gooncave",
  "receipt of your ruin",
];

const BUST = [
  "you busted · sticky finish",
  "overflow · game over",
  "couldn't hold it",
  "tapped out messy",
  "that's a ruined load",
  "next time edge longer",
  "hello PNC",
  "goon sesh: closed",
  "the well overflowed",
];

const IDLE = [
  "don't just stare · stroke a line",
  "still edging? drop it",
  "the well is waiting, freak",
  "hands froze · needy much",
  "you gonna finish or just leak",
  "denial only works if you move",
  "goon brain buffering…",
  "touch the keys. they're already wet.",
];

const SECRET: Record<string, string[]> = {
  goon: ["goon code accepted", "yeah we know what you are", "welcome to the cave"],
  ruin: ["ruin locked in", "no take-backs. messy.", "you asked to be wrecked"],
  throb: ["pulse check: filthy", "it's throbbing now", "feel that?"],
  milk: ["milking the well", "drain it slower", "that's the good siphon"],
  nut: ["nut coded · dangerous", "don't you dare. yet.", "hold the nut. play."],
  horny: ["horny confirmed", "we already knew", "stay stupid. stay playing."],
  neon: ["box binge armed", "squares only. neon.", "o-block flood incoming"],
};

const GOON_MODE = [
  "GOON MODE · no brakes",
  "heat's on · stay leaking",
  "unlocked the nasty layer",
  "cave lights: red",
  "PNC disabled. keep going.",
];

const SQUARE_RUSH = [
  "SQUARE MODE · hold dump",
  "singular squares. plug every hole",
  "1×1 flood. hold space",
  "square mode. fill the gaps",
  "tiny squares. dump and don't stop",
];

const SQUARE_RUSH_END = [
  "bag's back. breathe",
  "squares over. think again",
  "rainbow's done. messy leftover",
];

const MILESTONE = [
  "load's getting heavy",
  "that's a committed goon",
  "score's throbbing",
  "you should be ashamed. continue.",
  "milestone · still not done",
  "goon fuel checkpoint",
  "denial paying off",
];

const TEASE = [
  "spinning it like that, huh",
  "dizzy already",
  "stop teasing and seat it",
  "all that twist · still not in",
  "edging the piece, not the line",
  "put it in already",
];

const START = [
  "here we go · don't bust",
  "edge first. score later.",
  "hands on. brain off.",
  "just the tip of the bag",
  "goon sesh: live",
  "PNC is for after",
  "no nut till the well says so",
];

export const TICKER = [
  "clear lines. don't bust.",
  "no account. no mercy.",
  "the well is thirsty.",
  "stroke the stack, not your ego.",
  "18+ · stay leaking.",
  "one more line. always.",
  "mechanical keys, messy finish.",
  "don't tap out mid-edge.",
  "PNC after the bust. not before.",
  "goon fuel: tetrominoes.",
  "deny it. then dump it.",
  "ruined orgasms welcome.",
  "stay stupid. stay stacked.",
  "this is a gooncave, not a gym.",
];

const READY = [
  { title: "One more line", hint: "18+ · no account · just edge" },
  { title: "Don't tap out", hint: "keyboard clack · well waits" },
  { title: "Just the tip", hint: "start slow. ruin it later." },
  { title: "Edge first", hint: "score is a side effect" },
  { title: "Goon sesh", hint: "PNC is a later problem" },
  { title: "Stay denied", hint: "the well likes a long edge" },
];

const PAUSED = [
  { title: "Edging…", hint: "Breathe. Then go again." },
  { title: "Hold it", hint: "Don't you dare tap out." },
  { title: "Frozen mid-stroke", hint: "The well isn't going anywhere." },
  { title: "Denial break", hint: "This is still a goon sesh." },
  { title: "PNC pending", hint: "Don't finish. Resume." },
];

const BUST_TITLES = [
  { title: "You busted", suffix: "sticky finish" },
  { title: "PNC hit", suffix: "sesh closed messy" },
  { title: "Ruined", suffix: "couldn't deny it" },
  { title: "Overflow", suffix: "the well spilled" },
];

const RANKS = [
  "top drip",
  "second leak",
  "still wet",
  "goon 4",
  "bench drip",
  "hole 6",
  "hole 7",
  "last leak",
];

export const SECRET_WORDS = ["goon", "ruin", "throb", "milk", "nut", "horny", "neon"] as const;

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function pickTicker(index: number): string {
  return TICKER[index % TICKER.length]!;
}

export function defaultReady(): { title: string; hint: string } {
  return READY[0]!;
}

export function pickReady(): { title: string; hint: string } {
  return pick(READY);
}

export function pickPaused(): { title: string; hint: string } {
  return pick(PAUSED);
}

export function pickBust(score: number, level: number): { title: string; hint: string } {
  const row = pick(BUST_TITLES);
  return {
    title: row.title,
    hint: `${score.toLocaleString("en-US")} pts · L${level} · ${row.suffix}`,
  };
}

export function rankTag(index: number): string {
  return RANKS[index] ?? `hole ${index + 1}`;
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
  const rate = heated ? 0.78 : 0.48;
  if (Math.random() > rate) return null;
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

export function cueForIdle(): EggCue {
  return { text: pick(IDLE), kind: "idle" };
}

export function cueForSecret(word = "goon"): EggCue {
  const pool = SECRET[word] ?? SECRET.goon!;
  return {
    text: pick(pool),
    kind: "secret",
    bursts: ["hearts", "flash"],
    flash: "hot",
  };
}

export function cueForGoonMode(): EggCue {
  return {
    text: pick(GOON_MODE),
    kind: "secret",
    bursts: ["squirt", "hearts", "slime", "flash"],
    flash: "hot",
  };
}

export function cueForSquareRush(): EggCue {
  return {
    text: pick(SQUARE_RUSH),
    kind: "squareRush",
    bursts: ["slime", "hearts", "flash"],
    flash: "hot",
  };
}

export function cueForSquareRushEnd(): EggCue {
  return {
    text: pick(SQUARE_RUSH_END),
    kind: "squareRush",
    flash: "lime",
  };
}

export function cueForMilestone(score: number): EggCue {
  return {
    text: `${pick(MILESTONE)} · ${score.toLocaleString("en-US")}`,
    kind: "milestone",
    bursts: ["hearts"],
    flash: "pink",
  };
}

export function cueForTease(): EggCue {
  return { text: pick(TEASE), kind: "tease", flash: "lime" };
}

export function cueForStart(): EggCue {
  return { text: pick(START), kind: "start" };
}

export function matchSecret(buffer: string): (typeof SECRET_WORDS)[number] | null {
  for (const word of SECRET_WORDS) {
    if (buffer.endsWith(word)) return word;
  }
  return null;
}

export const SCORE_MILESTONES = [800, 2000, 4000, 7000, 10000, 15000, 22000];

/** True if any filled cell sits in the top `rows` of the board. */
export function isNearTop(board: number[][], rows = 4): boolean {
  for (let y = 0; y < Math.min(rows, board.length); y += 1) {
    if (board[y]?.some((cell) => cell !== 0)) return true;
  }
  return false;
}
