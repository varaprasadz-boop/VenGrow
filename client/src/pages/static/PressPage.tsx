import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

export default function PressPage() {
  const pressReleases = [
    {
      id: "1",
      title: "VenGrow Raises $10M Series A to Expand Across India",
      date: "Nov 15, 2025",
      excerpt:
        "Leading real estate marketplace secures funding to accelerate growth in tier-2 and tier-3 cities.",
    },
    {
      id: "2",
      title: "VenGrow Launches AI-Powered Property Recommendations",
      date: "Oct 28, 2025",
      excerpt:
        "New feature uses machine learning to match buyers with their ideal properties.",
    },
    {
      id: "3",
      title: "VenGrow Surpasses 100,000 Active Listings Milestone",
      date: "Sep 20, 2025",
      excerpt:
        "Platform growth continues with 3x increase in user engagement year-over-year.",
    },
  ];

  const mediaKit = [
    { name: "Company Logo (PNG)", size: "2.4 MB" },
    { name: "Brand Guidelines (PDF)", size: "5.1 MB" },
    { name: "Product Screenshots", size: "15.2 MB" },
    { name: "Executive Photos", size: "8.7 MB" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Latest news, updates, and media resources from VenGrow
            </p>
            <Button size="lg" data-testid="button-contact">
              Contact Press Team
            </Button>
          </div>
        </div>

        {/* Press Releases */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-12">
              Recent Press Releases
            </h2>
            <div className="space-y-6">
              {pressReleases.map((release) => (
                <Card key={release.id} className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        {release.date}
                      </p>
                      <h3 className="font-serif font-bold text-2xl mb-3">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {release.excerpt}
                      </p>
                      <Button variant="ghost" data-testid={`button-read-${release.id}`}>
                        Read Full Release
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Media Kit */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-3xl mb-4">
                Media Kit
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Download our media assets including logos, brand guidelines, and
                product images
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {mediaKit.map((item, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                    </div>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Media Inquiries
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              For press inquiries, interviews, or additional information, please
              contact our media relations team
            </p>
            <Card className="p-8 text-left max-w-2xl mx-auto">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">press@propconnect.com</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+91 22 1234 5678</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Office Hours</p>
                  <p className="font-medium">Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
