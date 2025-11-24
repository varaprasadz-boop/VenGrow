import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function VirtualTourPage() {
  const rooms = [
    { id: "living", name: "Living Room", thumbnail: "" },
    { id: "kitchen", name: "Kitchen", thumbnail: "" },
    { id: "bedroom1", name: "Master Bedroom", thumbnail: "" },
    { id: "bedroom2", name: "Bedroom 2", thumbnail: "" },
    { id: "bathroom", name: "Bathroom", thumbnail: "" },
    { id: "balcony", name: "Balcony", thumbnail: "" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Virtual Property Tour
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment in Bandra West, Mumbai
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Tour View */}
            <div className="lg:col-span-3">
              <Card className="p-0 overflow-hidden mb-6">
                <div className="relative">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">360° Virtual Tour</span>
                  </div>

                  {/* Tour Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/10 hover:bg-white/20"
                          data-testid="button-play"
                        >
                          <Play className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/10 hover:bg-white/20"
                          data-testid="button-volume"
                        >
                          <Volume2 className="h-4 w-4 text-white" />
                        </Button>
                        <span className="text-white text-sm ml-2">Living Room</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/10 hover:bg-white/20"
                          data-testid="button-reset"
                        >
                          <RotateCcw className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/10 hover:bg-white/20"
                          data-testid="button-fullscreen"
                        >
                          <Maximize className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" data-testid="button-prev">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Room
                </Button>
                <Badge className="px-4 py-2">Room 1 of 6</Badge>
                <Button variant="outline" data-testid="button-next">
                  Next Room
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Property Info */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">About This Property</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="font-semibold">₹85 L</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bedrooms</p>
                    <p className="font-semibold">3 BHK</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Area</p>
                    <p className="font-semibold">1,200 sqft</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Floor</p>
                    <p className="font-semibold">3rd</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Room List */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">All Rooms</h3>
                <div className="space-y-3">
                  {rooms.map((room, index) => (
                    <button
                      key={room.id}
                      className={`w-full text-left p-3 rounded-lg border hover-elevate active-elevate-2 ${
                        index === 0
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      data-testid={`button-room-${room.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium">{room.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full" data-testid="button-schedule">
                    Schedule Visit
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    data-testid="button-contact"
                  >
                    Contact Seller
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
