'use client';

import MovieCard from "@/components/cards/MovieCard";
import SeriesCard from "@/components/cards/SeriesCard";
import { useWatchedMedia } from "@/hooks/useWatchedMedia";

const EmptyState = ({ label }: { label: string }) => (
  <p className="rounded-[var(--radius)] border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-slate-400">
    Nothing here yet. Mark {label} as watched to see them appear.
  </p>
);

const WatchedBoard = () => {
  const { watchedMovies, watchedSeries, isSyncing } = useWatchedMedia();

  if (isSyncing) {
    return (
      <div className="rounded-[var(--radius)] border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-slate-300">
        Syncing your watched vault...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Watched Movies</h2>
        {watchedMovies.length === 0 ? (
          <EmptyState label="movies" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {watchedMovies.map((movie) => (
              <MovieCard key={`watched-movie-${movie.id}`} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Watched Series</h2>
        {watchedSeries.length === 0 ? (
          <EmptyState label="series" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {watchedSeries.map((series) => (
              <SeriesCard key={`watched-series-${series.id}`} series={series} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WatchedBoard;



