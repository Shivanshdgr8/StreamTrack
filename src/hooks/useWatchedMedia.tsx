'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import type { Movie, Series } from "@/lib/tmdb";
import { firestore, firebaseEnabled } from "@/lib/firebase";

type WatchedContextValue = {
  watchedMovies: Movie[];
  watchedSeries: Series[];
  markMovieWatched: (movie: Movie) => Promise<void>;
  markSeriesWatched: (series: Series) => Promise<void>;
  isMovieWatched: (id: number) => boolean;
  isSeriesWatched: (id: number) => boolean;
  isSyncing: boolean;
};

const WatchedContext = createContext<WatchedContextValue | null>(null);

const useProvideWatched = (): WatchedContextValue => {
  const { user } = useAuth();
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [watchedSeries, setWatchedSeries] = useState<Series[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (!firebaseEnabled || !firestore || !user) {
      setWatchedMovies([]);
      setWatchedSeries([]);
      setIsSyncing(false);
      return;
    }

    setIsSyncing(true);
    let moviesReady = false;
    let seriesReady = false;
    const finishIfReady = () => {
      if (moviesReady && seriesReady) {
        setIsSyncing(false);
      }
    };

    const moviesRef = collection(
      firestore,
      "users",
      user.uid,
      "watchedMovies",
    );
    const seriesRef = collection(
      firestore,
      "users",
      user.uid,
      "watchedSeries",
    );

    const unsubscribeMovies = onSnapshot(moviesRef, (snapshot) => {
      const items = snapshot.docs.map((docItem) => docItem.data() as Movie);
      setWatchedMovies(items);
      moviesReady = true;
      finishIfReady();
    });

    const unsubscribeSeries = onSnapshot(seriesRef, (snapshot) => {
      const items = snapshot.docs.map((docItem) => docItem.data() as Series);
      setWatchedSeries(items);
      seriesReady = true;
      finishIfReady();
    });

    return () => {
      unsubscribeMovies();
      unsubscribeSeries();
    };
  }, [user, firestore, firebaseEnabled]);

  const markMovieWatched = useCallback(
    async (movie: Movie) => {
      if (!firebaseEnabled || !firestore) {
        throw new Error(
          "Firebase is not configured. Add Firebase credentials to enable watched sync.",
        );
      }
      if (!user) throw new Error("Login required");
      await setDoc(
        doc(
          firestore,
          "users",
          user.uid,
          "watchedMovies",
          movie.id.toString(),
        ),
        movie,
        { merge: true },
      );
    },
    [user],
  );

  const markSeriesWatched = useCallback(
    async (series: Series) => {
      if (!firebaseEnabled || !firestore) {
        throw new Error(
          "Firebase is not configured. Add Firebase credentials to enable watched sync.",
        );
      }
      if (!user) throw new Error("Login required");
      await setDoc(
        doc(
          firestore,
          "users",
          user.uid,
          "watchedSeries",
          series.id.toString(),
        ),
        series,
        { merge: true },
      );
    },
    [user],
  );

  const value = useMemo<WatchedContextValue>(
    () => ({
      watchedMovies,
      watchedSeries,
      markMovieWatched,
      markSeriesWatched,
      isMovieWatched: (id: number) =>
        watchedMovies.some((movie) => movie.id === id),
      isSeriesWatched: (id: number) =>
        watchedSeries.some((item) => item.id === id),
      isSyncing,
    }),
    [
      watchedMovies,
      watchedSeries,
      isSyncing,
      markMovieWatched,
      markSeriesWatched,
    ],
  );

  return value;
};

export const WatchedProvider = ({ children }: { children: ReactNode }) => {
  const value = useProvideWatched();
  return (
    <WatchedContext.Provider value={value}>
      {children}
    </WatchedContext.Provider>
  );
};

export const useWatchedMedia = () => {
  const context = useContext(WatchedContext);
  if (!context) {
    throw new Error("useWatchedMedia must be used inside WatchedProvider.");
  }
  return context;
};

