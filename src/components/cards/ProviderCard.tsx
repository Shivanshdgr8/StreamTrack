import Image from "next/image";
import Link from "next/link";

import type { Provider } from "@/lib/tmdb";

type ProviderCardProps = {
  provider: Provider;
  isActive?: boolean;
};

const getLogoUrl = (path: string | null) =>
  path
    ? `https://image.tmdb.org/t/p/w92${path}`
    : "https://placehold.co/96x96?text=OTT";

const ProviderCard = ({ provider, isActive = false }: ProviderCardProps) => {
  return (
    <Link
      href={`/providers?providerId=${provider.provider_id}`}
      className={`card-surface flex items-center gap-3 p-4 transition ${
        isActive ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
        <Image
          src={getLogoUrl(provider.logo_path)}
          alt={provider.provider_name}
          fill
          sizes="40px"
          className="object-contain p-1"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">
          {provider.provider_name}
        </span>
        <span className="text-xs text-slate-400">Tap to explore catalog</span>
      </div>
    </Link>
  );
};

export default ProviderCard;

