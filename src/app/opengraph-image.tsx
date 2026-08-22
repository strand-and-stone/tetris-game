import { ImageResponse } from "next/og";

export const alt = "Edge Stack — 18+ late-night Tetris by Strand & Stone";
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
          background: "linear-gradient(145deg, #14070c 0%, #0a0608 50%, #ff4d6d 160%)",
          color: "#ffe6ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#b8ff3c" }}>
          Strand & Stone · 18+
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#ff4d6d",
            }}
          >
            Edge Stack
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#c9a0ad", maxWidth: 780 }}>
            {`Clear lines. Don't bust. Late-night Tetris for gooners who can hold it.`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {["#5ce1e6", "#ffc857", "#ff4d6d", "#b8ff3c", "#ff3b5c", "#ff7a59", "#ff9f68"].map(
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
