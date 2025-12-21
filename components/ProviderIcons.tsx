"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchWatchProviders } from "@/app/actions";
import { MediaType } from "@/hooks/useMediaList";
import { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";

interface ProviderIconsProps {
    type: MediaType;
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    providers?: any[];
}

export default function ProviderIcons({ type, id, providers: initialProviders }: ProviderIconsProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [providers, setProviders] = useState<any[]>(initialProviders || []);

    useEffect(() => {
        if (initialProviders) {
            setProviders(initialProviders.slice(0, 3));
            return;
        }

        let mounted = true;

        async function load() {
            try {
                const results = await fetchWatchProviders(type, id);
                if (mounted && results && results.length > 0) {
                    setProviders(results.slice(0, 3)); // Limit to 3 icons
                }
            } catch (error) {
                console.error(error);
            }
        }

        load();

        return () => { mounted = false };
    }, [type, id, initialProviders]);

    if (!providers.length) return null;

    return (
        <div className="flex -space-x-1.5 overflow-hidden drop-shadow-md z-20">
            {providers.map((p) => (
                <div key={p.provider_id} className="relative w-6 h-6 rounded-full border border-gray-900 bg-gray-900 shadow-md">
                    <Image
                        src={`${TMDB_IMAGE_BASE_URL}${p.logo_path}`}
                        alt={p.provider_name}
                        fill
                        className="object-cover rounded-full"
                        sizes="24px"
                    />
                </div>
            ))}
        </div>
    );
}
