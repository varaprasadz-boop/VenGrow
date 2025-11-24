import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardHat, CheckCircle } from "lucide-react";

export default function PropertyConstructionQualityPage() {
  const qualityFeatures = {
    builder: "Prestige Constructions",
    yearBuilt: "2023",
    structure: "RCC Frame Structure",
    earthquake: "Zone 3 Compliant",
    certifications: ["ISO 9001:2015", "IGBC Green Building"],
    materials: [
      { name: "Walls", quality: "AAC Blocks with plaster finish" },
      { name: "Flooring", quality: "Vitrified tiles (800x800mm)" },
      { name: "Windows", quality: "UPVC with double glazing" },
      { name: "Doors", quality: "Hardwood with veneer finish" },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <HardHat className="h-8 w-8 text-primary" />
              Construction Quality
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Builder Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Builder</h3>
              <p className="text-2xl font-bold text-primary">
                {qualityFeatures.builder}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Year Built</h3>
              <p className="text-2xl font-bold">{qualityFeatures.yearBuilt}</p>
            </Card>
          </div>

          {/* Structure & Compliance */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Structure & Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Structure Type</p>
                <p className="font-semibold">{qualityFeatures.structure}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Earthquake Resistance
                </p>
                <p className="font-semibold">{qualityFeatures.earthquake}</p>
              </div>
            </div>
          </Card>

          {/* Certifications */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {qualityFeatures.certifications.map((cert, index) => (
                <Badge
                  key={index}
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {cert}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Materials */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Construction Materials</h3>
            <div className="space-y-4">
              {qualityFeatures.materials.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <span className="font-medium">{material.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {material.quality}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
