# Environment Variables (.env) Setup Guide

This document explains how to configure environment variables for StreamTrack.

## Quick Start

1. Create a `.env.local` file in the project root directory
2. Copy the template below and fill in your values
3. Restart your development server after making changes

## File Location

Create your environment file as `.env.local` in the project root:

```
StreamTrack/
├── .env.local          ← Create this file
├── src/
├── package.json
└── ...
```

> **Note**: `.env.local` is automatically ignored by git (see `.gitignore`). Never commit your actual API keys or credentials.

## Environment Variables

### Required Variables

#### TMDB API Configuration

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `TMDB_API_KEY` | Your TMDB (The Movie Database) API key | `abc123def456...` | [developer.themoviedb.org](https://developer.themoviedb.org/) |

**How to get your TMDB API key:**
1. Visit [developer.themoviedb.org](https://developer.themoviedb.org/)
2. Sign up or log in
3. Go to your account settings → API
4. Request an API key (free tier available)
5. Copy the API key to your `.env.local`

#### Firebase Configuration (Required for Authentication)

All Firebase variables are prefixed with `NEXT_PUBLIC_` because they're used in client-side code.

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSy...` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project.firebaseapp.com` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-project.appspot.com` | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789012` | Firebase Console → Project Settings → Cloud Messaging |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | `1:123456789012:web:abc123...` | Firebase Console → Project Settings → General |

**How to get your Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication (Email/Password and Google providers)
4. Enable Firestore Database
5. Go to Project Settings (gear icon) → General tab
6. Scroll to "Your apps" section and select the web app (or create one)
7. Copy all the config values from the `firebaseConfig` object

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `TMDB_REGION` | ISO 3166-1 country code for region-specific content | `IN` | `US`, `GB`, `IN`, `CA` |
| `TMDB_MAX_RETRIES` | Maximum number of retry attempts for failed API requests | `2` | `3`, `5` |
| `TMDB_TIMEOUT_MS` | Request timeout in milliseconds | `8000` | `10000`, `5000` |

**Region Codes:**
- Use ISO 3166-1 alpha-2 country codes (2 letters)
- Common codes: `US` (United States), `GB` (United Kingdom), `IN` (India), `CA` (Canada)
- This affects which OTT providers and content are shown

## Template

Copy this template into your `.env.local` file:

```env
# TMDB API Configuration (Required)
TMDB_API_KEY=your_tmdb_api_key_here

# TMDB Optional Settings
TMDB_REGION=IN
TMDB_MAX_RETRIES=2
TMDB_TIMEOUT_MS=8000

# Firebase Configuration (Required for Authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Next.js Environment Variable Rules

### `NEXT_PUBLIC_` Prefix

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- These are safe to use in client-side React components
- All Firebase variables use this prefix because Firebase runs in the browser

### Server-Only Variables

- Variables without `NEXT_PUBLIC_` are only available on the server
- `TMDB_API_KEY` is server-only (used in API routes and server components)
- Never expose sensitive keys to the client

### Environment File Priority

Next.js loads environment variables in this order (later files override earlier ones):

1. `.env` - Default values for all environments
2. `.env.local` - Local overrides (ignored by git)
3. `.env.development` - Development-specific
4. `.env.production` - Production-specific

**Recommendation**: Use `.env.local` for development and set production variables in your hosting platform (Vercel, Netlify, etc.).

## Verification

After setting up your `.env.local` file:

1. **Restart your dev server**: Environment variables are loaded at startup
   ```bash
   npm run dev
   ```

2. **Check for errors**: 
   - Missing `TMDB_API_KEY` will show errors when fetching movies/series
   - Missing Firebase variables will disable authentication features (you'll see console warnings)

3. **Test the app**:
   - Homepage should load trending movies and series
   - Search should work
   - Login/Signup should work (if Firebase is configured)

## Troubleshooting

### "TMDB_API_KEY is missing"
- Ensure `.env.local` exists in the project root
- Check that the variable name is exactly `TMDB_API_KEY` (case-sensitive)
- Restart your dev server after adding the variable

### "Firebase is not configured"
- Verify all 6 `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check that values don't have extra spaces or quotes
- Restart your dev server

### Variables not loading
- Make sure the file is named `.env.local` (not `.env.local.txt`)
- Ensure the file is in the project root (same level as `package.json`)
- Restart the Next.js dev server
- Check for syntax errors (no spaces around `=`)

### Region-specific content not showing
- Verify `TMDB_REGION` uses a valid ISO 3166-1 code
- Check TMDB API documentation for supported regions
- Default fallback regions: `IN` → `US` → `GB`

## Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use different keys for development and production**
3. **Rotate keys if they're accidentally exposed**
4. **Don't share your `.env.local` file** - Each developer should have their own
5. **For production**: Set environment variables in your hosting platform's dashboard (Vercel, Netlify, etc.)

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Set all environment variables in your hosting platform's dashboard
2. Use the same variable names as in `.env.local`
3. For Vercel: Project Settings → Environment Variables
4. For Netlify: Site Settings → Environment Variables

The `NEXT_PUBLIC_` prefix rules still apply in production.

## Additional Resources

- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

