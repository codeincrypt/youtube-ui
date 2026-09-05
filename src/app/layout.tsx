import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import AppShell from "@/components/AppShell";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YouTube",
  description: "A YouTube interface built with Next.js and the YouTube Data API.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
