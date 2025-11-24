import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function PropertySoldPage() {
  const soldDetails = {
    title: "Luxury 3BHK Apartment",
    location: "Bandra West, Mumbai",
    soldPrice: "₹88 L",
    originalPrice: "₹85 L",
    soldDate: "Nov 15, 2025",
    timeListed: "45 days",
    totalViews: 1234,
    totalInquiries: 67,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              Property Sold!
            </h1>
            <p className="text-muted-foreground">
              Congratulations on your successful sale
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="font-serif font-bold text-2xl mb-2">
                {soldDetails.title}
              </h2>
              <p className="text-muted-foreground mb-4">{soldDetails.location}</p>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-5xl font-bold text-green-600">
                  {soldDetails.soldPrice}
                </span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                  +3.5% above listing
                </Badge>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Sold Date</h3>
              <p className="text-xl font-bold">{soldDetails.soldDate}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Time on Market</h3>
              <p className="text-xl font-bold">{soldDetails.timeListed}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Total Views</h3>
              <p className="text-xl font-bold">{soldDetails.totalViews}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Total Inquiries</h3>
              <p className="text-xl font-bold">{soldDetails.totalInquiries}</p>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              Download Report
            </Button>
            <Button className="flex-1" data-testid="button-list-another">
              List Another Property
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
