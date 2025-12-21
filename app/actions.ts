'use server'

import { searchMulti, getWatchProviders } from "@/lib/tmdb";

export async function searchContent(query: string) {
    try {
        const data = await searchMulti(query);
        return data.results || [];
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}

export async function fetchWatchProviders(type: 'movie' | 'tv', id: string) {
    try {
        const data = await getWatchProviders(type, id);
        // Default to IN (India) or US as fallback
        return data?.results?.['IN']?.flatrate || data?.results?.['US']?.flatrate || null;
    } catch (error) {
        console.error("Provider fetch error:", error);
        return null;
    }
}
