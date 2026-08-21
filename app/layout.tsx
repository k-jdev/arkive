import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const sfPro = localFont({
  src: "../public/fonts/SF-Pro.woff2",
  variable: "--font-sf-pro",
  display: "swap",
  preload: true,
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arkive.xyz"),
  title: "Arkive — Universal language for AI context",
  description:
    "Arkive is a universal context layer for AI models, keeping project context, decisions, and history understood across Claude, GPT, Gemini, and Grok.",
  icons: {
    icon: [
      { url: "/icons/logo.svg", media: "(prefers-color-scheme: light)" },
      { url: "/icons/logo-white.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
  openGraph: {
    title: "Arkive — Universal language for AI context",
    description:
      "Arkive is a universal context layer for AI models, keeping project context, decisions, and history understood across Claude, GPT, Gemini, and Grok.",
    url: "https://www.arkive.xyz",
    siteName: "Arkive",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arkive — Universal language for AI context",
    description:
      "Arkive is a universal context layer for AI models, keeping project context, decisions, and history understood across Claude, GPT, Gemini, and Grok.",
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", sfPro.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
