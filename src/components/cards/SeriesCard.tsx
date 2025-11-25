'use client';

import Image from "next/image";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useWatchedMedia } from "@/hooks/useWatchedMedia";
import type { Series } from "@/lib/tmdb";

type SeriesCardProps = {
  series: Series;
};

const getPoster = (path: string | null) =>
  path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/400x600/png?text=No+Poster";

const SeriesCard = ({ series }: SeriesCardProps) => {
  const { user } = useAuth();
  const { markSeriesWatched, isSeriesWatched } = useWatchedMedia();
  const watched = isSeriesWatched(series.id);
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
      await markSeriesWatched(series);
      showMessage("Saved to watched");
    } catch (error) {
      showMessage(
        (error as Error).message || "Unable to save this series right now.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="card-surface flex flex-col overflow-hidden">
      <div className="relative h-72 w-full">
        <Image
          src={getPoster(series.poster_path)}
          alt={series.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold">{series.name}</h3>
            <p className="text-sm text-slate-400">
              {series.first_air_date?.slice(0, 4) ?? "TBA"}
            </p>
          </div>
          <button
            onClick={handleClick}
            disabled={watched || isSaving}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              watched
                ? "bg-emerald-500/80 text-white"
                : "bg-purple-600/90 text-white hover:bg-purple-500"
            } disabled:opacity-60`}
          >
            {watched ? "Watched" : isSaving ? "Saving..." : "Mark as Watched"}
          </button>
        </div>
        <p className="line-clamp-3 text-sm text-slate-300">
          {series.overview}
        </p>

        {series.watchProviders && series.watchProviders.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2">
            {series.watchProviders.map((provider) => (
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

export default SeriesCard;



