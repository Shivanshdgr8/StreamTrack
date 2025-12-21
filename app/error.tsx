"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-red-500/10 p-4 rounded-full mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Something went wrong!</h2>
            <p className="text-gray-400 max-w-md mb-8">
                We encountered an unexpected error while processing your request. Please try again.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                </Button>
                <Button onClick={() => reset()} className="bg-fuchsia-600 hover:bg-fuchsia-700">
                    Try Again
                </Button>
            </div>
        </div>
    );
}
