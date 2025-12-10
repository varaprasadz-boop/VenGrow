import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { NavigationLink, SiteSetting } from "@shared/schema";
import vengrowLogo from "@assets/VenGrow_Logo_Design,_1765365353403.jpg";

interface GroupedSettings {
  site_name?: string;
  site_description?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_linkedin?: string;
}

const fallbackSettings: GroupedSettings = {
  site_name: "VenGrow",
  site_description: "India's trusted verified property marketplace. Find your dream property with verified sellers and transparent pricing.",
  contact_email: "support@vengrow.in",
  contact_phone: "+91 1800-123-4567",
  contact_address: "Mumbai, Maharashtra, India",
  social_facebook: "#",
  social_twitter: "#",
  social_instagram: "#",
  social_linkedin: "#",
};

const fallbackQuickLinks: NavigationLink[] = [
  { id: "1", label: "About Us", url: "/about", position: "footer", section: "quick_links", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 1, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "2", label: "How It Works", url: "/how-it-works", position: "footer", section: "quick_links", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "3", label: "Pricing", url: "/packages", position: "footer", section: "quick_links", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 3, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "4", label: "FAQ", url: "/faq", position: "footer", section: "quick_links", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 4, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
];

const fallbackSellerLinks: NavigationLink[] = [
  { id: "5", label: "Become a Seller", url: "/seller/type", position: "footer", section: "for_sellers", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 1, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "6", label: "View Packages", url: "/packages", position: "footer", section: "for_sellers", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "7", label: "Seller Guide", url: "/sell-faster-guide", position: "footer", section: "for_sellers", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 3, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "8", label: "Contact Support", url: "/contact", position: "footer", section: "for_sellers", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 4, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
];

const fallbackLegalLinks: NavigationLink[] = [
  { id: "9", label: "Privacy Policy", url: "/privacy", position: "footer", section: "legal", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 1, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "10", label: "Terms of Service", url: "/terms", position: "footer", section: "legal", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
  { id: "11", label: "Refund Policy", url: "/refund", position: "footer", section: "legal", linkType: "internal", isActive: true, openInNewTab: false, sortOrder: 3, createdAt: new Date(), updatedAt: new Date(), icon: null, searchParams: null },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const { data: allSettings = [] } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: navigationLinks = [] } = useQuery<NavigationLink[]>({
    queryKey: ["/api/navigation-links", { position: "footer" }],
    staleTime: 5 * 60 * 1000,
  });

  const settings: GroupedSettings = allSettings.length > 0
    ? allSettings.reduce((acc, s) => {
        acc[s.key as keyof GroupedSettings] = s.value ?? undefined;
        return acc;
      }, {} as GroupedSettings)
    : fallbackSettings;

  const quickLinks = navigationLinks.length > 0
    ? navigationLinks.filter(l => l.section === "quick_links" && l.linkType !== "search_filter")
    : fallbackQuickLinks;

  const sellerLinks = navigationLinks.length > 0
    ? navigationLinks.filter(l => l.section === "for_sellers")
    : fallbackSellerLinks;

  const legalLinks = navigationLinks.length > 0
    ? navigationLinks.filter(l => l.section === "legal")
    : fallbackLegalLinks;

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <img 
                src={vengrowLogo} 
                alt="VenGrow - Verified Property Market" 
                className="h-16 object-contain"
                data-testid="img-footer-logo"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              {settings.site_description || fallbackSettings.site_description}
            </p>
            <div className="flex gap-3">
              <a 
                href={settings.social_facebook || fallbackSettings.social_facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover-elevate active-elevate-2 p-2 rounded-md" 
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5 text-muted-foreground" />
              </a>
              <a 
                href={settings.social_twitter || fallbackSettings.social_twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover-elevate active-elevate-2 p-2 rounded-md" 
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5 text-muted-foreground" />
              </a>
              <a 
                href={settings.social_instagram || fallbackSettings.social_instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover-elevate active-elevate-2 p-2 rounded-md" 
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5 text-muted-foreground" />
              </a>
              <a 
                href={settings.social_linkedin || fallbackSettings.social_linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover-elevate active-elevate-2 p-2 rounded-md" 
                data-testid="link-linkedin"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link 
                    href={link.url} 
                    className="text-muted-foreground hover:text-foreground transition-colors" 
                    data-testid={`link-${link.url.replace(/\//g, '-').substring(1)}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2 text-sm">
              {sellerLinks.map((link) => (
                <li key={link.id}>
                  <Link 
                    href={link.url} 
                    className="text-muted-foreground hover:text-foreground transition-colors" 
                    data-testid={`link-${link.url.replace(/\//g, '-').substring(1)}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{settings.contact_email || fallbackSettings.contact_email}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{settings.contact_phone || fallbackSettings.contact_phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{settings.contact_address || fallbackSettings.contact_address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} {settings.site_name || fallbackSettings.site_name}. All rights reserved.</p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link 
                key={link.id}
                href={link.url} 
                className="hover:text-foreground transition-colors" 
                data-testid={`link-${link.url.replace(/\//g, '').replace('-', '')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
