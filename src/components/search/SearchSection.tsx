'use client';

import { useEffect, useState } from "react";

import MovieCard from "@/components/cards/MovieCard";
import SeriesCard from "@/components/cards/SeriesCard";
import type { MediaItem, Movie, Series } from "@/lib/tmdb";

function isMovie(item: MediaItem): item is Movie {
  return item.media_type === "movie";
}

function isSeries(item: MediaItem): item is Series {
  return item.media_type === "tv";
}

const SearchSection = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Search failed");
        const payload = await response.json();
        setResults(payload.results ?? []);
        setError(null);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Unable to fetch search results right now.");
        }
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <section className="rounded-[var(--radius)] border border-white/5 bg-slate-900/40 p-6 shadow-xl shadow-blue-900/10 backdrop-blur">
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300">
            Universal Search
          </p>
          <h2 className="text-2xl font-semibold">Search your watched movies & shows</h2>
          <p className="text-sm text-slate-400">
            Search for movies or series across every provider.
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a title or cast..."
          className="w-full rounded-[var(--radius)] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-blue-500/0 transition focus:ring-2"
        />
      </div>
      {isLoading && query && (
        <p className="text-sm text-slate-400">Searching for “{query}”...</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {results.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item) =>
            isMovie(item) ? (
              <MovieCard key={`movie-${item.id}`} movie={item} />
            ) : isSeries(item) ? (
              <SeriesCard key={`series-${item.id}`} series={item} />
            ) : null
          )}
        </div>
      )}
    </section>
  );
};

export default SearchSection;



