# Google Maps Setup for Production

## Issue: Map works on localhost but not on live domain

This document explains how to fix Google Maps not working on your production domain.

## ⚠️ CRITICAL: Vite Environment Variables are Build-Time Only

**Important:** `VITE_*` environment variables are embedded **during build** (`npm run build`), NOT at runtime. Even if your `.env` file has `VITE_GOOGLE_MAPS_API_KEY`, you must **rebuild** the application for it to be included.

## Common Causes

1. **API Key Not Set During Build** ⚠️ MOST COMMON
   - The `VITE_GOOGLE_MAPS_API_KEY` environment variable must be set **during build time**
   - Vite environment variables are embedded at build time, not runtime
   - **If you added the key to `.env` after building, you MUST rebuild**

2. **API Key Domain Restrictions**
   - Google Cloud Console may have HTTP referrer restrictions
   - Only localhost may be whitelisted

3. **API Key Billing/Quota Issues**
   - Billing must be enabled in Google Cloud Console
   - Quota limits may be exceeded

## Solution Steps

### Step 1: Set Environment Variable During Build

The API key must be available when running `npm run build`. 

**Option A: Set in build command**
```bash
VITE_GOOGLE_MAPS_API_KEY=your-api-key-here npm run build
```

**Option B: Use .env file (recommended)**
Create a `.env.production` file in the project root:
```
VITE_GOOGLE_MAPS_API_KEY=your-api-key-here
```

**Option C: Set in CI/CD pipeline**
If using GitHub Actions, GitLab CI, etc., add as a secret:
```yaml
env:
  VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.GOOGLE_MAPS_API_KEY }}
```

### Step 2: Configure API Key Restrictions in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your API key
4. Under **Application restrictions**, select **HTTP referrers (web sites)**
5. Add your production domains:
   ```
   https://yourdomain.com/*
   https://www.yourdomain.com/*
   https://*.yourdomain.com/*
   ```
6. Under **API restrictions**, ensure these APIs are enabled:
   - Maps JavaScript API
   - Places API
7. Click **Save**

### Step 3: Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Enable these APIs:
   - **Maps JavaScript API** (required)
   - **Places API** (required for autocomplete/search)

### Step 4: Enable Billing

1. Go to **Billing** in Google Cloud Console
2. Ensure billing is enabled for your project
3. Google Maps has a free tier ($200/month credit)

### Step 5: Verify Build Output

After building, check that the API key is embedded:
```bash
# Search for the API key in built files (first few characters)
grep -r "AIza" dist/public/
```

### Step 6: Check Browser Console

In production, open browser DevTools Console and look for:
- `Google Maps API Key loaded: Yes` (in development mode)
- Any error messages about API key restrictions
- Network errors when loading `maps.googleapis.com`

## Troubleshooting

### Map shows "Map Unavailable" or "Map picker is being configured"

**Check 1: API Key is set**
```bash
# In production, check if API key exists
# The key should be embedded in the built JavaScript files
```

**Check 2: Domain is whitelisted**
- Verify your production domain is in the HTTP referrer restrictions
- Check for typos (http vs https, trailing slashes, etc.)

**Check 3: APIs are enabled**
- Maps JavaScript API must be enabled
- Places API must be enabled (for LocationPicker)

**Check 4: Billing is enabled**
- Free tier provides $200/month credit
- Check billing status in Google Cloud Console

### Error: "This API key is not authorized"

- API key restrictions are too strict
- Domain not whitelisted
- API not enabled

### Error: "RefererNotAllowedMapError"

- Your domain is not in the HTTP referrer restrictions
- Add your domain to the allowed list in Google Cloud Console

### Map loads but shows blank/gray

- Billing may not be enabled
- Quota may be exceeded
- Check browser console for specific errors

## Testing

1. **Local Test with Production Build**
   ```bash
   npm run build
   npm run start
   # Test on localhost with production build
   ```

2. **Check Network Tab**
   - Open DevTools > Network
   - Look for requests to `maps.googleapis.com`
   - Check response status (should be 200)
   - Check for error messages in response

3. **Verify API Key in Production**
   - The API key should be visible in the built JavaScript (this is normal for client-side keys)
   - Google Maps API keys are meant to be public (restricted by domain)

## Security Notes

- Google Maps API keys are **public** by design (embedded in client-side code)
- Security is handled via **HTTP referrer restrictions** in Google Cloud Console
- Never use server-side API keys in client-side code
- Always restrict API keys to specific domains
- Monitor usage in Google Cloud Console to detect abuse

## Quick Checklist

- [ ] `VITE_GOOGLE_MAPS_API_KEY` set during build
- [ ] Production domain added to HTTP referrer restrictions
- [ ] Maps JavaScript API enabled
- [ ] Places API enabled
- [ ] Billing enabled
- [ ] Build includes API key (check dist/public/)
- [ ] No console errors in production
- [ ] Network requests to maps.googleapis.com succeed

## Support

If issues persist:
1. Check Google Cloud Console for error messages
2. Review browser console for specific errors
3. Verify API key restrictions match your domain exactly
4. Check billing and quota limits

