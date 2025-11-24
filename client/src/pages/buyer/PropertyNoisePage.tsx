import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";

export default function PropertyNoisePage() {
  const noiseInfo = {
    level: "Low",
    rating: "Quiet neighborhood",
    sources: ["Minimal traffic noise", "Occasional construction"],
    quietHours: "10 PM - 6 AM (Strict)",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Volume2 className="h-8 w-8 text-primary" />
              Noise Levels
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Noise Level</p>
              <p className="text-6xl font-bold text-green-600 mb-3">
                {noiseInfo.level}
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                {noiseInfo.rating}
              </Badge>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Noise Sources</h3>
              <div className="space-y-2">
                {noiseInfo.sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <span className="text-muted-foreground">•</span>
                    <span>{source}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Quiet Hours</h3>
              <p className="text-xl font-semibold">{noiseInfo.quietHours}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Society rules strictly enforced
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
