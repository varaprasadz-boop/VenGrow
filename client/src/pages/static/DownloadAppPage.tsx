import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, QrCode, Download } from "lucide-react";

export default function DownloadAppPage() {
  const features = [
    "Browse properties on the go",
    "Instant notifications for new listings",
    "Schedule property visits",
    "Chat with sellers in real-time",
    "Save favorites and search preferences",
    "Get price drop alerts",
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
                <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
                  Download VenGrow Mobile App
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Find your dream property anytime, anywhere with our mobile app
                </p>
                <div className="flex gap-4 mb-8">
                  <Button size="lg" data-testid="button-app-store">
                    <Download className="h-5 w-5 mr-2" />
                    App Store
                  </Button>
                  <Button size="lg" variant="outline" data-testid="button-play-store">
                    <Download className="h-5 w-5 mr-2" />
                    Google Play
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="p-8 bg-white dark:bg-black rounded-lg shadow-lg">
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Scan to download
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              App Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">{feature}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Screenshots */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              App Screenshots
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center"
                >
                  <span className="text-sm text-muted-foreground">
                    Screenshot {i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
