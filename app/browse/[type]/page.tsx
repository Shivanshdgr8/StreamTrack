import { getPopularMovies, getPopularSeries } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BrowsePageProps {
    params: Promise<{
        type: string;
    }>;
}

export default async function BrowsePage({ params }: BrowsePageProps) {
    const { type } = await params;

    // Validate type
    if (type !== 'movie' && type !== 'tv') {
        notFound();
    }

    const isMovie = type === 'movie';
    const title = isMovie ? "Popular Movies" : "Popular TV Shows";

    const data = isMovie ? await getPopularMovies() : await getPopularSeries();

    return (
        <div className="min-h-screen container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {data.results.map((item: any) => (
                    <MediaCard
                        key={item.id}
                        item={item}
                        type={isMovie ? 'movie' : 'tv'}
                    />
                ))}
            </div>
        </div>
    );
}
