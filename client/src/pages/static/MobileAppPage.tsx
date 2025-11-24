import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Search, Bell, MessageCircle, TrendingUp } from "lucide-react";

export default function MobileAppPage() {
  const features = [
    {
      icon: Search,
      title: "Smart Property Search",
      description: "Find your perfect property with advanced filters and AI recommendations",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get real-time alerts for new listings matching your preferences",
    },
    {
      icon: MessageCircle,
      title: "In-App Chat",
      description: "Connect directly with sellers and schedule property visits",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Access property analytics and market trends on the go",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
                  <Smartphone className="h-12 w-12 text-primary" />
                </div>
                <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
                  Download Our Mobile App
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Search, compare, and buy properties on the go with PropConnect
                  mobile app
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" data-testid="button-app-store">
                    <span className="text-lg">📱 App Store</span>
                  </Button>
                  <Button size="lg" variant="outline" data-testid="button-play-store">
                    <span className="text-lg">🤖 Play Store</span>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-96 bg-muted rounded-3xl flex items-center justify-center">
                  <span className="text-muted-foreground">App Screenshot</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              App Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-primary/10">
              <h2 className="font-serif font-bold text-3xl mb-4">
                Start Your Property Search Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join 500,000+ users already using PropConnect app
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg">Download Now</Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
