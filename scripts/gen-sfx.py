#!/usr/bin/env python3
"""Generate slam whoosh/splat and female-register moan WAV bytes."""

from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path

SR = 44100
OUT = Path(__file__).resolve().parents[1] / "public" / "sfx"


def clamp(x: float, lo: float = -1.0, hi: float = 1.0) -> float:
    return lo if x < lo else hi if x > hi else x


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    peak = max((abs(s) for s in samples), default=1.0) or 1.0
    norm = 0.92 / peak
    with wave.open(str(path), "w") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        frames = bytearray()
        for sample in samples:
            frames += struct.pack("<h", int(clamp(sample * norm) * 32767))
        wav.writeframes(frames)


class Biquad:
    def __init__(self) -> None:
        self.x1 = self.x2 = self.y1 = self.y2 = 0.0
        self.b0 = 1.0
        self.b1 = self.b2 = self.a1 = self.a2 = 0.0

    def bandpass(self, hz: float, q: float) -> None:
        w = 2 * math.pi * max(20.0, hz) / SR
        alpha = math.sin(w) / (2 * max(0.2, q))
        cosw = math.cos(w)
        a0 = 1 + alpha
        self.b0 = alpha / a0
        self.b1 = 0.0
        self.b2 = -alpha / a0
        self.a1 = -2 * cosw / a0
        self.a2 = (1 - alpha) / a0

    def lowpass(self, hz: float, q: float) -> None:
        w = 2 * math.pi * max(20.0, hz) / SR
        alpha = math.sin(w) / (2 * max(0.2, q))
        cosw = math.cos(w)
        a0 = 1 + alpha
        self.b0 = (1 - cosw) / 2 / a0
        self.b1 = (1 - cosw) / a0
        self.b2 = (1 - cosw) / 2 / a0
        self.a1 = -2 * cosw / a0
        self.a2 = (1 - alpha) / a0

    def highpass(self, hz: float, q: float) -> None:
        w = 2 * math.pi * max(20.0, hz) / SR
        alpha = math.sin(w) / (2 * max(0.2, q))
        cosw = math.cos(w)
        a0 = 1 + alpha
        self.b0 = (1 + cosw) / 2 / a0
        self.b1 = -(1 + cosw) / a0
        self.b2 = (1 + cosw) / 2 / a0
        self.a1 = -2 * cosw / a0
        self.a2 = (1 - alpha) / a0

    def tick(self, x: float) -> float:
        y = self.b0 * x + self.b1 * self.x1 + self.b2 * self.x2 - self.a1 * self.y1 - self.a2 * self.y2
        self.x2, self.x1 = self.x1, x
        self.y2, self.y1 = self.y1, y
        return y


def env(i: int, n: int, attack: float, release: float) -> float:
    a = max(1, int(n * attack))
    r = max(1, int(n * release))
    if i < a:
        return i / a
    if i > n - r:
        return max(0.0, (n - i) / r)
    return 1.0


def pinkish(n: int, rng: random.Random) -> list[float]:
    out: list[float] = []
    last = 0.0
    for _ in range(n):
        white = rng.uniform(-1.0, 1.0)
        last = last * 0.86 + white * 0.14
        out.append(last * 1.7)
    return out


def make_whoosh(seed: int, dur: float, airy: bool) -> list[float]:
    rng = random.Random(seed)
    n = int(SR * dur)
    noise = pinkish(n, rng)
    hp = Biquad()
    bp = Biquad()
    samples: list[float] = []
    for i, raw in enumerate(noise):
        t = i / n
        hz = 4200 * (1 - t) ** 1.35 + (280 if airy else 160)
        bp.bandpass(hz, 0.85 if airy else 1.15)
        hp.highpass(900 if airy else 500, 0.7)
        e = env(i, n, 0.08, 0.42) * (0.7 + 0.3 * (1 - t))
        samples.append(bp.tick(hp.tick(raw)) * e)
    return samples


def make_splat(seed: int, dur: float, wet: float) -> list[float]:
    rng = random.Random(seed)
    n = int(SR * dur)
    noise = pinkish(n, rng)
    lp = Biquad()
    samples = [0.0] * n
    for i, raw in enumerate(noise):
        t = i / n
        if t < 0.12:
            cut = 380 + t / 0.12 * 2400 * wet
        else:
            cut = 2780 * wet * max(0.04, (1 - (t - 0.12) / 0.88) ** 2.2)
        lp.lowpass(cut, 5.2 + wet * 2)
        e = env(i, n, 0.02, 0.35)
        blorp = math.sin(2 * math.pi * (90 - t * 55) * i / SR) * math.exp(-t * 14) * 0.55
        samples[i] = lp.tick(raw) * e * 0.95 + blorp * e

    drips = 2 + rng.randint(0, 2)
    for d in range(drips):
        start = int(n * (0.18 + d * 0.12 + rng.random() * 0.04))
        length = int(SR * 0.045)
        hz = 190 + rng.random() * 220
        for j in range(length):
            k = start + j
            if k >= n:
                break
            e = env(j, length, 0.08, 0.55)
            samples[k] += math.sin(2 * math.pi * hz * (1 - j / length * 0.45) * j / SR) * e * 0.22
    return samples


