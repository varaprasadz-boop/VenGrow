import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noIndex?: boolean;
}

const SITE_NAME = "VenGrow";
const DEFAULT_DESCRIPTION = "India's trusted verified property marketplace. Buy, sell, or rent apartments, villas, plots, and commercial spaces from verified sellers.";
const DEFAULT_OG_IMAGE = "/og-image.png";

function updateMetaTag(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement("meta");
    if (property) {
      element.setAttribute("property", name);
    } else {
      element.name = name;
    }
    document.head.appendChild(element);
  }
  
  element.content = content;
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;
    
    updateMetaTag("description", description);
    
    updateMetaTag("og:title", ogTitle || fullTitle, true);
    updateMetaTag("og:description", ogDescription || description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:type", ogType, true);
    updateMetaTag("og:site_name", SITE_NAME, true);
    
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", ogTitle || fullTitle);
    updateMetaTag("twitter:description", ogDescription || description);
    updateMetaTag("twitter:image", ogImage);
    
    if (noIndex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow");
    }
    
    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogType, noIndex]);
  
  return null;
}

export function PropertySEO({
  title,
  location,
  price,
  imageUrl,
}: {
  title: string;
  location: string;
  price: number;
  imageUrl?: string;
}) {
  const formattedPrice = `₹${price.toLocaleString("en-IN")}`;
  const seoTitle = `${title} in ${location}`;
  const seoDescription = `${title} available for ${formattedPrice} in ${location}. View photos, amenities, and contact verified seller on VenGrow.`;
  
  return (
    <SEO
      title={seoTitle}
      description={seoDescription}
      ogTitle={`${seoTitle} - ${formattedPrice}`}
      ogDescription={seoDescription}
      ogImage={imageUrl || DEFAULT_OG_IMAGE}
      ogType="product"
    />
  );
}

export function BuilderSEO({
  name,
  location,
  projectCount,
  imageUrl,
}: {
  name: string;
  location?: string;
  projectCount?: number;
  imageUrl?: string;
}) {
  const seoTitle = `${name} - Verified Builder`;
  const seoDescription = `${name}${location ? ` in ${location}` : ""}${projectCount ? ` - ${projectCount} projects available` : ""}. View all properties and projects on VenGrow.`;
  
  return (
    <SEO
      title={seoTitle}
      description={seoDescription}
      ogTitle={seoTitle}
      ogDescription={seoDescription}
      ogImage={imageUrl || DEFAULT_OG_IMAGE}
    />
  );
}

export function ProjectSEO({
  name,
  builder,
  location,
  priceRange,
  imageUrl,
}: {
  name: string;
  builder?: string;
  location?: string;
  priceRange?: string;
  imageUrl?: string;
}) {
  const seoTitle = `${name}${builder ? ` by ${builder}` : ""}`;
  const seoDescription = `${name}${builder ? ` by ${builder}` : ""}${location ? ` in ${location}` : ""}${priceRange ? ` - Starting ${priceRange}` : ""}. View floor plans, amenities, and availability on VenGrow.`;
  
  return (
    <SEO
      title={seoTitle}
      description={seoDescription}
      ogTitle={seoTitle}
      ogDescription={seoDescription}
      ogImage={imageUrl || DEFAULT_OG_IMAGE}
    />
  );
}
