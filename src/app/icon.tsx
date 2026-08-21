import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a8a7a",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 22,
            height: 10,
            background: "#3ecfc8",
            boxShadow: "0 8px 0 #e8b84a",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
