import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Star, MapPin } from "lucide-react";

export default function PropertySchoolsPage() {
  const schools = [
    {
      id: "1",
      name: "St. Xavier's High School",
      type: "Private",
      distance: "0.8 km",
      rating: 4.5,
      board: "ICSE",
      grades: "K-12",
    },
    {
      id: "2",
      name: "Mumbai International School",
      type: "Private",
      distance: "1.2 km",
      rating: 4.7,
      board: "IB",
      grades: "Pre-K to 12",
    },
    {
      id: "3",
      name: "Government Primary School",
      type: "Government",
      distance: "0.5 km",
      rating: 3.8,
      board: "SSC",
      grades: "1-7",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              Nearby Schools
            </h1>
            <p className="text-muted-foreground">
              Educational institutions near this property
            </p>
          </div>

          {/* Map */}
          <Card className="p-6 mb-8">
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Schools Map View</span>
            </div>
          </Card>

          {/* Schools List */}
          <div className="space-y-4">
            {schools.map((school) => (
              <Card key={school.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{school.name}</h3>
                      <Badge variant="outline">{school.type}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{school.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{school.rating}/5</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Board: </span>
                        <span className="font-medium">{school.board}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Grades: </span>
                        <span className="font-medium">{school.grades}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
