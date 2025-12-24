# How to Rebuild with Google Maps API Key

## Problem
Your `.env` file has `VITE_GOOGLE_MAPS_API_KEY` set, but Vite embeds environment variables **at build time**, not runtime. If the app was built without this variable, the API key won't be in the built files.

## Solution: Rebuild the Application

You need to rebuild the application with the environment variable set. Here are the steps:

### Option 1: Rebuild with .env file (Recommended)

1. **Make sure your `.env` file has the API key:**
   ```bash
   # In your .env file, ensure you have:
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE
   ```

2. **Rebuild the application:**
   ```bash
   cd ~/VenGrow
   npm run build
   ```

   Vite will automatically read `VITE_*` variables from `.env` during build.

3. **Restart your application:**
   ```bash
   pm2 restart all
   # or
   pm2 restart your-app-name
   ```

### Option 2: Rebuild with inline environment variable

If `.env` isn't being read during build, set it inline:

```bash
cd ~/VenGrow
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE npm run build
pm2 restart all
```

### Option 3: Create .env.production file

Vite specifically looks for `.env.production` during production builds:

```bash
cd ~/VenGrow
echo "VITE_GOOGLE_MAPS_API_KEY=AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE" > .env.production
npm run build
pm2 restart all
```

## Verify the API Key is in Built Files

After rebuilding, verify the API key is embedded:

```bash
grep -r "AIza" dist/public/ | head -1
```

You should see the API key in the output.

## Important Notes

1. **Build Time vs Runtime:**
   - `VITE_*` variables are embedded **during build** (`npm run build`)
   - They are NOT read from `.env` at runtime
   - Server-side variables (like `DATABASE_URL`) are read at runtime

2. **After Rebuilding:**
   - The new build will have the API key embedded
   - You must restart your PM2 processes
   - Clear browser cache if needed

3. **Check Build Output:**
   - The API key will be visible in the built JavaScript files (this is normal and expected)
   - Google Maps API keys are meant to be public (restricted by domain in Google Cloud Console)

## Quick Commands Summary

```bash
# 1. Navigate to project
cd ~/VenGrow

# 2. Verify .env has the key
grep VITE_GOOGLE_MAPS_API_KEY .env

# 3. Rebuild
npm run build

# 4. Verify key is in build
grep -r "AIza" dist/public/ | head -1

# 5. Restart PM2
pm2 restart all

# 6. Check PM2 status
pm2 status
```

## Troubleshooting

If the API key still doesn't work after rebuilding:

1. **Check if build succeeded:**
   ```bash
   ls -la dist/public/assets/ | head -5
   ```

2. **Check browser console** for specific errors:
   - Open DevTools (F12)
   - Look for Google Maps errors
   - Check Network tab for requests to `maps.googleapis.com`

3. **Verify Google Cloud Console:**
   - Ensure your domain `staging.vengrow.net` is whitelisted
   - Check that Maps JavaScript API and Places API are enabled

4. **Check PM2 logs:**
   ```bash
   pm2 logs
   ```

