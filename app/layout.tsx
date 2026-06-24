import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { ColorModeProvider } from "@/components/shell/ColorModeProvider";
import { ColorModeScript } from "@/components/shell/ColorModeScript";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "finance — Overview",
  description: "Personal finance dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorModeScript />
      </head>
      <body
        className={`${publicSans.variable} min-h-full flex font-sans text-foreground antialiased`}
      >
        <ColorModeProvider>
          <AppShell>{children}</AppShell>
        </ColorModeProvider>
      </body>
    </html>
  );
}
