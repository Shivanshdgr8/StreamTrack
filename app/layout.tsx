import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MediaListProvider } from "@/context/MediaListContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "StreamTrack",
    template: "%s | StreamTrack"
  },
  description: "Track your favorite movies and series across all platforms. Create your watchlist and keep track of what you've seen.",
  keywords: ["movies", "tv shows", "tracker", "streaming", "watchlist", "entertainment"],
  authors: [{ name: "StreamTrack Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://streamtrack.vercel.app", // Placeholder URL
    title: "StreamTrack - Your Ultimate Media Tracker",
    description: "Discover, track, and organize your movie and TV show watching habits.",
    siteName: "StreamTrack",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamTrack",
    description: "Track your favorite movies and series.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased selection:bg-fuchsia-500/30`}>
        <AuthProvider>
          <MediaListProvider>
            <Navbar />
            <main className="pt-16 min-h-[calc(100vh-80px)]">
              {children}
            </main>
            <footer className="w-full py-6 text-center text-sm text-gray-500 border-t border-white/10 bg-black/50">
              <p>
                &copy; 2024 StreamTrack. Developed by{" "}
                <a
                  href="https://shivanshpandey.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fuchsia-500 hover:text-fuchsia-400 font-medium transition-colors"
                >
                  Shivansh
                </a>
              </p>
            </footer>
          </MediaListProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
