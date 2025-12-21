'use server'

import { searchMulti } from "@/lib/tmdb";

export async function searchContent(query: string) {
    try {
        const data = await searchMulti(query);
        return data.results || [];
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
