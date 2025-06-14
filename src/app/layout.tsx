import type { Metadata } from "next";

import { Toaster } from "sonner";

import { ThemeProvider } from "@/providers/theme-provider";
import { geistMono, geistSans } from "@/styles/fonts";
import { TRPCReactProvider } from "@/trpc/react";

import "../styles/globals.css";

export const metadata: Metadata = {
  description: "Generated by create next app",
  title: "Create Next App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <TRPCReactProvider>
            {children}
            <Toaster position="top-center" richColors />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
