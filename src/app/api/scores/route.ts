import { NextResponse } from "next/server";
import {
  insertScore,
  listTopScores,
  parseScoreFields,
  sanitizePlayerName,
} from "@/lib/scores";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateBucket = new Map<string, { count: number; reset: number }>();

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

function allowSubmit(key: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(key);
  if (!entry || entry.reset < now) {
    rateBucket.set(key, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 8) return false;
  entry.count += 1;
  return true;
}

export async function GET() {
  try {
    const scores = await listTopScores(10);
    return NextResponse.json({ scores });
  } catch (error) {
    console.error("scores GET failed", error);
    return NextResponse.json(
      { scores: [], error: "Leaderboard unavailable" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!allowSubmit(clientKey(request))) {
    return NextResponse.json({ error: "Too many submissions" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = sanitizePlayerName(
    body && typeof body === "object" ? (body as Record<string, unknown>).name : null,
  );
  const fields = parseScoreFields(body);
  if (!name || !fields) {
    return NextResponse.json(
      { error: "Invalid name or score fields" },
      { status: 400 },
    );
  }

  try {
    const score = await insertScore({ name, ...fields });
    const scores = await listTopScores(10);
    return NextResponse.json({ score, scores });
  } catch (error) {
    console.error("scores POST failed", error);
    return NextResponse.json({ error: "Could not save score" }, { status: 503 });
  }
}
