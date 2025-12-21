"use client";

import { useMediaList, MediaType } from "@/hooks/useMediaList";
import { Button } from "@/components/ui/button";
import { Check, Plus, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MediaActions({ media, type }: { media: any, type: MediaType }) {
    const { user, signInWithGoogle } = useAuth();
    const { addToStatus, removeFromList, getItemStatus, loading } = useMediaList();
    const status = getItemStatus(media.id, type);
    const router = useRouter();

    const handleAction = async (newStatus: 'watched' | 'watchlist') => {
        if (loading) return;
        if (!user) {
            router.push("/login");
            return;
        }

        if (status === newStatus) {
            await removeFromList(media.id, type);
        } else {
            await addToStatus(media, type, newStatus);
        }
    };

    return (
        <div className="flex gap-4">
            <Button
                variant={status === 'watchlist' ? 'default' : 'secondary'}
                onClick={() => handleAction('watchlist')}
                className="gap-2 transition-all duration-300"
            >
                {status === 'watchlist' ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {status === 'watchlist' ? 'In Watchlist' : 'Watch Later'}
            </Button>

            <Button
                variant={status === 'watched' ? 'default' : 'outline'}
                onClick={() => handleAction('watched')}
                className="gap-2 transition-all duration-300"
            >
                <Clock className="w-4 h-4" />
                {status === 'watched' ? 'Watched' : 'Mark Watched'}
            </Button>
        </div>
    );
}
