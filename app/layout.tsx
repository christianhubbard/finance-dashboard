import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
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
    <html
      lang="en"
      className={`${publicSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ColorModeScript />
      </head>
      <body className="min-h-full flex font-sans text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