def make_dump(seed: int, pitch: float) -> list[float]:
    """Dry plastic lock thud — no wet splat."""
    rng = random.Random(seed)
    n = int(SR * 0.11)
    noise = pinkish(n, rng)
    lp = Biquad()
    hp = Biquad()
    samples = [0.0] * n
    for i, raw in enumerate(noise):
        t = i / n
        lp.lowpass(420 - t * 220, 0.9)
        hp.highpass(80, 0.7)
        e = env(i, n, 0.04, 0.55)
        body = math.sin(2 * math.pi * (pitch - t * 28) * i / SR) * math.exp(-t * 22) * 0.55
        shell = hp.tick(lp.tick(raw)) * 0.18
        samples[i] = (body + shell) * e * 0.7
    return samples


def make_soft_splat(seed: int, flavor: str) -> list[float]:
    """Long, muffled plop — no pops, no extra drips."""
    rng = random.Random(seed)
    specs = {
        "drip": (0.38, 70, 0.22),
        "gush": (0.46, 58, 0.26),
        "kiss": (0.34, 82, 0.2),
        "mud": (0.42, 52, 0.24),
    }
    dur, base, body = specs[flavor]
    n = int(SR * dur)
    noise = pinkish(n, rng)
    lp = Biquad()
    samples = [0.0] * n
    for i, raw in enumerate(noise):
        t = i / n
        cut = 140 + 220 * math.exp(-t * 5.5)
        lp.lowpass(cut, 0.85)
        e = env(i, n, 0.16, 0.58)
        plop = math.sin(2 * math.pi * (base - t * 18) * i / SR) * math.exp(-t * 7) * 0.16
        hush = lp.tick(raw) * 0.22
        samples[i] = (hush + plop) * e * body
    return samples


def make_door() -> list[float]:
    """AIM-style wooden door opening: latch, then a long creak."""
    rng = random.Random(1997)
    n = int(SR * 1.28)
    samples = [0.0] * n
    noise = pinkish(n, rng)
    bp = Biquad()
    hp = Biquad()

    latch = int(0.045 * SR)
    for j in range(latch):
        e = env(j, latch, 0.08, 0.55)
        tick = math.sin(2 * math.pi * 1680 * (1 - j / latch * 0.4) * j / SR)
        samples[j] += (tick * 0.22 + rng.uniform(-1, 1) * 0.18) * e

    for i in range(n):
        t = i / n
        if t < 0.05:
            continue
        local = (t - 0.05) / 0.95
        hz = 340 - 190 * local + 55 * math.sin(local * math.pi * 2.6)
        bp.bandpass(max(90.0, hz), 8.2)
        hp.highpass(160, 0.65)
        e = env(i - int(0.05 * SR), n - int(0.05 * SR), 0.1, 0.28)
        wood = bp.tick(hp.tick(noise[i]))
        scrape = math.sin(2 * math.pi * hz * 0.45 * i / SR) * 0.1
        samples[i] += (wood * 0.9 + scrape) * e * 0.62
    return samples


def make_ping() -> list[float]:
    n = int(SR * 0.42)
    notes = [(0.0, 1174.7), (0.07, 1396.9), (0.145, 1760.0)]
    samples = [0.0] * n
    for start, hz in notes:
        begin = int(start * SR)
        length = int(0.16 * SR)
        for j in range(length):
            k = begin + j
            if k >= n:
                break
            e = env(j, length, 0.06, 0.62)
            tone = math.sin(2 * math.pi * hz * j / SR)
            over = math.sin(2 * math.pi * hz * 2 * j / SR) * 0.12
            samples[k] += (tone + over) * e * 0.22
    return samples


def make_voice(seed: int, voice: dict) -> list[float]:
    rng = random.Random(seed)
    dur = voice["dur"]
    n = int(SR * dur)
    f1f = Biquad()
    f2f = Biquad()
    breath_bp = Biquad()
    breath_bp.bandpass(voice["breath"], 0.65)
    noise = pinkish(n, rng)
    samples: list[float] = []
    phase = 0.0
    for i in range(n):
        t = i / n
        vib = 1 + voice["vib"] * math.sin(2 * math.pi * voice["vib_hz"] * i / SR)
        freq = voice["f0"] * (1 + (voice["glide"] - 1) * t) * vib
        phase += 2 * math.pi * freq / SR
        body = (
            math.sin(phase) * voice["odd"]
            + math.sin(phase * 2) * voice["even"]
            + math.sin(phase * 3) * voice["harsh"]
        )
        f1f.bandpass(voice["f1"] * (1 + 0.06 * math.sin(2 * math.pi * 1.8 * i / SR)), voice["q"])
        f2f.bandpass(voice["f2"], voice["q"] - 0.8)
        voiced = f2f.tick(f1f.tick(body))
        breath = breath_bp.tick(noise[i]) * voice["air"]
        e = env(i, n, voice["atk"], voice["rel"])
        samples.append((voiced + breath) * e * voice["peak"])
    return samples


