import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Eye, ArrowUp, ArrowDown } from "lucide-react";

export default function PropertyPhotosPage() {
  const photos = [
    { id: "1", name: "Living Room", isPrimary: true },
    { id: "2", name: "Master Bedroom" },
    { id: "3", name: "Kitchen" },
    { id: "4", name: "Bathroom" },
    { id: "5", name: "Balcony" },
    { id: "6", name: "Building Exterior" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Property Photos
              </h1>
              <p className="text-muted-foreground">
                Luxury 3BHK Apartment • Bandra West, Mumbai
              </p>
            </div>
            <Button data-testid="button-upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>

          {/* Upload Area */}
          <Card className="p-12 mb-8 border-dashed border-2">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">
                Drag & Drop photos here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse (max 20 photos, 5MB each)
              </p>
              <Button variant="outline">Browse Files</Button>
            </div>
          </Card>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <span className="text-sm text-muted-foreground">
                    {photo.name}
                  </span>
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary">Primary</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium truncate">{photo.name}</p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === 0}
                      data-testid={`button-up-${photo.id}`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={index === photos.length - 1}
                      data-testid={`button-down-${photo.id}`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      data-testid={`button-view-${photo.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      data-testid={`button-delete-${photo.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-2">Photo Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use natural lighting for best results</li>
              <li>• Clean and declutter rooms before photographing</li>
              <li>• Take photos from different angles</li>
              <li>• Include all rooms and important features</li>
              <li>• High-quality photos get 3x more inquiries</li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
