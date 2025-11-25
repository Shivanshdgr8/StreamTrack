'use client';

import type { ReactNode } from "react";

import { AuthProvider } from "@/context/AuthContext";
import { WatchedProvider } from "@/hooks/useWatchedMedia";

const ClientProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <WatchedProvider>{children}</WatchedProvider>
    </AuthProvider>
  );
};

export default ClientProviders;



