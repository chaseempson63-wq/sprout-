import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteIntro } from "./_components/SiteIntro";
import "./globals.css";

// Nunito: the rounded, warm voice of the entire product. Mirrors the app's
// SF Pro Rounded interior. One friendly rounded family from body to display,
// with weight (not a second typeface) carrying the hierarchy. Variable font,
// full weight range loaded.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

// Geist Mono: kept only for the occasional monospace accent.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hisprout.app"),
  title: "Sprout — Prove the week counted",
  description:
    "A weekly reflection of your child's homeschool journey. Sunday-night relief, not 3am anxiety.",
};

// Pre-paint gate for the site-wide page-load intro (SiteIntro). Runs
// synchronously before first paint so every full load shows the curtain
// immediately, and reduced-motion / no-JS visitors never flash it. The
// component takes over once hydrated (drives "play" → "reveal" → "off").
const INTRO_GATE =
  "(()=>{try{var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.setAttribute('data-site-intro',rm?'off':'play');}catch(e){document.documentElement.setAttribute('data-site-intro','off');}})()";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Pre-paint gate must run before the overlay below is parsed. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        <SiteIntro />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
