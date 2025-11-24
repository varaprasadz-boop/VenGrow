import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function PropertyCommunityPage() {
  const communityFeatures = {
    association: "Bandra Heights Residents Association",
    members: 250,
    facilities: [
      "Community hall for events",
      "Kids play area",
      "Senior citizen lounge",
      "Library and reading room",
      "Yoga and meditation center",
    ],
    events: [
      "Monthly residents meet",
      "Festival celebrations",
      "Weekend sports activities",
      "Educational workshops",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Community Features
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {communityFeatures.association}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Active residents community
                </p>
              </div>
              <Badge>{communityFeatures.members} Members</Badge>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Community Facilities</h3>
            <div className="space-y-3">
              {communityFeatures.facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <span className="text-green-600">✓</span>
                  <span>{facility}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Regular Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {communityFeatures.events.map((event, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg text-center"
                >
                  <p className="font-medium">{event}</p>
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
