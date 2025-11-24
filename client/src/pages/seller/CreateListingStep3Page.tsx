import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";

export default function CreateListingStep3Page() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  const handlePhotoUpload = () => {
    console.log("Photo upload triggered");
    setPhotos([...photos, "photo-placeholder.jpg"]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Step 3 of 4: Photos & Media</p>
          </div>

          <Card className="p-8">
            <h1 className="font-serif font-bold text-2xl mb-2">
              Upload Photos & Videos
            </h1>
            <p className="text-muted-foreground mb-8">
              Add high-quality photos and videos to attract more buyers
            </p>

            <form className="space-y-8">
              {/* Photos Upload */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base">Property Photos *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload at least 5 photos. Maximum 20 photos allowed.
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {photos.length}/20
                  </span>
                </div>

                {/* Upload Button */}
                <div
                  onClick={handlePhotoUpload}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover-elevate active-elevate-2 mb-6"
                  data-testid="button-upload-photos"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Click to upload photos</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB each
                  </p>
                </div>

                {/* Photo Grid */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                          data-testid={`button-remove-photo-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2">
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                              Cover Photo
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-400">
                    <strong>Photo Tips:</strong> Include photos of all rooms, kitchen, bathrooms, and outdoor areas. Good lighting and multiple angles help attract more buyers.
                  </p>
                </div>
              </div>

              {/* Video Upload */}
              <div>
                <Label className="text-base">Property Video (Optional)</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add a video tour or YouTube link
                </p>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Upload video or add YouTube link</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    MP4 up to 50MB
                  </p>
                  <div className="max-w-md mx-auto">
                    <input
                      type="text"
                      placeholder="Or paste YouTube URL here"
                      className="w-full px-4 py-2 border rounded-lg text-sm"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      data-testid="input-video-url"
                    />
                  </div>
                </div>
              </div>

              {/* Virtual Tour */}
              <div>
                <Label className="text-base">Virtual Tour Link (Optional)</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add a 360° virtual tour link if available
                </p>
                <input
                  type="text"
                  placeholder="Enter virtual tour URL"
                  className="w-full px-4 py-2 border rounded-lg"
                  data-testid="input-virtual-tour"
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Link href="/seller/create-listing/step2">
                  <Button variant="outline" type="button" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Button type="button" data-testid="button-next">
                  Next: Contact & Preview
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
