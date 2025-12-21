"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button"; // Placeholder, will create later or use raw tailwind
import { LogOut, Search, User as UserIcon, Settings } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
    const { user, signInWithGoogle, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                    <Logo className="w-8 h-8" />
                    StreamTrack
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard?tab=watch-later" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Watch Later
                            </Link>
                            <Link href="/dashboard?tab=watched" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Watched
                            </Link>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-white hidden md:block">
                                    {user.displayName || "User"}
                                </span>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-white/20" />
                                ) : (
                                    <UserIcon className="w-8 h-8 p-1 rounded-full bg-gray-800 text-gray-400" />
                                )}
                                <Link href="/account" className="text-gray-400 hover:text-white transition-colors" title="Account Settings">
                                    <Settings className="w-5 h-5" />
                                </Link>
                                <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors" title="Sign Out">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button
                                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm border border-white/10"
                            >
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
