import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export default function GeocodingPage() {
  return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" />
              Geocoding Management
            </h1>
            <p className="text-muted-foreground">
              Manage location coordinates for properties
            </p>
          </div>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">Test Geocoding</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  placeholder="Enter full address"
                  data-testid="input-address"
                />
              </div>
              <Button data-testid="button-geocode">
                Get Coordinates
              </Button>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Result</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Latitude</p>
                <p className="font-mono font-semibold">19.0760</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Longitude</p>
                <p className="font-mono font-semibold">72.8777</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">API Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm">Requests Today</span>
                <span className="font-semibold">234</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="text-sm">Success Rate</span>
                <span className="font-semibold text-green-600">98.5%</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
}
