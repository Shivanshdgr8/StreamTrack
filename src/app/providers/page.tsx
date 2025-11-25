import ProviderCard from "@/components/cards/ProviderCard";
import MovieCard from "@/components/cards/MovieCard";
import SeriesCard from "@/components/cards/SeriesCard";
import type { Provider } from "@/lib/tmdb";
import { getByProvider, getProviders } from "@/lib/tmdb";

type ProvidersPageProps = {
  searchParams: Promise<{
    providerId?: string;
  }>;
};

export default async function ProvidersPage({
  searchParams,
}: ProvidersPageProps) {
  const resolvedSearchParams = await searchParams;
  const providerId = resolvedSearchParams.providerId
    ? Number(resolvedSearchParams.providerId)
    : null;

  let providers: Provider[] = [];
  let fetchError: string | null = null;

  try {
    providers = await getProviders();
  } catch (error) {
    console.error("Failed to load providers", error);
    fetchError =
      fetchError ??
      "Unable to load providers from TMDB. Double-check your TMDB_API_KEY and network.";
  }

  const selectedProvider = providers.find(
    (item) => item.provider_id === providerId,
  );

  const catalog =
    providerId && !fetchError
      ? await getByProvider(providerId).catch((error) => {
          console.error("Failed to load provider catalog", error);
          fetchError =
            fetchError ??
            "Unable to load the catalog for this provider right now.";
          return null;
        })
      : null;

  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">OTT Providers</h1>
        <p className="text-sm text-slate-400">
          Tap a provider to load their current TMDB catalog for your region (
          {process.env.TMDB_REGION ?? "IN"}).
        </p>
      </section>

      {fetchError && (
        <div className="rounded-[var(--radius)] border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {fetchError}
        </div>
      )}

      {providers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.provider_id}
              provider={provider}
              isActive={provider.provider_id === providerId}
            />
          ))}
        </div>
      )}

      {catalog && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">
              {selectedProvider?.provider_name ?? "Provider"} Catalog
            </h2>
            <p className="text-sm text-slate-400">
              Movies & series that TMDB lists for this OTT provider, sorted by
              popularity.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Movies</h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.movies.map((movie) => (
                  <MovieCard key={`provider-movie-${movie.id}`} movie={movie} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Series</h3>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catalog.series.map((tv) => (
                  <SeriesCard key={`provider-series-${tv.id}`} series={tv} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

