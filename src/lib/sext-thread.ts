/** Escalating sext thread. Incoming = her persona. Outgoing = timid gooner → braver. */

import type { HeatStage, Persona, PersonaPic } from "./personas";

export type { HeatStage };
export type ChatSide = "in" | "out";

export type ChatLine = {
  text: string;
  side: ChatSide;
  image?: string;
};

const OUT: Record<HeatStage, string[]> = {
  0: [
    "um. i cleared one",
    "sorry that was messy",
    "i did a little thing",
    "hi. i'm still here",
    "was that okay",
    "that was nothing. i can try again",
    "i'm listening. i swear",
  ],
  1: [
    "another one… for you",
    "i'm trying not to bust",
    "that felt kinda good",
    "don't look too close",
    "still edging. promise",
    "i did that thinking about you",
    "tell me it was cute",
  ],
  2: [
    "i wanted you to see that",
    "getting harder to hold it",
    "tell me to keep going",
    "i can do sloppier",
    "that one leaked a bit",
    "say good boy and i'll do another",
    "i'm getting needy. ignore that",
  ],
  3: [
    "that was for your inbox",
    "i'm not tapping out",
    "say it again and i'll dump more",
    "my hands are shaking. still playing",
    "i want the next one messier",
    "use me for the next line",
    "i'll be good if you keep talking",
  ],
  4: [
    "take it. i'm not stopping",
    "ruining this on purpose",
    "you made me this desperate",
    "don't let me think. just reply",
    "i'll milk the well till you say stop",
    "tell me i belong here",
    "i'm yours till the well floods",
  ],
};

const OUT_OTHER: Record<HeatStage, string[]> = {
  0: ["um. still playing", "this piece is. a lot"],
  1: ["don't judge the next drop", "i'm holding it"],
  2: ["tell me where to put it", "getting needy"],
  3: ["i want you watching this one", "say dump"],
  4: ["i'm not asking anymore", "take the next one"],
};

const OUT_PIC: Record<HeatStage, string[]> = {
  0: ["um. is that you", "wait. you sent a pic?"],
  1: ["oh. hi. that's… you", "i wasn't ready for that"],
  2: ["you're actually real", "i'm staring. sorry"],
  3: ["send another if i last", "that's staying on my screen"],
  4: ["don't take it back", "i'll play dirtier for another"],
};

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

const recentInn = new Map<string, string[]>();

function pickFresh(key: string, items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  const used = recentInn.get(key) ?? [];
  const fresh = items.filter((s) => !used.includes(s));
  const choice = pick(fresh.length ? fresh : items);
  const keep = Math.min(Math.max(6, Math.floor(items.length * 0.55)), items.length - 1);
  recentInn.set(key, [...used, choice].slice(-keep));
  return choice;
}

function outLine(stage: HeatStage, name: string): string {
  const extras =
    stage >= 3
      ? [`that was for ${name.toLowerCase()}`, `don't look away ${name.toLowerCase()}`]
      : [];
  return pick([...OUT[stage], ...extras]);
}

export function heatStage(lines: number, level: number, goonMode: boolean): HeatStage {
  if (goonMode || lines >= 36 || level >= 6) return 4;
  if (lines >= 22 || level >= 4) return 3;
  if (lines >= 12 || level >= 3) return 2;
  if (lines >= 5) return 1;
  return 0;
}

export function threadForIntro(persona: Persona): ChatLine {
  return { text: pickFresh(`${persona.id}:intro`, persona.voice.intro), side: "in" };
}

export function threadForClear(
  persona: Persona,
  stage: HeatStage,
  linesCleared: number,
  combo: number,
): { out: ChatLine; inn: ChatLine } {
  const bucket =
    linesCleared >= 4
      ? persona.voice.innTetris[stage]
      : combo >= 2
        ? persona.voice.innCombo[stage]
        : persona.voice.inn[stage];
  const key =
    linesCleared >= 4
      ? `${persona.id}:tetris:${stage}`
      : combo >= 2
        ? `${persona.id}:combo:${stage}`
        : `${persona.id}:inn:${stage}`;
  return {
    out: { text: outLine(stage, persona.name), side: "out" },
    inn: { text: pickFresh(key, bucket), side: "in" },
  };
}

export function threadForPic(
  persona: Persona,
  pic: PersonaPic,
  stage: HeatStage,
): { out: ChatLine; inn: ChatLine } {
  return {
    out: { text: pick(OUT_PIC[stage]), side: "out" },
    inn: {
      text: pickFresh(`${persona.id}:pic`, [pic.caption, ...persona.voice.innPic]),
      side: "in",
      image: pic.src,
    },
  };
}

export function threadForBust(persona: Persona, stage: HeatStage): ChatLine {
  return { text: pickFresh(`${persona.id}:bust:${stage}`, persona.voice.innBust[stage]), side: "in" };
}

export function maybeFlirt(
  persona: Persona,
  stage: HeatStage,
  chance = 0.38,
): ChatLine | null {
  if (Math.random() > chance) return null;
  if (Math.random() < 0.32) return { text: pick(OUT_OTHER[stage]), side: "out" };
  return {
    text: pickFresh(`${persona.id}:other:${stage}`, persona.voice.innOther[stage]),
    side: "in",
  };
}
