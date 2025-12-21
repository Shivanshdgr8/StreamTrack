"use client";

import { useState } from "react";
import { searchContent } from "@/app/actions";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import MediaCard from "@/components/MediaCard";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const data = await searchContent(query);
            setResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-2xl mx-auto mb-12">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search for movies or TV shows..."
                        className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 pl-12 text-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition-all text-white placeholder:text-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-fuchsia-500" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {results.filter(item => item.poster_path).map((item) => (
                        <MediaCard key={item.id} item={item} />
                    ))}
                    {searched && results.length === 0 && (
                        <p className="text-gray-500 col-span-full text-center">No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
