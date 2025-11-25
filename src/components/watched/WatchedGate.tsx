'use client';

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

const WatchedGate = ({ children }: { children: ReactNode }) => {
  const { user, loading, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authReady || loading) return;
    if (!user) {
      router.replace("/login?redirect=/watched");
    }
  }, [user, loading, router, authReady]);

  if (!authReady) {
    return (
      <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-slate-300">
        Authentication is not configured. Add Firebase credentials to enable the watched vault.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-slate-300">
        {loading ? "Checking authentication..." : "Redirecting to login..."}
      </div>
    );
  }

  return <>{children}</>;
};

export default WatchedGate;
