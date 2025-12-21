import { getTrending, getPopularMovies, getPopularSeries } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Info, Play, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";

export default async function Home() {
  const trending = await getTrending();
  const popularMovies = await getPopularMovies();
  const popularSeries = await getPopularSeries();
  const featured = trending.results[0]; // Just take the first one for hero

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-end pb-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={`${TMDB_IMAGE_BASE_URL}${featured.backdrop_path}`}
            alt={featured.title || featured.name}
            fill
            className="object-cover opacity-60"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 max-w-4xl leading-tight">
            {featured.title || featured.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl line-clamp-3">
            {featured.overview}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/details/${featured.media_type}/${featured.id}`}>
              <Button size="lg" className="gap-2 text-base px-8">
                <Info className="w-5 h-5" />
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Row (Placeholder for now) */}
      <section className="container mx-auto px-4 mt-8">
        <h2 className="text-2xl font-semibold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trending.results.slice(1, 11).map((item: any) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Popular Movies</h2>
          <Link href="/browse/movie" className="text-sm font-medium text-fuchsia-500 hover:text-fuchsia-400 flex items-center gap-1 transition-colors">
            Show more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popularMovies.results.slice(0, 5).map((item: any) => (
            <MediaCard key={item.id} item={item} type="movie" />
          ))}
        </div>
      </section>

      {/* Popular Series */}
      <section className="container mx-auto px-4 mt-12 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Popular TV Shows</h2>
          <Link href="/browse/tv" className="text-sm font-medium text-fuchsia-500 hover:text-fuchsia-400 flex items-center gap-1 transition-colors">
            Show more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popularSeries.results.slice(0, 5).map((item: any) => (
            <MediaCard key={item.id} item={item} type="tv" />
          ))}
        </div>
      </section>
    </div>
  );
}
