import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share2 } from "lucide-react";

export default function PropertyQRCodePage() {
  const property = {
    title: "Luxury 3BHK Apartment",
    location: "Bandra West, Mumbai",
    price: "₹85 L",
    link: "https://propconnect.com/property/123456",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-3xl mb-4">
              Property QR Code
            </h1>
            <p className="text-muted-foreground">
              Scan to view property details instantly
            </p>
          </div>

          {/* Property Preview */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {property.location}
            </p>
            <p className="text-2xl font-bold font-serif text-primary">
              {property.price}
            </p>
          </Card>

          {/* QR Code */}
          <Card className="p-8 mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-8 bg-white rounded-lg border-2">
                <div className="w-64 h-64 bg-muted flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-muted-foreground" />
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Scan this QR code with your phone camera to view property details
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button className="flex-1" data-testid="button-download">
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            <Button variant="outline" className="flex-1" data-testid="button-share">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Instructions */}
          <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-4">How to Use</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Open your phone's camera app</li>
              <li>• Point it at the QR code</li>
              <li>• Tap the notification to view property details</li>
              <li>• Download and print for property signage</li>
            </ul>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
