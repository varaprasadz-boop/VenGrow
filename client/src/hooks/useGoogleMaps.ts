import { useJsApiLoader } from "@react-google-maps/api";

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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    id: "google-maps-script-loader", // Consistent ID to prevent multiple loaders
  });

  return {
    isLoaded,
    loadError,
    apiKey: GOOGLE_MAPS_API_KEY,
  };
}

