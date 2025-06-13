// src/s.ts
import localFont from "next/font/local";

export const geistSans = localFont({
  display: "swap",
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
});

export const geistMono = localFont({
  display: "swap",
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
