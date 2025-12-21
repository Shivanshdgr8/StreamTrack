"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { updateProfile, deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, Save, Trash2, User } from "lucide-react";
import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AccountPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [name, setName] = useState(user?.displayName || "");
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-fuchsia-500" /></div>;
    if (!user) {
        router.push("/");
        return null;
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        try {
            if (user) {
                await updateProfile(user, { displayName: name });
                setMessage({ type: 'success', text: "Profile updated successfully!" });
                // Force reload logic or state update might be needed depending on context behavior, 
                // but usually Firebase Auth listener picks up changes eventually.
                // However, updateProfile doesn't always trigger onAuthStateChanged immediately.
                // A refresh ensures Navbar picks it up.
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: "Failed to update profile." });
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you ABSOLUTELY sure? This action cannot be undone. This will permanently delete your account and remove your data.")) {
            return;
        }

        setDeleting(true);
        try {
            // 1. Delete Firestore Data
            // Note: Client SDK can't easily delete internal collections unless we know IDs or structure, 
            // but we can try to delete the known 'list' subcollection documents manually if we had a way to list them.
            // Since we can't delete a whole collection from client, we iterate.

            const listRef = collection(db, "users", user.uid, "list");
            const snapshot = await getDocs(listRef);
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // 2. Delete User Auth
            await deleteUser(user);

            router.push("/");
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                setMessage({ type: 'error', text: "For security, please sign out and sign in again before deleting your account." });
            } else {
                setMessage({ type: 'error', text: "Failed to delete account. Please try again." });
            }
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <User className="w-8 h-8 text-fuchsia-500" />
                Account Settings
            </h1>

            {/* Profile Section */}
            <section className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-fuchsia-500 text-white placeholder-gray-600"
                            placeholder="Your Name"
                        />
                    </div>
                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {message.text}
                        </div>
                    )}
                    <Button type="submit" disabled={updating} className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full sm:w-auto">
                        {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </form>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                <h2 className="text-xl font-semibold text-red-500 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Delete Account
                </Button>
            </section>
        </div>
    );
}
