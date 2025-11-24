import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Home, Users, Building, FileText, HelpCircle } from "lucide-react";

export default function SitemapPage() {
  const sections = [
    {
      icon: Home,
      title: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "Search Properties", url: "/listings" },
        { name: "Pricing & Packages", url: "/packages" },
        { name: "How It Works", url: "/how-it-works" },
      ],
    },
    {
      icon: Users,
      title: "For Buyers",
      links: [
        { name: "Buyer Dashboard", url: "/buyer/dashboard" },
        { name: "Saved Properties", url: "/buyer/favorites" },
        { name: "My Inquiries", url: "/buyer/inquiries" },
        { name: "Property Alerts", url: "/buyer/property-alerts" },
        { name: "Mortgage Calculator", url: "/buyer/mortgage-calculator" },
      ],
    },
    {
      icon: Building,
      title: "For Sellers",
      links: [
        { name: "Seller Dashboard", url: "/seller/dashboard" },
        { name: "Create Listing", url: "/seller/create-listing" },
        { name: "Manage Listings", url: "/seller/manage-listings" },
        { name: "Analytics", url: "/seller/analytics" },
        { name: "Subscription", url: "/seller/subscription" },
      ],
    },
    {
      icon: FileText,
      title: "Information",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Contact Us", url: "/contact" },
        { name: "Blog", url: "/blog" },
        { name: "Careers", url: "/careers" },
        { name: "Press", url: "/press" },
      ],
    },
    {
      icon: HelpCircle,
      title: "Support & Legal",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "FAQ", url: "/faq" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Refund Policy", url: "/refund-policy" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl mb-4">Sitemap</h1>
            <p className="text-lg text-muted-foreground">
              Quick navigation to all pages on PropConnect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-semibold text-lg">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
