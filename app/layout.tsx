import type { Metadata } from "next";
import "./globals.css";

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
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/amarante/v29/xMQXuF1KTa6EvGx9bq-3.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/jersey10/v3/GftH7vZKsggXMf9n_J5X-A.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
