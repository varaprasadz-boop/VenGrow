# Fix: API Key Not Being Read During Build

## Problem
The API key is showing as empty string (`""`) in the built files, even though it's in your `.env` file.

## Root Cause
Vite reads environment variables from `.env` files, but it looks for them in specific locations. Since your `vite.config.ts` has `root: "client"`, Vite might not be finding the `.env` file in the project root.

## Solution

### Option 1: Export the variable before building (Recommended for your server)

On your live server, run:

```bash
cd ~/VenGrow

# Export the variable
export VITE_GOOGLE_MAPS_API_KEY=AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE

# Then build
npm run build

# Verify it's in the build
grep -r "AIza" dist/public/assets/*.js | head -1

# Copy to web directory and restart
rm -rf /var/www/staging.vengrow.net/*
cp -r dist/* /var/www/staging.vengrow.net/
pm2 restart ecosystem.config.cjs --only vengrow-staging --update-env
```

### Option 2: Create .env.production file

Vite specifically looks for `.env.production` during production builds:

```bash
cd ~/VenGrow
echo "VITE_GOOGLE_MAPS_API_KEY=AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE" > .env.production
npm run build
```

### Option 3: Set inline during build

```bash
cd ~/VenGrow
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE npm run build
```

## Verify the Fix

After rebuilding, check that the API key is in the built files:

```bash
# Should show the API key (not empty string)
grep -r "AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE" dist/public/assets/*.js | head -1

# Should NOT show empty string const f=""
grep -r 'const.*=""' dist/public/assets/LocationPicker*.js
```

## Why This Happens

1. Vite embeds `VITE_*` variables **at build time** from:
   - System environment variables
   - `.env` files in the project root
   - `.env.production` for production builds
   
2. If the variable isn't available during `npm run build`, it becomes an empty string

3. The `.env` file location matters - Vite looks in the directory where `vite.config.ts` is located

## Quick Fix Command (Copy-Paste Ready)

```bash
cd ~/VenGrow && \
export VITE_GOOGLE_MAPS_API_KEY=AIzaSyBx0cESH2ftPhstyuJI6vtqfQMm6ta4CiE && \
npm run build && \
grep -r "AIzaSy" dist/public/assets/*.js | head -1 && \
rm -rf /var/www/staging.vengrow.net/* && \
cp -r dist/* /var/www/staging.vengrow.net/ && \
pm2 restart ecosystem.config.cjs --only vengrow-staging --update-env
```

This will:
1. Navigate to project
2. Export the API key
3. Build the app
4. Verify the key is in the build
5. Deploy to web directory
6. Restart PM2

