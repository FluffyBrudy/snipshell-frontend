import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnipShell - Your Personal CLI Snippet Manager",
  description:
    "SnipShell is a simple and effective web app for storing, managing, and organizing your Linux CLI commands, aliases, and notes.",
  keywords:
    "Linux, command, snippets, alias, terminal, CLI, Linux commands, snippet manager",
  authors: [{ name: "FluffyRudy" }, { name: "FluffyBrudy" }],
  openGraph: {
    type: "website",
    url: "https://github.com/FluffyBrudy/SnipShell",
    title: "SnipShell - Your Personal CLI Snippet Manager",
    description:
      "Store and organize your Linux CLI commands and aliases in one place. Simplify your command-line experience.",
    images: [
      {
        url: "https://github.com/FluffyBrudy/SnipShell/logo.png",
        width: 800,
        height: 600,
        alt: "SnipShell Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
