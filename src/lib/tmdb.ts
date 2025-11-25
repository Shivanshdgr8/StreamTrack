const BASE_URL = "https://api.themoviedb.org/3";
const REGION = process.env.TMDB_REGION ?? "IN";
const MAX_RETRIES = Number(process.env.TMDB_MAX_RETRIES ?? 2);
const TIMEOUT_MS = Number(process.env.TMDB_TIMEOUT_MS ?? 8000);

type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
};

type WatchProvidersPayload = {
  id: number;
  results: Record<
    string,
    {
      flatrate?: WatchProvider[];
      ads?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    }
  >;
};

type TMDBResponse<T> = {
  results: T[];
};

type BaseMedia = {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  popularity: number;
  genre_ids?: number[];
  watchProviders?: WatchProvider[];
};

export type Movie = BaseMedia & {
  title: string;
  release_date?: string;
  media_type?: "movie";
};

export type Series = BaseMedia & {
  name: string;
  first_air_date?: string;
  media_type?: "tv";
};

export type MediaItem = Movie | Series;

export type Provider = WatchProvider;

const getApiKey = () => {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY is missing. Add it to .env.local to use the TMDB helpers.",
    );
  }
  return key;
};

const buildUrl = (
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", getApiKey());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

const retryableCodes = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error: unknown) => {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as NodeJS.ErrnoException).code === "string"
  ) {
    return retryableCodes.has((error as NodeJS.ErrnoException).code!);
  }

  return false;
};

const tmdbFetch = async <T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
  attempt = 0,
): Promise<T> => {
  const url = buildUrl(endpoint, params);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 },
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[tmdbFetch] ${endpoint} responded ${response.status}`, body);
      throw new Error("Unable to communicate with TMDB right now.");
    }

    return (await response.json()) as T;
  } catch (error) {
    const canRetry = attempt < MAX_RETRIES && shouldRetry(error);

    if (canRetry) {
      const delay = 250 * Math.pow(2, attempt);
      console.warn(
        `[tmdbFetch] attempt ${attempt + 1} failed for ${endpoint}, retrying in ${delay}ms`,
        error,
      );
      await sleep(delay);
      return tmdbFetch<T>(endpoint, params, attempt + 1);
    }

    console.error(`[tmdbFetch] request failed permanently for ${endpoint}`, error);
    throw new Error("Unable to communicate with TMDB right now.");
  } finally {
    clearTimeout(timeout);
  }
};

const extractWatchProviders = (
  payload: WatchProvidersPayload | null,
): WatchProvider[] => {
  if (!payload?.results) return [];

  const regionalProviders =
    payload.results[REGION] ??
    payload.results["US"] ??
    payload.results["GB"] ??
    {};

  const flatrate = regionalProviders.flatrate ?? [];
  const ads = regionalProviders.ads ?? [];
  const rent = regionalProviders.rent ?? [];
  const buy = regionalProviders.buy ?? [];

  const merged = [...flatrate, ...ads, ...rent, ...buy] as WatchProvider[];

  const unique = new Map<number, WatchProvider>();
  merged.forEach((provider) => {
    if (!unique.has(provider.provider_id)) {
      unique.set(provider.provider_id, provider);
    }
  });

  return Array.from(unique.values()).slice(0, 4);
};

export const enrichWithProviders = async <T extends Movie | Series>(
  list: T[],
  type: "movie" | "tv",
  limit = 12,
): Promise<T[]> => {
  const trimmed = list.slice(0, limit);

  return Promise.all(
    trimmed.map(async (item) => {
      try {
        const providers = await tmdbFetch<WatchProvidersPayload>(
          `/${type}/${item.id}/watch/providers`,
        );
        return {
          ...item,
          media_type: type,
          watchProviders: extractWatchProviders(providers),
        } as T;
      } catch {
        return { ...item, media_type: type, watchProviders: [] } as T;
      }
    }),
  );
};

export const enrichMixedMedia = async (
  items: MediaItem[],
  limitPerType = 12,
) => {
  const movies = items.filter(
    (item): item is Movie =>
      (item.media_type ?? "movie") === "movie" && "title" in item,
  );
  const series = items.filter(
    (item): item is Series =>
      (item.media_type ?? "tv") === "tv" && "name" in item,
  );

  const [movieResults, seriesResults] = await Promise.all([
    enrichWithProviders(movies, "movie", limitPerType),
    enrichWithProviders(series, "tv", limitPerType),
  ]);

  return [...movieResults, ...seriesResults];
};

export const getTrendingMovies = async () => {
  const data = await tmdbFetch<TMDBResponse<Movie>>("/trending/movie/week");
  return enrichWithProviders(data.results, "movie");
};

export const getTrendingSeries = async () => {
  const data = await tmdbFetch<TMDBResponse<Series>>("/trending/tv/week");
  return enrichWithProviders(data.results, "tv");
};

export const getProviders = async () => {
  const [movieProviders, tvProviders] = await Promise.all([
    tmdbFetch<TMDBResponse<Provider>>("/watch/providers/movie", {
      watch_region: REGION,
    }),
    tmdbFetch<TMDBResponse<Provider>>("/watch/providers/tv", {
      watch_region: REGION,
    }),
  ]);

  const merged = [...movieProviders.results, ...tvProviders.results];
  const unique = new Map<number, Provider>();

  merged.forEach((provider) => {
    if (!unique.has(provider.provider_id)) {
      unique.set(provider.provider_id, provider);
    }
  });

  return Array.from(unique.values()).sort(
    (a, b) => (a.display_priority ?? 999) - (b.display_priority ?? 999),
  );
};

export const getByProvider = async (providerId: number) => {
  const [movies, series] = await Promise.all([
    tmdbFetch<TMDBResponse<Movie>>("/discover/movie", {
      with_watch_providers: providerId,
      watch_region: REGION,
      include_adult: "false",
      sort_by: "popularity.desc",
    }),
    tmdbFetch<TMDBResponse<Series>>("/discover/tv", {
      with_watch_providers: providerId,
      watch_region: REGION,
      include_adult: "false",
      sort_by: "popularity.desc",
    }),
  ]);

  return {
    movies: await enrichWithProviders(movies.results, "movie", 18),
    series: await enrichWithProviders(series.results, "tv", 18),
  };
};

export const searchMulti = async (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const data = await tmdbFetch<TMDBResponse<Movie | Series>>("/search/multi", {
    query: normalizedQuery,
    include_adult: "false",
  });

  const filtered = data.results.filter(
    (item) => item.media_type === "movie" || item.media_type === "tv",
  );

  return enrichMixedMedia(filtered, 10);
};

