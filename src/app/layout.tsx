import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_NAME = "Harbor Stack";
const DESCRIPTION =
  "Play Harbor Stack — mobile-friendly Tetris by Strand & Stone with touch controls, levels, pause, and a live high-score leaderboard. No account required.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Harbor Stack — Playable Tetris by Strand & Stone",
    template: "%s · Harbor Stack",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Tetris",
    "Harbor Stack",
    "Strand & Stone",
    "browser game",
    "puzzle game",
    "tetromino",
  ],
  authors: [{ name: "Strand & Stone" }],
  creator: "Strand & Stone",
  publisher: "Strand & Stone",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: "Harbor Stack — Playable Tetris by Strand & Stone",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Harbor Stack — Playable Tetris by Strand & Stone",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "games",
};

export const viewport: Viewport = {
  themeColor: "#1a8a7a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${plexMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to game
        </a>
        {children}
      </body>
    </html>
  );
}
