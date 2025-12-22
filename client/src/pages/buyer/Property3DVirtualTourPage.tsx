import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

export default function Property3DVirtualTourPage() {
  return (
    <main className="flex-1 relative">
      {/* 3D Viewer */}
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <span className="text-2xl text-muted-foreground">
          360° Virtual Tour Viewer
        </span>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <Card className="p-4 bg-black/80 backdrop-blur border-white/20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              data-testid="button-zoom-in"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              data-testid="button-zoom-out"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              data-testid="button-reset"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              data-testid="button-fullscreen"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Room Selector */}
      <div className="absolute top-24 right-8 z-10">
        <Card className="p-4 bg-black/80 backdrop-blur border-white/20 text-white">
          <h3 className="font-semibold mb-4">Rooms</h3>
          <div className="space-y-2">
            {["Living Room", "Master Bedroom", "Kitchen", "Bathroom"].map(
              (room) => (
                <button
                  key={room}
                  className="block w-full text-left px-3 py-2 rounded hover-elevate active-elevate-2 text-sm"
                >
                  {room}
                </button>
              )
            )}
          </div>
        </Card>
      </div>

      {/* Property Info */}
      <div className="absolute top-24 left-8 z-10">
        <Card className="p-4 bg-black/80 backdrop-blur border-white/20 text-white max-w-xs">
          <h2 className="font-serif font-bold text-xl mb-2">
            Luxury 3BHK Apartment
          </h2>
          <p className="text-sm text-white/70 mb-4">Bandra West, Mumbai</p>
          <p className="text-3xl font-bold font-serif text-orange-500">
            ₹85 L
          </p>
        </Card>
      </div>
    </main>
  );
}
