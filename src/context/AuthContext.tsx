'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import {
  auth,
  firestore,
  loginWithEmail,
  signupWithEmail,
  logoutUser,
  loginWithGoogle,
  firebaseEnabled,
} from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const ensureUserDocument = async (firebaseUser: User | null) => {
  if (!firebaseEnabled || !firestore || !firebaseUser) return;
  await setDoc(
    doc(firestore, "users", firebaseUser.uid),
    {
      email: firebaseUser.email,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setLoading(false);
      setUser(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const login = async (email: string, password: string) => {
    if (!firebaseEnabled) {
      throw new Error("Authentication is not configured. Add Firebase env vars.");
    }
    const credential = await loginWithEmail(email, password);
    await ensureUserDocument(credential.user);
  };

  const signup = async (email: string, password: string) => {
    if (!firebaseEnabled) {
      throw new Error("Authentication is not configured. Add Firebase env vars.");
    }
    const credential = await signupWithEmail(email, password);
    await ensureUserDocument(credential.user);
    await logoutUser();
  };

  const logout = async () => {
    if (!firebaseEnabled) {
      throw new Error("Authentication is not configured. Add Firebase env vars.");
    }
    await logoutUser();
  };

  const handleGoogleLogin = async () => {
    if (!firebaseEnabled) {
      throw new Error("Authentication is not configured. Add Firebase env vars.");
    }
    const credential = await loginWithGoogle();
    await ensureUserDocument(credential.user);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authReady: firebaseEnabled,
      login,
      signup,
      logout,
      loginWithGoogle: handleGoogleLogin,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

