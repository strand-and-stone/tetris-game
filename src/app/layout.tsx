import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Teko } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const teko = Teko({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_NAME = "Edge Stack";
const DESCRIPTION =
  "Edge Stack — 18+ late-night Tetris. Clear lines, don't bust, post your score. Touch + keyboard, mobile-ready, no account. By Strand & Stone.";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Edge Stack — 18+ Late-Night Tetris by Strand & Stone",
    template: "%s · Edge Stack",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Tetris",
    "Edge Stack",
    "Strand & Stone",
    "18+",
    "browser game",
    "puzzle game",
    "gooner",
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
    title: "Edge Stack — 18+ Late-Night Tetris by Strand & Stone",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Edge Stack — 18+ Late-Night Tetris by Strand & Stone",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "games",
};

export const viewport: Viewport = {
  themeColor: "#0a0608",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${teko.variable} ${plexMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to game
        </a>
        {children}
      </body>
    </html>
  );
}
