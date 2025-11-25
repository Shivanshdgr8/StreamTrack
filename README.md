## StreamTrack

StreamTrack is a Next.js 14 + TailwindCSS experience for tracking trending movies & series, filtering by OTT providers, and maintaining a local “watched” vault powered by TMDB.

### Tech Stack

- Next.js 14 (App Router) + React 19
- TailwindCSS v4 (via `@tailwindcss/postcss`)
- TMDB API for media, providers, and search
- LocalStorage for persisting watched items on-device

### Environment

Create a `.env.local` in the project root with your TMDB & Firebase credentials:

```
TMDB_API_KEY=your_tmdb_api_key
# Optional, defaults to IN
TMDB_REGION=IN
# Optional tuning for network conditions
TMDB_MAX_RETRIES=2
TMDB_TIMEOUT_MS=8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

You can grab an API key from [developer.themoviedb.org](https://developer.themoviedb.org/).

After configuring Firebase, apply the Firestore security rules in `firestore.rules` to ensure each user can only read/write their own watched collections.

### Available Scripts

```bash
npm run dev    # start the Next.js dev server on http://localhost:3000
npm run build  # create a production build
npm run start  # serve the production build
npm run lint   # run ESLint
```

### Features

- **Homepage**: trending movies & series grids with OTT badges, instant TMDB-backed search, and “Mark as Watched” buttons.
- **Providers**: `/providers` lists OTT partners; selecting one loads its movie & series catalog via TMDB’s watch/providers endpoints.
- **Watched Lists**: `/watched` reads from LocalStorage, splitting watched movies vs series (data is scoped per device).
- **LocalStorage helpers**: shared functions (`getWatchedMovies`, `addWatchedMovie`, etc.) ensure consistent storage logic across components.

### Notes

- Provider availability is region-aware (defaults to India). Set `TMDB_REGION` to match your market.
- LocalStorage means watched data does **not** sync across browsers/devices. Clear storage to reset the vault.
