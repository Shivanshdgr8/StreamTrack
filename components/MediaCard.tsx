"use client";

import Link from "next/link";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import CardActions from "@/components/CardActions";
import ProviderIcons from "@/components/ProviderIcons";
import { MediaItem } from "@/hooks/useMediaList";
import { MediaType } from "@/hooks/useMediaList";

interface MediaCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: MediaItem | any;
    type?: MediaType;
    priority?: boolean;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    providers?: any[];
}

export default function MediaCard({ item, type, priority = false, className = "", providers }: MediaCardProps) {
    const mediaType = type || item.media_type || item.type;
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date || '';
    const year = date.split('-')[0];
    const posterPath = item.poster_path;

    if (!posterPath) return null;

    return (
        <Link
            href={`/details/${mediaType}/${item.id || item.tmdbId}`}
            className={`group relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-900 border border-white/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-fuchsia-500/20 ${className}`}
        >
            <Image
                src={`${TMDB_IMAGE_BASE_URL}${posterPath}`}
                alt={title}
                fill
                className="object-cover"
                priority={priority}
            />

            {/* Always Visible Provider Icons */}
            <div className="absolute top-2 right-2 z-10">
                <ProviderIcons
                    type={mediaType}
                    id={(item.tmdbId || item.id).toString()}
                    providers={providers}
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <div className="flex justify-between items-end gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="font-bold truncate text-white">{title}</p>
                        <p className="text-xs text-gray-400">{year}</p>
                    </div>
                    {/* Actions - Visible on hover, positioned at bottom right */}
                    <div className="shrink-0 mb-1">
                        <CardActions
                            media={item}
                            type={mediaType}
                            showWatchlistBtn={true}
                            showWatchedBtn={true}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
