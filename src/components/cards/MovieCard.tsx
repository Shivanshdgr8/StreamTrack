'use client';

import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useWatchedMedia } from "@/hooks/useWatchedMedia";
import type { Movie } from "@/lib/tmdb";

type MovieCardProps = {
  movie: Movie;
};

const getPoster = (path: string | null) =>
  path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/400x600/png?text=No+Poster";

const MovieCard = ({ movie }: MovieCardProps) => {
  const { user } = useAuth();
  const { markMovieWatched, isMovieWatched } = useWatchedMedia();
  const watched = isMovieWatched(movie.id);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showMessage = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleClick = async () => {
    if (watched || isSaving) return;
    if (!user) {
      showMessage("Login required");
      return;
    }
    try {
      setIsSaving(true);
      await markMovieWatched(movie);
      showMessage("Saved to watched");
    } catch (error) {
      showMessage(
        (error as Error).message || "Unable to save this movie right now.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="card-surface flex flex-col overflow-hidden">
      <div className="relative h-72 w-full">
        <Image
          src={getPoster(movie.poster_path)}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold">{movie.title}</h3>
            <p className="text-sm text-slate-400">
              {movie.release_date?.slice(0, 4) ?? "TBA"}
            </p>
          </div>
          <button
            onClick={handleClick}
            disabled={watched || isSaving}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              watched
                ? "bg-emerald-500/80 text-white"
                : "bg-blue-600/90 text-white hover:bg-blue-500"
            } disabled:opacity-60`}
          >
            {watched ? "Watched" : isSaving ? "Saving..." : "Mark as Watched"}
          </button>
        </div>
        <p className="line-clamp-3 text-sm text-slate-300">{movie.overview}</p>

        {movie.watchProviders && movie.watchProviders.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {movie.watchProviders.map((provider) => (
              <span key={provider.provider_id} className="badge">
                {provider.logo_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                    alt={provider.provider_name}
                    width={24}
                    height={24}
                  />
                )}
                {provider.provider_name}
              </span>
            ))}
          </div>
        )}

        {feedback && (
          <p className="text-xs text-slate-400" role="status">
            {feedback}
          </p>
        )}
      </div>
    </article>
  );
};

export default MovieCard;

