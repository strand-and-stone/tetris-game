import { ImageResponse } from "next/og";

export const alt = "Edge Stack by Strand & Stone — 18+ Tetris";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#080406",
          color: "#ffe6ef",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#b8ff3c", fontWeight: 700 }}>
          Strand & Stone · 18+
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            marginTop: 10,
            color: "#ff4d6d",
            textTransform: "uppercase",
          }}
        >
          Edge Stack
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 16, color: "#c9a0ad" }}>
          {`One more line. Don't bust. No account.`}
        </div>
      </div>
    ),
    { ...size },
  );
}
