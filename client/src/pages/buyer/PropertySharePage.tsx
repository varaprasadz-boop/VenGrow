import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Mail, MessageCircle, Copy, Facebook, Twitter } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function PropertySharePage() {
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
              <Share2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-3xl mb-4">
              Share Property
            </h1>
            <p className="text-muted-foreground">
              Share this property with friends and family
            </p>
          </div>

          {/* Property Preview */}
          <Card className="p-6 mb-8">
            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Property Image</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {property.location}
            </p>
            <p className="text-2xl font-bold font-serif text-primary">
              {property.price}
            </p>
          </Card>

          {/* Share Options */}
          <div className="space-y-4">
            <Button
              className="w-full justify-start"
              variant="outline"
              size="lg"
              data-testid="button-whatsapp"
            >
              <SiWhatsapp className="h-5 w-5 mr-3" />
              Share via WhatsApp
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              size="lg"
              data-testid="button-email"
            >
              <Mail className="h-5 w-5 mr-3" />
              Share via Email
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              size="lg"
              data-testid="button-facebook"
            >
              <Facebook className="h-5 w-5 mr-3" />
              Share on Facebook
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              size="lg"
              data-testid="button-twitter"
            >
              <Twitter className="h-5 w-5 mr-3" />
              Share on Twitter
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              size="lg"
              data-testid="button-sms"
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Share via SMS
            </Button>
          </div>

          {/* Copy Link */}
          <Card className="p-6 mt-8">
            <h3 className="font-semibold mb-4">Or copy link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={property.link}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-muted"
                data-testid="input-link"
              />
              <Button data-testid="button-copy">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
