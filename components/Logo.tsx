export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" /> {/* violet-500 */}
                    <stop offset="100%" stopColor="#d946ef" /> {/* fuchsia-500 */}
                </linearGradient>
            </defs>

            {/* Main Rounded Square Container */}
            <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#logo_gradient)" />

            {/* Film Sprockets - Left */}
            <rect x="20" y="20" width="8" height="12" rx="2" fill="white" fillOpacity="0.3" />
            <rect x="20" y="44" width="8" height="12" rx="2" fill="white" fillOpacity="0.3" />
            <rect x="20" y="68" width="8" height="12" rx="2" fill="white" fillOpacity="0.3" />

            {/* Film Sprockets - Right */}
            <rect x="72" y="20" width="8" height="12" rx="2" fill="white" fillOpacity="0.3" />
            <rect x="72" y="44" width="8" height="12" rx="2" fill="white" fillOpacity="0.3" />
            <rect x="72" y="68" width="8" height="12" rx="2" fill="white" fillOpacity="0.3" />

            {/* Central Play Button */}
            <path
                d="M45 35L65 50L45 65V35Z"
                fill="white"
            />
        </svg>
    );
}
