import { getDetails, getWatchProviders, TMDB_IMAGE_BASE_URL } from "@/lib/tmdb";
import { MediaType } from "@/hooks/useMediaList";
import Image from "next/image";
import MediaActions from "@/components/MediaActions";
import { Star } from "lucide-react";

interface PageProps {
    params: Promise<{
        type: string;
        id: string;
    }>;
}

export default async function DetailsPage({ params }: PageProps) {
    const { type, id } = await params;
    const mediaType = type as MediaType;
    const mediaPromise = getDetails(mediaType, id);
    const providersPromise = getWatchProviders(mediaType, id);
    const [media, providersData] = await Promise.all([mediaPromise, providersPromise]);

    // Default to IN (India) or US as fallback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const providers = providersData?.results?.['IN'] || providersData?.results?.['US'];
    const flatrate = providers?.flatrate || [];

    return (
        <div className="min-h-screen pb-20">
            <div className="relative h-[60vh] w-full">
                <Image
                    src={`${TMDB_IMAGE_BASE_URL}${media.backdrop_path}`}
                    alt={media.title || media.name}
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 flex items-end gap-8">
                    <div className="hidden md:block relative w-48 h-72 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <Image
                            src={`${TMDB_IMAGE_BASE_URL}${media.poster_path}`}
                            alt={media.title || media.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 mb-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{media.title || media.name}</h1>
                        <div className="flex items-center gap-6 text-gray-300 mb-6">
                            <span className="flex items-center gap-1 text-yellow-500">
                                <Star className="fill-yellow-500 w-4 h-4" />
                                {media.vote_average.toFixed(1)}
                            </span>
                            <span>{media.release_date || media.first_air_date}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-sm">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {media.genres?.map((g: any) => g.name).join(', ')}
                            </span>
                            {media.runtime && <span>{media.runtime} min</span>}
                            {media.number_of_seasons && <span>{media.number_of_seasons} Seasons</span>}
                        </div>

                        <MediaActions media={media} type={mediaType} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-gray-300 leading-relaxed text-lg mb-8">{media.overview}</p>

                    {/* Cast if available? I didn't fetch cast directly but could exist in appended response if requested */}
                </div>
                <div>
                    {/* Sidebar info could go here */}
                    {media.tagline && (
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Tagline</h3>
                            <p className="italic text-gray-200">&quot;{media.tagline}&quot;</p>
                        </div>
                    )}

                    {flatrate && flatrate.length > 0 && (
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-6">
                            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Available on</h3>
                            <div className="flex flex-wrap gap-3">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {flatrate.map((provider: any) => (
                                    <div key={provider.provider_id} className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm" title={provider.provider_name}>
                                        <Image
                                            src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                                            alt={provider.provider_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
