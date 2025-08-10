import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

// Custom fonts are loaded via CSS @import in globals.css for better performance

export const metadata: Metadata = {
  title: "We Are Losing - Death Journal & Run Log",
  description: "Share your runs, get roasted by AI, and see how others met their doom in the depths of terror. A community tool for We Are Losing players.",
  keywords: ["We Are Losing", "game", "runs", "death journal", "community", "AI roast"],
  authors: [{ name: "We Are Losing Community" }],
  openGraph: {
    title: "We Are Losing - Death Journal & Run Log",
    description: "Share your runs, get roasted by AI, and see how others met their doom in the depths of terror.",
    type: "website",
    locale: "en_US",
    siteName: "We Are Losing - Death Journal",
  },
  twitter: {
    card: "summary_large_image",
    title: "We Are Losing - Death Journal & Run Log",
    description: "Share your runs, get roasted by AI, and see how others met their doom in the depths of terror.",
    creator: "@wearelosing",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts domains for CSS imports */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
