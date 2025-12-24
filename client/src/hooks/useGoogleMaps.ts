import { useJsApiLoader } from "@react-google-maps/api";

// Get API key from environment variable
// In production, this must be set as a build-time environment variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

// Standardize libraries - always use ["places"] to ensure consistent loading
// "places" is needed for Autocomplete in LocationPicker
// Loading it for all components ensures no conflicts
const libraries: ("places")[] = ["places"];

/**
 * Shared Google Maps loader hook
 * Use this hook in all components that need Google Maps to ensure consistent configuration
 * This prevents the "Loader must not be called again with different options" error
 */
export function useGoogleMaps() {
  // Log API key status (both dev and prod for debugging)
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn("⚠️ Google Maps API Key is not set! Set VITE_GOOGLE_MAPS_API_KEY environment variable.");
    console.warn("   In production, this must be set during build: VITE_GOOGLE_MAPS_API_KEY=your-key npm run build");
  } else if (import.meta.env.DEV) {
    console.log("✅ Google Maps API Key loaded:", GOOGLE_MAPS_API_KEY.substring(0, 20) + "...");
  }

  // Only call useJsApiLoader if we have an API key
  // Passing empty string causes "NoApiKeys" error
  const loaderResult = GOOGLE_MAPS_API_KEY 
    ? useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
        id: "google-maps-script-loader", // Consistent ID to prevent multiple loaders
      })
    : { isLoaded: false, loadError: new Error("Google Maps API key is not configured") };

  const { isLoaded, loadError } = loaderResult;

  // Enhanced error logging for production debugging
  if (loadError) {
    console.error("❌ Google Maps Load Error:", loadError);
    console.error("   API Key present:", !!GOOGLE_MAPS_API_KEY);
    console.error("   API Key length:", GOOGLE_MAPS_API_KEY?.length || 0);
    if (import.meta.env.PROD) {
      console.error("   Fix: Set VITE_GOOGLE_MAPS_API_KEY during build and add domain to Google Cloud Console");
    }
  }

  return {
    isLoaded,
    loadError,
    apiKey: GOOGLE_MAPS_API_KEY,
  };
}

