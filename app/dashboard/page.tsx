"use client";

import { useMediaList, MediaItem } from "@/hooks/useMediaList";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { Loader2, Clapperboard, Tv } from "lucide-react";
import MediaCard from "@/components/MediaCard";

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const { watchlist, watched, loading: listLoading } = useMediaList();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<'watchlist' | 'watched'>('watchlist');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    // Handle tab change based on URL query param
    useEffect(() => {
        if (tabParam === 'watched') setActiveTab('watched');
        else if (tabParam === 'watch-later') setActiveTab('watchlist');
    }, [tabParam]);


    if (authLoading || listLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
            </div>
        );
    }

    if (!user) return null;

    const currentList = activeTab === 'watchlist' ? watchlist : watched;
    const movies = currentList.filter(i => i.type === 'movie');
    const shows = currentList.filter(i => i.type === 'tv');

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                {user.photoURL && (
                    <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white/20" />
                )}
                <div>
                    <h1 className="text-3xl font-bold">
                        {activeTab === 'watchlist' ? 'Watch Later' : 'Watched History'}
                    </h1>
                    <p className="text-gray-400">
                        {activeTab === 'watchlist'
                            ? `${watchlist.length} items to watch`
                            : `${watched.length} items watched`}
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {/* Movies Section */}
                {movies.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                            <Clapperboard className="w-5 h-5 text-fuchsia-400" />
                            Movies
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {movies.map(item => (
                                <MediaCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* TV Shows Section */}
                {shows.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                            <Tv className="w-5 h-5 text-purple-400" />
                            TV Shows
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {shows.map(item => (
                                <MediaCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {currentList.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">No items in this list yet.</p>
                        <Link href="/search" className="text-fuchsia-500 hover:underline mt-2 inline-block">
                            Find something to watch
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

