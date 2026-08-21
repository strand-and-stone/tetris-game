import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { HighScore } from "@/lib/score-types";

export type { HighScore };

let sqlClient: NeonQueryFunction<false, false> | null = null;
let schemaReady: Promise<void> | null = null;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!sqlClient) {
    sqlClient = neon(url);
  }
  return sqlClient;
}

export async function ensureScoresSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS high_scores (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10000000),
          lines INTEGER NOT NULL CHECK (lines >= 0 AND lines <= 100000),
          level INTEGER NOT NULL CHECK (level >= 1 AND level <= 99),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS high_scores_score_idx
        ON high_scores (score DESC, created_at ASC)
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function listTopScores(limit = 10): Promise<HighScore[]> {
  await ensureScoresSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, name, score, lines, level, created_at
    FROM high_scores
    ORDER BY score DESC, created_at ASC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    score: Number(row.score),
    lines: Number(row.lines),
    level: Number(row.level),
    createdAt: new Date(String(row.created_at)).toISOString(),
  }));
}

export async function insertScore(input: {
  name: string;
  score: number;
  lines: number;
  level: number;
}): Promise<HighScore> {
  await ensureScoresSchema();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO high_scores (name, score, lines, level)
    VALUES (${input.name}, ${input.score}, ${input.lines}, ${input.level})
    RETURNING id, name, score, lines, level, created_at
  `;
  const row = rows[0];
  return {
    id: Number(row.id),
    name: String(row.name),
    score: Number(row.score),
    lines: Number(row.lines),
    level: Number(row.level),
    createdAt: new Date(String(row.created_at)).toISOString(),
  };
}

/** Sanitize player name: 1–12 chars, letters/numbers/spaces only. */
export function sanitizePlayerName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N} ]+/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12);
  if (cleaned.length < 1) return null;
  return cleaned.toUpperCase();
}

export function parseScoreFields(body: unknown): {
  score: number;
  lines: number;
  level: number;
} | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const score = Number(data.score);
  const lines = Number(data.lines);
  const level = Number(data.level);
  if (!Number.isFinite(score) || !Number.isFinite(lines) || !Number.isFinite(level)) {
    return null;
  }
  if (
    score < 0 ||
    score > 10_000_000 ||
    lines < 0 ||
    lines > 100_000 ||
    level < 1 ||
    level > 99 ||
    !Number.isInteger(score) ||
    !Number.isInteger(lines) ||
    !Number.isInteger(level)
  ) {
    return null;
  }
  return { score, lines, level };
}
