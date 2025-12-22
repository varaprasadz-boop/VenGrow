import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Mic, MicOff, VideoOff, Phone } from "lucide-react";

export default function PropertyVideoCallPage() {
  return (
    <main className="flex-1">
      <div className="h-screen flex flex-col bg-black">
        {/* Header */}
        <div className="p-4 bg-black/50 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Virtual Property Tour</h2>
              <p className="text-sm text-white/70">
                Luxury 3BHK Apartment • Bandra West
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video */}
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">Seller's Camera View</span>
          </div>

          {/* Self View */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-muted rounded-lg flex items-center justify-center border-2 border-white">
            <span className="text-sm text-muted-foreground">Your Camera</span>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-black/50">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
              data-testid="button-mic"
            >
              <Mic className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
              data-testid="button-video"
            >
              <Video className="h-6 w-6" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              data-testid="button-end"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
