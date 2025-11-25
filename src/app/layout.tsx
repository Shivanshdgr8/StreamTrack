import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ClientProviders from "@/components/layout/ClientProviders";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamTrack",
  description:
    "Track trending movies and series, filter OTT providers, and manage your watched list.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]`}
      >
        <ClientProviders>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
