"use client";

import { useMediaListContext } from "@/context/MediaListContext";
import type { MediaItem, MediaType } from "@/context/MediaListContext";

// Re-export types for backward compatibility
export type { MediaItem, MediaType };

export function useMediaList() {
    return useMediaListContext();
}
