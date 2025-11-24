import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  Waves, 
  ShieldCheck, 
  Car, 
  Zap, 
  Wind,
  TreePine,
  Users
} from "lucide-react";

export default function PropertyAmenitiesPage() {
  const amenityCategories = [
    {
      title: "Fitness & Recreation",
      icon: Dumbbell,
      amenities: [
        { name: "Fully Equipped Gym", available: true },
        { name: "Swimming Pool", available: true },
        { name: "Yoga Studio", available: true },
        { name: "Sports Court", available: false },
      ],
    },
    {
      title: "Safety & Security",
      icon: ShieldCheck,
      amenities: [
        { name: "24/7 Security", available: true },
        { name: "CCTV Surveillance", available: true },
        { name: "Intercom Facility", available: true },
        { name: "Fire Safety Systems", available: true },
      ],
    },
    {
      title: "Parking & Transport",
      icon: Car,
      amenities: [
        { name: "Covered Parking", available: true },
        { name: "Visitor Parking", available: true },
        { name: "Electric Vehicle Charging", available: false },
      ],
    },
    {
      title: "Power & Utilities",
      icon: Zap,
      amenities: [
        { name: "24/7 Power Backup", available: true },
        { name: "Water Supply", available: true },
        { name: "Gas Pipeline", available: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Amenities & Features
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {amenityCategories.map((category, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                </div>

                <div className="space-y-3">
                  {category.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="text-sm">{amenity.name}</span>
                      {amenity.available ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Available</Badge>
                      )}
                    </div>
                  ))}
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
