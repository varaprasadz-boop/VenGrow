import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function CompetitorAnalysisPage() {
  const competitors = [
    {
      id: "1",
      property: "Similar 3BHK in Bandra West",
      price: "₹82 L",
      yourPrice: "₹85 L",
      difference: -3,
      views: 1456,
      inquiries: 52,
      daysListed: 12,
    },
    {
      id: "2",
      property: "Comparable 3BHK in Same Building",
      price: "₹88 L",
      yourPrice: "₹85 L",
      difference: +3,
      views: 1123,
      inquiries: 38,
      daysListed: 8,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Competitor Analysis
            </h1>
            <p className="text-muted-foreground">
              Compare your listing with similar properties
            </p>
          </div>

          {/* Your Property */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="font-semibold mb-4">Your Property</h3>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Price</p>
                <p className="text-2xl font-bold text-primary">₹85 L</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Views</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inquiries</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Days Listed</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </Card>

          {/* Competitors */}
          <div className="space-y-4">
            {competitors.map((comp) => (
              <Card key={comp.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">{comp.property}</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{comp.price}</span>
                      </div>
                      {comp.difference > 0 ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">
                            {comp.difference}% cheaper
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm">
                            {Math.abs(comp.difference)}% costlier
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Views</p>
                    <p className="font-semibold">{comp.views}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Inquiries</p>
                    <p className="font-semibold">{comp.inquiries}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      Days Listed
                    </p>
                    <p className="font-semibold">{comp.daysListed}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
