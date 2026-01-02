import { generatePropertySlug } from "@shared/utils";
import type { Property } from "@shared/schema";

/**
 * Generate a property URL with SEO-friendly slug
 * Falls back to ID if slug is not available
 */
export function getPropertyUrl(property: Property | { id: string; title?: string; city?: string; slug?: string | null }): string {
  // If property has a slug, use it
  if (property.slug) {
    return `/property/${property.slug}`;
  }
  
  // Otherwise, generate a slug from title and city
  if (property.title) {
    const slug = generatePropertySlug(property.title, property.city, property.id);
    return `/property/${slug}`;
  }
  
  // Fallback to ID
  return `/property/${property.id}`;
}

/**
 * Check if a string is a UUID
 */
export function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

