import { ImageResponse } from "next/og";

export const alt = "Harbor Stack — playable Tetris by Strand & Stone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(145deg, #c9d6de 0%, #8fa4b0 55%, #1a8a7a 140%)",
          color: "#0f1c24",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 42, fontWeight: 800 }}>
          Strand & Stone
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>
            Harbor Stack
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#102029", maxWidth: 760 }}>
            Classic Tetris in the browser — score, levels, next piece, pause. Keyboard and touch.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          {["#3ecfc8", "#e8b84a", "#6b8cae", "#5ecf8a", "#d96b5c", "#4a7fd4", "#d4894a"].map(
            (color) => (
              <div
                key={color}
                style={{
                  width: 48,
                  height: 48,
                  background: color,
                  borderRadius: 4,
                  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35)",
                }}
              />
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
