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

/**
 * New Project (Property Type: New Project) – full 52 amenities from spec.
 * Used for Apartment, Row House, Villa, and Plots new project listings.
 */
export const NEW_PROJECT_AMENITIES = [
  "Air Conditioned",
  "Banquet Hall",
  "Bar/Lounge",
  "Cafeteria/Food Court",
  "Club House",
  "Concierge Services",
  "Conference Room",
  "DTH Television Facility",
  "Downtown",
  "Fingerprint Access",
  "Fireplace",
  "Full Glass Wall",
  "Golf Course",
  "Gymnasium",
  "Health club with Steam / Jaccuzi",
  "Helipad",
  "Hilltop",
  "House help accommodation",
  "Intercom Facility",
  "Internet/Wi-Fi Connectivity",
  "Island Kitchen Layout",
  "Jogging and Strolling Track",
  "Laundry Service",
  "Lift",
  "Maintenance Staff",
  "Outdoor Tennis Courts",
  "Park",
  "Piped Gas",
  "Power Back Up",
  "Private Garage",
  "Private Terrace/Garden",
  "Private jaccuzi",
  "Private pool",
  "RO Water System",
  "Rain Water Harvesting",
  "Reserved Parking",
  "Sea facing",
  "Security",
  "Service/Goods Lift",
  "Sky Villa",
  "Skydeck",
  "Skyline View",
  "Smart Home",
  "Swimming Pool",
  "Theme based Architectures",
  "Vaastu Compliant",
  "Visitor Parking",
  "Waste Disposal",
  "Water Front",
  "Water Storage",
  "Wine Cellar",
  "Wrap Around Balcony",
] as const;

/**
 * New Project: No. of car parking dropdown options (0 to 10+).
 */
export const NEW_PROJECT_CAR_PARKING_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/**
 * New Project: Total Floors dropdown options (1 to 50).
 */
export const NEW_PROJECT_TOTAL_FLOORS_OPTIONS = Array.from({ length: 50 }, (_, i) => i + 1);

/**
 * New Project: Flats on the Floor dropdown options (1 to 20).
 */
export const NEW_PROJECT_FLATS_ON_FLOOR_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

/**
 * New Project: No. of Lifts dropdown options (0 to 10).
 */
export const NEW_PROJECT_LIFTS_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/**
 * New Project category options (Property Type: New Project).
 */
export const NEW_PROJECT_CATEGORIES = [
  { value: "apartment", label: "Apartment" },
  { value: "row_house", label: "Row House" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plots" },
] as const;

/**
 * PG / Co-living: Gender options.
 */
export const PG_GENDER_OPTIONS = ["Male", "Female", "Unisex"] as const;

/**
 * PG / Co-living: Listed for (target audience).
 */
export const PG_LISTED_FOR_OPTIONS = ["Student", "Working Professional", "Mixed"] as const;

/**
 * PG / Co-living: Room type.
 */
export const PG_ROOM_TYPE_OPTIONS = ["Private", "Shared"] as const;

/**
 * PG / Co-living: Available in (unit type).
 */
export const PG_AVAILABLE_IN_OPTIONS = ["Studio", "Micro-apartment"] as const;

/**
 * PG / Co-living: Facilities multi-select list.
 */
export const PG_FACILITIES_LIST = [
  "Geyser",
  "Cupboard",
  "TV",
  "AC",
  "Cot",
  "Mattress",
  "Side Table",
  "Air Cooler",
] as const;

/**
 * PG / Co-living: Rules multi-select list.
 */
export const PG_RULES_LIST = [
  "No Smoking",
  "Drinking alcohol not allowed",
  "Entry of opposite gender not allowed",
  "Guardian not allowed",
] as const;

/**
 * PG / Co-living: Services multi-select list.
 */
export const PG_SERVICES_LIST = ["Laundry", "Room Cleaning", "Warden"] as const;

/**
 * PG / Co-living: Notice period options.
 */
export const PG_NOTICE_PERIOD_OPTIONS = [
  "1 Week",
  "15 Days",
  "1 Month",
  "2 Months",
  "3 Months",
] as const;

export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number];
export type FlooringOption = (typeof FLOORING_OPTIONS)[number];
export type ViewOption = (typeof VIEW_OPTIONS)[number];
export type TenantsPreferredOption = (typeof TENANTS_PREFERRED_OPTIONS)[number];
export type NegotiableOption = (typeof NEGOTIABLE_OPTIONS)[number];
export type PgGenderOption = (typeof PG_GENDER_OPTIONS)[number];
export type PgListedForOption = (typeof PG_LISTED_FOR_OPTIONS)[number];
export type PgRoomTypeOption = (typeof PG_ROOM_TYPE_OPTIONS)[number];
export type PgAvailableInOption = (typeof PG_AVAILABLE_IN_OPTIONS)[number];
export type PgNoticePeriodOption = (typeof PG_NOTICE_PERIOD_OPTIONS)[number];
export type NewProjectAmenity = (typeof NEW_PROJECT_AMENITIES)[number];
export type NewProjectCategory = (typeof NEW_PROJECT_CATEGORIES)[number]["value"];
