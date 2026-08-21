/** Classic Tetris board dimensions and piece definitions. */

export const COLS = 10;
export const ROWS = 20;

export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Matrix = Cell[][];
export type Point = { x: number; y: number };

export type PieceId = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export type ActivePiece = {
  id: PieceId;
  matrix: Matrix;
  x: number;
  y: number;
};

export type GameStatus = "ready" | "playing" | "paused" | "over";

export type GameState = {
  board: Matrix;
  active: ActivePiece | null;
  next: PieceId;
  bag: PieceId[];
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
  dropMs: number;
};

const PIECE_SHAPES: Record<PieceId, Matrix> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [2, 2],
    [2, 2],
  ],
  T: [
    [0, 3, 0],
    [3, 3, 3],
    [0, 0, 0],
  ],
  S: [
    [0, 4, 4],
    [4, 4, 0],
    [0, 0, 0],
  ],
  Z: [
    [5, 5, 0],
    [0, 5, 5],
    [0, 0, 0],
  ],
  J: [
    [6, 0, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 7],
    [7, 7, 7],
    [0, 0, 0],
  ],
};

export const PIECE_COLORS: Record<Exclude<Cell, 0>, string> = {
  1: "#3ecfc8",
  2: "#e8b84a",
  3: "#6b8cae",
  4: "#5ecf8a",
  5: "#d96b5c",
  6: "#4a7fd4",
  7: "#d4894a",
};

export const PIECE_NAMES: Record<PieceId, string> = {
  I: "I tetromino",
  O: "O tetromino",
  T: "T tetromino",
  S: "S tetromino",
  Z: "Z tetromino",
  J: "J tetromino",
  L: "L tetromino",
};

const ALL_PIECES: PieceId[] = ["I", "O", "T", "S", "Z", "J", "L"];

const LINE_SCORES = [0, 100, 300, 500, 800];

function emptyBoard(): Matrix {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function refillBag(bag: PieceId[]): PieceId[] {
  if (bag.length > 0) return bag;
  return shuffle(ALL_PIECES);
}

function takeNext(bag: PieceId[]): { id: PieceId; bag: PieceId[] } {
  const filled = refillBag(bag);
  const [id, ...rest] = filled;
  return { id, bag: rest };
}

function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

export function getShape(id: PieceId): Matrix {
  return cloneMatrix(PIECE_SHAPES[id]);
}

function spawnPiece(id: PieceId): ActivePiece {
  const matrix = getShape(id);
  const width = matrix[0].length;
  return {
    id,
    matrix,
    x: Math.floor((COLS - width) / 2),
    y: 0,
  };
}

function dropInterval(level: number): number {
  return Math.max(100, 800 - (level - 1) * 70);
}

export function createGame(): GameState {
  const first = takeNext([]);
  const second = takeNext(first.bag);
  return {
    board: emptyBoard(),
    active: null,
    next: second.id,
    bag: second.bag,
    score: 0,
    lines: 0,
    level: 1,
    status: "ready",
    dropMs: dropInterval(1),
  };
}

function collides(board: Matrix, piece: ActivePiece, ox = 0, oy = 0, matrix = piece.matrix): boolean {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const nx = piece.x + x + ox;
      const ny = piece.y + y + oy;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function merge(board: Matrix, piece: ActivePiece): Matrix {
  const next = cloneMatrix(board);
  for (let y = 0; y < piece.matrix.length; y += 1) {
    for (let x = 0; x < piece.matrix[y].length; x += 1) {
      const value = piece.matrix[y][x];
      if (!value) continue;
      const ny = piece.y + y;
      const nx = piece.x + x;
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
        next[ny][nx] = value;
      }
    }
  }
  return next;
}

function clearLines(board: Matrix): { board: Matrix; cleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === 0));
  const cleared = ROWS - remaining.length;
  while (remaining.length < ROWS) {
    remaining.unshift(Array<Cell>(COLS).fill(0));
  }
  return { board: remaining, cleared };
}

function rotateMatrix(matrix: Matrix, dir: 1 | -1): Matrix {
  const size = matrix.length;
  const rotated: Matrix = Array.from({ length: size }, () => Array<Cell>(size).fill(0));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (dir === 1) {
        rotated[x][size - 1 - y] = matrix[y][x];
      } else {
        rotated[size - 1 - x][y] = matrix[y][x];
      }
    }
  }
  return rotated;
}

const KICKS: Point[] = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -2, y: 0 },
  { x: 2, y: 0 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
];

