"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, collection, onSnapshot, query } from "firebase/firestore";

export type MediaType = 'movie' | 'tv';

export interface MediaItem {
    id: string;
    tmdbId: number;
    type: MediaType;
    title: string;
    poster_path: string | null;
    vote_average: number;
    addedAt: number;
    status: 'watched' | 'watchlist';
}

interface MediaListContextType {
    watchlist: MediaItem[];
    watched: MediaItem[];
    loading: boolean;
    stopUpdates: () => void; // New method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addToStatus: (media: any, type: MediaType, status: 'watched' | 'watchlist') => Promise<void>;
    removeFromList: (mediaId: number, type: MediaType) => Promise<void>;
    getItemStatus: (mediaId: number, type: MediaType) => 'watched' | 'watchlist' | null;
}

const MediaListContext = createContext<MediaListContextType>({} as MediaListContextType);

export function MediaListProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
    const [watched, setWatched] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(!!user);
    const [updatesStopped, setUpdatesStopped] = useState(false); // New state

    const stopUpdates = () => setUpdatesStopped(true);

    useEffect(() => {
        if (!user || updatesStopped) { // Check updatesStopped
            if (updatesStopped) return; // Don't clear list if just stopped, or maybe? 
            // If stopped, we just want to cease listening.
            // But if user is null, we clear.
            // Let's keep existing logic:
            if (!user) {
                // eslint-disable-next-line
                setWatchlist([]);
                setWatched([]);
                setLoading(false);
            }
            return;
        }

        const q = query(collection(db, "users", user.uid, "list"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: MediaItem[] = [];
            snapshot.forEach((doc) => {
                items.push(doc.data() as MediaItem);
            });

            setWatchlist(items.filter(i => i.status === 'watchlist').sort((a, b) => b.addedAt - a.addedAt));
            setWatched(items.filter(i => i.status === 'watched').sort((a, b) => b.addedAt - a.addedAt));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, updatesStopped]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addToStatus = async (media: any, type: MediaType, status: 'watched' | 'watchlist') => {
        if (!user) return;

        // Normalize ID
        const docId = `${type}_${media.id}`;

        const item: MediaItem = {
            id: docId,
            tmdbId: media.id,
            type,
            title: media.title || media.name,
            poster_path: media.poster_path,
            vote_average: media.vote_average,
            addedAt: Date.now(),
            status
        };

        try {
            await setDoc(doc(db, "users", user.uid, "list", docId), item);
        } catch (e) {
            console.error("Error adding to list", e);
        }
    };

    const removeFromList = async (mediaId: number, type: MediaType) => {
        if (!user) return;
        const docId = `${type}_${mediaId}`;
        try {
            await deleteDoc(doc(db, "users", user.uid, "list", docId));
        } catch (e) {
            console.error("Error removing", e);
        }
    };

    const getItemStatus = (mediaId: number, type: MediaType): 'watched' | 'watchlist' | null => {
        if (loading) return null; // Avoid flickering during load

        const docId = `${type}_${mediaId}`;
        // Check local state immediately
        const inWatchlist = watchlist.some(i => i.id === docId);
        if (inWatchlist) return 'watchlist';
        const inWatched = watched.some(i => i.id === docId);
        if (inWatched) return 'watched';
        return null;
    };

    return (
        <MediaListContext.Provider value={{
            watchlist,
            watched,
            loading,
            stopUpdates,
            addToStatus,
            removeFromList,
            getItemStatus
        }}>
            {children}
        </MediaListContext.Provider>
    );
}

export const useMediaListContext = () => useContext(MediaListContext);
