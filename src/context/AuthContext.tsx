'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

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
  userName: string | null;
  loading: boolean;
  authReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
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
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
};

const getUserName = async (firebaseUser: User | null): Promise<string | null> => {
  if (!firebaseEnabled || !firestore || !firebaseUser) return null;
  try {
    const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.name || null;
    }
  } catch (error) {
    console.error("Error fetching user name:", error);
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      setLoading(false);
      setUser(null);
      setUserName(null);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const name = await getUserName(firebaseUser);
        setUserName(name);
      } else {
        setUserName(null);
      }
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
    const name = await getUserName(credential.user);
    setUserName(name);
  };

  const signup = async (email: string, password: string, name?: string) => {
    if (!firebaseEnabled) {
      throw new Error("Authentication is not configured. Add Firebase env vars.");
    }
    const credential = await signupWithEmail(email, password);
    
    // Update displayName if name is provided
    if (name && credential.user) {
      await updateProfile(credential.user, {
        displayName: name,
      });
    }
    
    // Save name to Firestore
    if (name && firestore && credential.user) {
      await setDoc(
        doc(firestore, "users", credential.user.uid),
        {
          email: credential.user.email,
          name: name,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
    } else {
      await ensureUserDocument(credential.user);
    }
    
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
    const name = await getUserName(credential.user);
    setUserName(name);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      userName,
      loading,
      authReady: firebaseEnabled,
      login,
      signup,
      logout,
      loginWithGoogle: handleGoogleLogin,
    }),
    [user, userName, loading],
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

