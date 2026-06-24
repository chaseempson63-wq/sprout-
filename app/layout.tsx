import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "Sprout — Prove the week counted",
  description:
    "A weekly reflection of your child's homeschool journey. Sunday-night relief, not 3am anxiety.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