def make_moan(seed: int, kind: str) -> list[float]:
    rng = random.Random(seed)
    specs = {
        "mmph": (0.48, 310, 0.86, 620, 980, 0.16),
        "nngh": (0.68, 285, 1.22, 540, 1050, 0.18),
        "ahh": (0.92, 340, 1.34, 820, 1280, 0.22),
        "hnng": (0.58, 265, 0.78, 480, 900, 0.17),
    }
    dur, f0, glide, f1, f2, peak = specs[kind]
    n = int(SR * dur)
    f1f = Biquad()
    f2f = Biquad()
    breath_bp = Biquad()
    breath_bp.bandpass(1900, 0.7)
    noise = pinkish(n, rng)
    samples: list[float] = []
    phase = 0.0
    for i in range(n):
        t = i / n
        vib = 1 + 0.018 * math.sin(2 * math.pi * 4.6 * i / SR)
        freq = f0 * (1 + (glide - 1) * (0.15 + 0.7 * t)) * vib
        if kind == "hnng":
            freq = f0 * (1.08 - 0.28 * t) * vib
        phase += 2 * math.pi * freq / SR
        body = (
            math.sin(phase) * 0.72
            + math.sin(phase * 2) * 0.22
            + math.sin(phase * 3) * 0.08
        )
        f1f.bandpass(f1 * (1 + 0.08 * math.sin(2 * math.pi * 2.1 * i / SR)), 6.2)
        f2f.bandpass(f2 * (1 + 0.05 * t), 5.4)
        voiced = f2f.tick(f1f.tick(body))
        breath = breath_bp.tick(noise[i]) * (0.09 if kind == "ahh" else 0.055)
        e = env(i, n, 0.12 if kind != "ahh" else 0.16, 0.28)
        if kind == "ahh" and 0.25 < t < 0.7:
            e *= 1.08
        samples.append((voiced * 0.9 + breath) * e * peak * 4.2)
    return samples


VOICES = [
    {"dur": 0.52, "f0": 392, "glide": 1.12, "f1": 860, "f2": 1420, "q": 5.8, "odd": 0.78, "even": 0.14, "harsh": 0.04, "air": 0.08, "breath": 2100, "vib": 0.02, "vib_hz": 5.2, "atk": 0.14, "rel": 0.32, "peak": 0.55},
    {"dur": 0.7, "f0": 246, "glide": 0.88, "f1": 680, "f2": 1080, "q": 5.2, "odd": 0.7, "even": 0.22, "harsh": 0.07, "air": 0.05, "breath": 1600, "vib": 0.014, "vib_hz": 3.8, "atk": 0.16, "rel": 0.3, "peak": 0.52},
    {"dur": 0.58, "f0": 330, "glide": 1.28, "f1": 790, "f2": 1320, "q": 6.0, "odd": 0.74, "even": 0.16, "harsh": 0.05, "air": 0.07, "breath": 2000, "vib": 0.022, "vib_hz": 4.8, "atk": 0.12, "rel": 0.28, "peak": 0.5},
    {"dur": 0.64, "f0": 208, "glide": 1.06, "f1": 540, "f2": 920, "q": 4.8, "odd": 0.66, "even": 0.24, "harsh": 0.1, "air": 0.04, "breath": 1400, "vib": 0.012, "vib_hz": 3.4, "atk": 0.18, "rel": 0.34, "peak": 0.48},
    {"dur": 0.46, "f0": 370, "glide": 0.84, "f1": 820, "f2": 1500, "q": 6.4, "odd": 0.8, "even": 0.1, "harsh": 0.03, "air": 0.11, "breath": 2300, "vib": 0.026, "vib_hz": 5.6, "atk": 0.1, "rel": 0.36, "peak": 0.47},
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write_wav(OUT / "whoosh-1.wav", make_whoosh(11, 0.26, True))
    write_wav(OUT / "whoosh-2.wav", make_whoosh(29, 0.32, False))
    write_wav(OUT / "splat-1.wav", make_soft_splat(7, "drip"))
    write_wav(OUT / "splat-2.wav", make_soft_splat(19, "gush"))
    write_wav(OUT / "splat-3.wav", make_soft_splat(41, "kiss"))
    write_wav(OUT / "splat-4.wav", make_soft_splat(53, "mud"))
    write_wav(OUT / "dump-1.wav", make_dump(71, 88))
    write_wav(OUT / "dump-2.wav", make_dump(83, 76))
    write_wav(OUT / "dump-3.wav", make_dump(97, 102))
    write_wav(OUT / "ping.wav", make_ping())
    write_wav(OUT / "door.wav", make_door())
    for i, voice in enumerate(VOICES, start=1):
        write_wav(OUT / f"moan-{i}.wav", make_voice(i * 17, voice))
    print(f"wrote {len(list(OUT.glob('*.wav')))} clips to {OUT}")


if __name__ == "__main__":
    main()
