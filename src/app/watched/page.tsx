import WatchedBoard from "@/components/watched/WatchedBoard";
import WatchedGate from "@/components/watched/WatchedGate";

export default function WatchedPage() {
  return (
    <WatchedGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Your Watched Vault</h1>
          <p className="text-sm text-slate-400">
            Synced securely to your account via Firestore.
          </p>
        </div>
        <WatchedBoard />
      </div>
    </WatchedGate>
  );
}



