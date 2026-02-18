/**
 * Measurement units for property area (Measuring in).
 * Used when adding/editing properties and when displaying area on listings.
 */
export const MEASUREMENT_UNITS = [
  "Sq-ft",
  "Sq-yrd",
  "Sq-m",
  "Acre",
  "Hectare",
  "Bigha",
  "Marla",
  "Kanal",
  "Biswa 1",
  "Biswa 2",
  "Ground",
  "Aankadam",
  "Rood",
  "Chatak",
  "Kottah",
  "Cent",
  "Perch",
  "Guntha",
  "Are",
  "Kuncham",
  "Katha",
  "Gaj",
  "Killa",
] as const;

/**
 * Flooring options for properties.
 * Used when adding/editing properties and when displaying on detail page.
 */
export const FLOORING_OPTIONS = [
  "Ceramic tiles",
  "Marble",
  "Vitrified",
  "Granite",
  "Marbonite",
  "Normal Tiles",
  "Wooden Table",
] as const;

export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number];
export type FlooringOption = (typeof FLOORING_OPTIONS)[number];
