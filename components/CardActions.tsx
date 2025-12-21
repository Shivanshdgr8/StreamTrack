"use client";

import { useMediaList, MediaType } from "@/hooks/useMediaList";
import { Button } from "@/components/ui/button";
import { Check, Plus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CardActionsProps {
    media: any;
    type: MediaType;
    className?: string;
    showWatchlistBtn?: boolean;
    showWatchedBtn?: boolean;
}

export default function CardActions({
    media,
    type,
    className,
    showWatchlistBtn = true,
    showWatchedBtn = true
}: CardActionsProps) {
    const { user, signInWithGoogle } = useAuth();
    const { addToStatus, removeFromList, getItemStatus, loading } = useMediaList();
    const status = getItemStatus(media.tmdbId || media.id, type);


    const handleAction = async (e: React.MouseEvent, newStatus: 'watched' | 'watchlist') => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            // Redirect to login page instead of popup
            // window.location.href = "/login"; // Simple redirect or use router if available, but CardActions might not have router hooks if not top level? 
            // Actually it is a client component, so we can use useRouter.
            // But we need to import it.
            window.location.href = "/login";
            return;
        }

        if (status === newStatus) {
            await removeFromList(media.tmdbId || media.id, type);
        } else {
            await addToStatus(media, type, newStatus);
        }
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            {showWatchlistBtn && (
                <Button
                    variant={status === 'watchlist' ? 'default' : 'secondary'}
                    size="icon"
                    onClick={(e) => handleAction(e, 'watchlist')}
                    className={`h-8 w-8 rounded-full border-none transition-all ${status === 'watchlist'
                        ? 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white'
                        : 'bg-white/20 hover:bg-fuchsia-500 text-white hover:scale-110'
                        }`}
                    title={status === 'watchlist' ? "Remove from Watchlist" : "Add to Watch Later"}
                >
                    {status === 'watchlist' ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
            )}

            {showWatchedBtn && (
                <Button
                    variant={status === 'watched' ? 'default' : 'secondary'}
                    size="icon"
                    onClick={(e) => handleAction(e, 'watched')}
                    className={`h-8 w-8 rounded-full border-none transition-all ${status === 'watched'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-white/20 hover:bg-green-500 text-white hover:scale-110'
                        }`}
                    title={status === 'watched' ? "Mark as Unwatched" : "Mark as Watched"}
                >
                    {status === 'watched' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
            )}
        </div>
    );
}
