import MovieCard from "@/components/cards/MovieCard";
import SeriesCard from "@/components/cards/SeriesCard";
import SearchSection from "@/components/search/SearchSection";
import type { Movie, Series } from "@/lib/tmdb";
import { getTrendingMovies, getTrendingSeries } from "@/lib/tmdb";

export default async function HomePage() {
  let movies: Movie[] = [];
  let series: Series[] = [];
  let fetchError: string | null = null;

  const [movieResult, seriesResult] = await Promise.allSettled([
    getTrendingMovies(),
    getTrendingSeries(),
  ]);

  if (movieResult.status === "fulfilled") {
    movies = movieResult.value;
  } else {
    console.error("Failed to load trending movies", movieResult.reason);
    fetchError =
      fetchError ??
      "Unable to reach TMDB right now. Check your internet connection or TMDB_API_KEY.";
  }

  if (seriesResult.status === "fulfilled") {
    series = seriesResult.value;
  } else {
    console.error("Failed to load trending series", seriesResult.reason);
    fetchError =
      fetchError ??
      "Unable to reach TMDB right now. Check your internet connection or TMDB_API_KEY.";
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
        <section className="rounded-[var(--radius)] border border-white/5 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent px-6 py-8 shadow-2xl shadow-blue-700/20 sm:px-10">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300">
            StreamTrack
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            Track every movie & series across your OTT world.
          </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300">
          Instantly browse what&apos;s trending, explore catalogs per provider,
          and keep a personal watched vault synced to your account.
        </p>
        </section>
        <SearchSection />
      </div>

      {fetchError && (
        <div className="rounded-[var(--radius)] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {fetchError}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Trending Movies</h2>
            <p className="text-sm text-slate-400">
              Updated hourly from TMDB trends.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Trending Series</h2>
            <p className="text-sm text-slate-400">
              Follow the most-binged shows this week.
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((tv) => (
            <SeriesCard key={tv.id} series={tv} />
          ))}
        </div>
      </section>
    </div>
  );
}
