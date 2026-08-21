import { ImageResponse } from "next/og";

export const alt = "Harbor Stack by Strand & Stone";
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
          background: "#102029",
          color: "#e8f0f2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, color: "#3ecfc8", fontWeight: 700 }}>
          Strand & Stone
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, marginTop: 12 }}>
          Harbor Stack
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 18, color: "#b7c5ce" }}>
          Play Tetris instantly — no account, keyboard + touch.
        </div>
      </div>
    ),
    { ...size },
  );
}
