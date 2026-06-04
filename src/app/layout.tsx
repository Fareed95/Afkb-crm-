import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { AppShell } from "@/components/shared/app-shell";

const fontSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "AFKB Tailor Management",
  description: "Tailor shop processing, billing, and accounting."
};


import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextTopLoader color="#ea580c" showSpinner={false} shadow="0 0 10px #ea580c,0 0 5px #ea580c" />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