function lockPiece(state: GameState): GameState {
  if (!state.active) return state;
  const merged = merge(state.board, state.active);
  const { board, cleared } = clearLines(merged);
  const lines = state.lines + cleared;
  const level = Math.floor(lines / 10) + 1;
  const score = state.score + LINE_SCORES[cleared] * Math.max(1, level);

  const drawn = takeNext([...state.bag]);
  const active = spawnPiece(state.next);
  if (collides(board, active)) {
    return {
      ...state,
      board,
      active: null,
      next: drawn.id,
      bag: drawn.bag,
      score,
      lines,
      level,
      status: "over",
      dropMs: dropInterval(level),
    };
  }

  return {
    ...state,
    board,
    active,
    next: drawn.id,
    bag: drawn.bag,
    score,
    lines,
    level,
    dropMs: dropInterval(level),
  };
}

export function startGame(state: GameState): GameState {
  if (state.status === "playing") return state;
  if (state.status === "paused") {
    return { ...state, status: "playing" };
  }
  const first = takeNext([]);
  const second = takeNext(first.bag);
  const piece = spawnPiece(first.id);
  return {
    board: emptyBoard(),
    active: piece,
    next: second.id,
    bag: second.bag,
    score: 0,
    lines: 0,
    level: 1,
    status: "playing",
    dropMs: dropInterval(1),
  };
}

export function togglePause(state: GameState): GameState {
  if (state.status === "playing") return { ...state, status: "paused" };
  if (state.status === "paused") return { ...state, status: "playing" };
  return state;
}

export function move(state: GameState, dx: number, dy: number): GameState {
  if (state.status !== "playing" || !state.active) return state;
  if (collides(state.board, state.active, dx, dy)) {
    if (dy > 0) return lockPiece(state);
    return state;
  }
  return {
    ...state,
    active: { ...state.active, x: state.active.x + dx, y: state.active.y + dy },
    score: dy > 0 ? state.score + 1 : state.score,
  };
}

export function softDrop(state: GameState): GameState {
  return move(state, 0, 1);
}

export function hardDrop(state: GameState): GameState {
  if (state.status !== "playing" || !state.active) return state;
  let next = state;
  let distance = 0;
  while (next.active && !collides(next.board, next.active, 0, 1)) {
    next = {
      ...next,
      active: { ...next.active, y: next.active.y + 1 },
    };
    distance += 1;
  }
  const locked = lockPiece({
    ...next,
    score: next.score + distance * 2,
  });
  return locked;
}

export function rotate(state: GameState, dir: 1 | -1 = 1): GameState {
  if (state.status !== "playing" || !state.active) return state;
  if (state.active.id === "O") return state;
  const rotated = rotateMatrix(state.active.matrix, dir);
  for (const kick of KICKS) {
    if (!collides(state.board, state.active, kick.x, kick.y, rotated)) {
      return {
        ...state,
        active: {
          ...state.active,
          matrix: rotated,
          x: state.active.x + kick.x,
          y: state.active.y + kick.y,
        },
      };
    }
  }
  return state;
}

export function tick(state: GameState): GameState {
  if (state.status !== "playing") return state;
  return softDrop(state);
}

export function ghostY(state: GameState): number | null {
  if (!state.active) return null;
  let y = state.active.y;
  while (!collides(state.board, { ...state.active, y }, 0, 1)) {
    y += 1;
  }
  return y;
}

export function renderCells(state: GameState): Matrix {
  if (!state.active) return cloneMatrix(state.board);
  return merge(state.board, state.active);
}

/** Cells for ghost overlay (true = ghost only, not solid). */
export function isGhostCell(state: GameState, x: number, y: number): boolean {
  if (!state.active) return false;
  const gy = ghostY(state);
  if (gy === null || gy === state.active.y) return false;
  if (state.board[y][x]) return false;

  for (let py = 0; py < state.active.matrix.length; py += 1) {
    for (let px = 0; px < state.active.matrix[py].length; px += 1) {
      if (!state.active.matrix[py][px]) continue;
      if (state.active.x + px === x && gy + py === y) {
        // Not occupied by the live piece
        for (let ay = 0; ay < state.active.matrix.length; ay += 1) {
          for (let ax = 0; ax < state.active.matrix[ay].length; ax += 1) {
            if (
              state.active.matrix[ay][ax] &&
              state.active.x + ax === x &&
              state.active.y + ay === y
            ) {
              return false;
            }
          }
        }
        return true;
      }
    }
  }
  return false;
}
