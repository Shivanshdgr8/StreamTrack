'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/providers", label: "Providers" },
  { href: "/watched", label: "Watched" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userName, logout, loading, authReady } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const activeMap = useMemo(() => {
    return navItems.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.href] =
        item.href === "/"
          ? pathname === item.href
          : pathname?.startsWith(item.href);
      return acc;
    }, {});
  }, [pathname]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          StreamTrack
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition ${
                  activeMap[item.href]
                    ? "bg-blue-500 text-white shadow-xl shadow-blue-500/30"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {!loading && (
            <div className="flex items-center gap-3">
              {authReady ? (
                user ? (
                <>
                  <span className="hidden text-xs text-slate-400 sm:inline">
                    {userName || user.displayName || user.email?.split("@")[0] || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-60"
                  >
                    {isSigningOut ? "Signing out..." : "Logout"}
                  </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="rounded-full border border-blue-500/40 bg-blue-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                      Login
                    </Link>
                  )
              ) : (
                <span className="text-xs text-amber-300">
                  Auth not configured
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;



