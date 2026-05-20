import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Nunito 700 — scoped to the Sprout mascot's speech bubble in Mascot.tsx.
// The mascot is a character; this font is its voice. Don't apply it
// elsewhere — the rest of the page stays on Geist / Cabinet Grotesk.
const nunito = Nunito({
  variable: "--font-nunito",
  weight: "700",
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
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        {/* Cabinet Grotesk for display headlines — distinct from Geist body
            for proper hierarchy. Free via Fontshare. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800,900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
