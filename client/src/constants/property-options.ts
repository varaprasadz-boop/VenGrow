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

/**
 * View type options (Garden/Pool/Road/Not available).
 * Aligned with Property Posting Details spec.
 */
export const VIEW_OPTIONS = [
  "Garden",
  "Pool",
  "Road",
  "Not available",
] as const;

/**
 * Tenants preferred for rent/lease listings.
 */
export const TENANTS_PREFERRED_OPTIONS = [
  "Family",
  "Bachelor",
  "Working Professional",
] as const;

/**
 * Lock-in period options in months (rent/lease).
 */
export const LOCK_IN_MONTHS_OPTIONS = [
  6, 11, 12, 23, 24, 36,
] as const;

/**
 * Yes/No/Doesn't matter for negotiable fields (rent/lease).
 */
export const NEGOTIABLE_OPTIONS = [
  "Yes",
  "No",
  "Doesn't matter",
] as const;

/**
 * Full amenities list aligned with Property Posting Details spec.
 * Used when adding/editing properties.
 */
export const PROPERTY_AMENITIES = [
  "A/C",
  "Banquet Hall",
  "Barbeque",
  "Cafeteria/Food Court",
  "CCTV",
  "Club House",
  "Concierge Services",
  "Conference Room",
  "DTH Television Facility",
  "Earthquake resistant",
  "Fire Extinguisher",
  "Fingerprint Access",
  "Free Hold",
  "Full Glass Wall",
  "Golf Course",
  "Gyser",
  "Health club with Steam / Jacuzzi",
  "Helipad",
  "House help accommodation",
  "Intercom facility",
  "Internet/Wi-Fi Connectivity",
  "Jogging and Strolling Track",
  "Laundry Service",
  "Lift",
  "Maintenance Staff",
  "Outdoor Tennis Courts",
  "Park",
  "Piped Gas",
  "Power Backup",
  "Private Balcony",
  "Private Garden",
  "Private Pool",
  "RO water system",
  "Reserved Parking",
  "Retail Boulevard",
  "Security",
  "Service/Goods Lift",
  "Sky deck",
  "Skyline View",
  "Spa",
  "Sports academy",
  "Swimming Pool",
  "Theme based architecture",
  "Vaastu Compliant",
  "Visitor Parking",
  "Waste Disposal",
  "Water Front",
  "Water Storage",
  "Water Cooler",
  "Wine Cellar",
  "Wrap around Balcony",
] as const;

export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number];
export type FlooringOption = (typeof FLOORING_OPTIONS)[number];
export type ViewOption = (typeof VIEW_OPTIONS)[number];
export type TenantsPreferredOption = (typeof TENANTS_PREFERRED_OPTIONS)[number];
export type NegotiableOption = (typeof NEGOTIABLE_OPTIONS)[number];
