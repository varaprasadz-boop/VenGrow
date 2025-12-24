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
  // Log in development to help debug API key issues
  if (import.meta.env.DEV) {
    console.log("Google Maps API Key loaded:", GOOGLE_MAPS_API_KEY ? "Yes" : "No");
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    id: "google-maps-script-loader", // Consistent ID to prevent multiple loaders
  });

  // Enhanced error logging for production debugging
  if (loadError && import.meta.env.PROD) {
    console.error("Google Maps Load Error:", loadError);
    console.error("API Key present:", !!GOOGLE_MAPS_API_KEY);
    console.error("API Key length:", GOOGLE_MAPS_API_KEY?.length || 0);
  }

  return {
    isLoaded,
    loadError,
    apiKey: GOOGLE_MAPS_API_KEY,
  };
}

