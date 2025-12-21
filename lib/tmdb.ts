const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams({
        api_key: TMDB_API_KEY || '',
        language: 'en-US',
        ...params,
    });

    const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${query}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error(`TMDB Error: ${res.statusText}`);
    }

    return res.json();
}

export const getTrending = async () => fetchTMDB('/trending/all/day');
export const getPopularMovies = async () => fetchTMDB('/movie/popular');
export const getTopRatedMovies = async () => fetchTMDB('/movie/top_rated');
export const getPopularSeries = async () => fetchTMDB('/tv/popular');
export const searchMulti = async (query: string) => fetchTMDB('/search/multi', { query });
export const getDetails = async (type: 'movie' | 'tv', id: string) => fetchTMDB(`/${type}/${id}`);
