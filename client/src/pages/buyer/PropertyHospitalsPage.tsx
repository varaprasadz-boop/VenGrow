import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Clock } from "lucide-react";

export default function PropertyHospitalsPage() {
  const hospitals = [
    {
      id: "1",
      name: "Lilavati Hospital",
      type: "Multi-Specialty",
      distance: "2.1 km",
      rating: 4.6,
      emergency: true,
      specialties: ["Cardiology", "Neurology", "Oncology"],
    },
    {
      id: "2",
      name: "Bandra Medical Center",
      type: "Clinic",
      distance: "600m",
      rating: 4.2,
      emergency: false,
      specialties: ["General Medicine", "Pediatrics"],
    },
    {
      id: "3",
      name: "Apollo Spectra Hospital",
      type: "Specialty Hospital",
      distance: "3.5 km",
      rating: 4.5,
      emergency: true,
      specialties: ["Orthopedics", "ENT", "Gynecology"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              Nearby Healthcare Facilities
            </h1>
            <p className="text-muted-foreground">
              Hospitals and medical centers near this property
            </p>
          </div>

          {/* Map */}
          <Card className="p-6 mb-8">
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Healthcare Map View</span>
            </div>
          </Card>

          {/* Hospitals List */}
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{hospital.name}</h3>
                      <Badge variant="outline">{hospital.type}</Badge>
                      {hospital.emergency && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
                          <Clock className="h-3 w-3 mr-1" />
                          24/7 Emergency
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{hospital.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{hospital.rating}/5</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Specialties:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specialties.map((specialty, index) => (
                          <Badge key={index}>{specialty}</Badge>
                        ))}
                      </div>
                    </div>
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
