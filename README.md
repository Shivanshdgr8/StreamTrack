# StreamTrack

StreamTrack is a premium movie and series tracking application designed to help you organize your entertainment life. Built with Next.js, Firebase, and TMDB.

## Features

-   **Dashboard & Discovery**:
    -   Trending Movies & TV Shows.
    -   Dedicated "Popular" sections for Movies and Series.
    -   Comprehensive Search (Movies & TV).
    -   Details view with cast, ratings, and release info.

-   **Personal Library**:
    -   **Watch Later**: Save items you want to see.
    -   **Watched History**: Mark items as watched.
    -   **Smart Status**: Visual indicators (Check/Plus/Eye) on all cards show your interaction status instantly.

-   **Authentication**:
    -   **Google Sign-In**: One-click login.
    -   **Email/Password**: Create an account with your email.
    -   **Account Management**: Update your display name or delete your account securely.

-   **Performance & UX**:
    -   **Instant Interactivity**: Buttons work immediately, even before full hydration.
    -   **Optimized Routing**: Fast transitions and persistent state using standard URL parameters.
    -   **Responsive Design**: Fully mobile-responsive layout with glassmorphism UI.

## Tech Stack
-   **Framework**: Next.js 14+ (App Router)
-   **Styling**: Tailwind CSS, Lucide Icons, Shadcn UI Concepts
-   **Backend**: Firebase Auth, Firestore
-   **Data Source**: TMDB API

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create `.env.local` with the following:
    ```env
    NEXT_PUBLIC_TMDB_API_KEY=your_key
    NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open**: [http://localhost:3000](http://localhost:3000)
