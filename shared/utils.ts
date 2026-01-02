/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for a property
 * Format: title-city-id (ID at the end for uniqueness)
 */
export function generatePropertySlug(title: string, city?: string, id?: string): string {
  let slug = generateSlug(title);
  
  // Add city for better SEO if available
  if (city) {
    slug += `-${generateSlug(city)}`;
  }
  
  // Add full ID at the end for uniqueness if provided
  if (id) {
    // Remove hyphens from UUID for cleaner URL, or use as-is if not UUID
    const cleanId = id.replace(/-/g, '');
    slug += `-${cleanId}`;
  }
  
  return slug;
}

