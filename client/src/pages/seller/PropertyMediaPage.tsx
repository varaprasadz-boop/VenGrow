import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Video, Trash2, Upload } from "lucide-react";

export default function PropertyMediaPage() {
  const photos = [
    { id: "1", name: "Living Room", size: "2.4 MB", primary: true },
    { id: "2", name: "Master Bedroom", size: "1.8 MB", primary: false },
    { id: "3", name: "Kitchen", size: "2.1 MB", primary: false },
  ];

  const videos = [
    { id: "1", name: "Property Walkthrough", duration: "3:45", size: "45 MB" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Image className="h-8 w-8 text-primary" />
              Manage Media
            </h1>
            <p className="text-muted-foreground">
              Photos and videos for your property
            </p>
          </div>

          {/* Photos */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Photos ({photos.length})</h3>
              <Button variant="outline" size="sm" data-testid="button-upload-photo">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
            <div className="space-y-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{photo.name}</p>
                        {photo.primary && (
                          <Badge className="bg-primary/10 text-primary">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{photo.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-delete-photo-${photo.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Videos */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Videos ({videos.length})</h3>
              <Button variant="outline" size="sm" data-testid="button-upload-video">
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
            </div>
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">{video.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{video.duration}</span>
                        <span>•</span>
                        <span>{video.size}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-delete-video-${video.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
