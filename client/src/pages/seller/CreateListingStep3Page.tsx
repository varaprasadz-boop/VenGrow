import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

function isValidYouTubeUrl(url: string): boolean {
  if (!url) return true;
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
  ];
  return patterns.some(pattern => pattern.test(url));
}

const MAX_PHOTOS = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function CreateListingStep3Page() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<{ name: string; dataUrl: string }[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [virtualTourUrl, setVirtualTourUrl] = useState("");
  const [dataValidated, setDataValidated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!authLoading && isAuthenticated) {
      const templateId = localStorage.getItem("selectedFormTemplateId");
      if (!templateId) {
        navigate("/seller/select-form");
        return;
      }

      const step1Data = localStorage.getItem("createListingStep1");
      const step2Data = localStorage.getItem("createListingStep2");

      if (!step1Data || !step2Data) {
        toast({
          title: "Missing Data",
          description: "Please complete previous steps first.",
          variant: "destructive",
        });
        navigate("/seller/listings/create/step1");
        return;
      }

      const savedStep3 = localStorage.getItem("createListingStep3");
      if (savedStep3) {
        try {
          const parsed = JSON.parse(savedStep3);
          if (parsed.youtubeVideoUrl) {
            setVideoUrl(parsed.youtubeVideoUrl);
          }
          if (parsed.virtualTourUrl) {
            setVirtualTourUrl(parsed.virtualTourUrl);
          }
        } catch (e) {
          console.error("Error restoring step 3 data:", e);
        }
      }

      setDataValidated(true);
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  if (authLoading || !dataValidated) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      toast({
        title: "Photo Limit Reached",
        description: `You can upload a maximum of ${MAX_PHOTOS} photos.`,
        variant: "destructive",
      });
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remaining);
    const invalidFiles: string[] = [];
    const oversizedFiles: string[] = [];
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        invalidFiles.push(file.name);
      } else if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    }

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: `Only JPG, PNG, and WebP files are allowed. Skipped: ${invalidFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    if (oversizedFiles.length > 0) {
      toast({
        title: "File Too Large",
        description: `Files must be under 10MB. Skipped: ${oversizedFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const newPhotos = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise<{ name: string; dataUrl: string }>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({ name: file.name, dataUrl: reader.result as string });
              };
              reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
              reader.readAsDataURL(file);
            })
        )
      );
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err) {
      toast({
        title: "Upload Error",
        description: "Some photos could not be read. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (dt.files && dt.files.length > 0) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        Array.from(dt.files).forEach((f) => dataTransfer.items.add(f));
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base">Property Photos *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload at least 5 photos. Maximum {MAX_PHOTOS} photos allowed.
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {photos.length}/{MAX_PHOTOS}
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  data-testid="input-file-upload"
                />

                {photos.length < MAX_PHOTOS && (
                  <div
                    onClick={handleUploadClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover-elevate active-elevate-2 mb-6"
                    data-testid="button-upload-photos"
                  >
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    ) : (
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <h3 className="font-semibold mb-2">
                      {uploading ? "Processing photos..." : "Click to upload photos"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP up to 10MB each
                    </p>
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border overflow-hidden group"
                        data-testid={`photo-preview-${index}`}
                      >
                        <img
                          src={photo.dataUrl}
                          alt={photo.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                          type="button"
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
                        <div className="absolute bottom-2 right-2 max-w-[60%]">
                          <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded truncate block">
                            {photo.name}
                          </span>
                        </div>
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

              <div>
                <Label className="text-base">YouTube Video (Optional)</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add a YouTube video link to showcase your property with a virtual tour or walkthrough
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                      <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Paste YouTube link (e.g., https://youtube.com/watch?v=...)"
                        className="w-full px-4 py-2 border rounded-lg text-sm"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        data-testid="input-youtube-url"
                      />
                      {videoUrl && !isValidYouTubeUrl(videoUrl) && (
                        <p className="text-xs text-destructive mt-1">
                          Please enter a valid YouTube URL
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Supported formats:</strong> youtube.com/watch?v=, youtu.be/, youtube.com/embed/
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base">Virtual Tour Link (Optional)</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add a 360 degree virtual tour link if available
                </p>
                <input
                  type="text"
                  placeholder="Enter virtual tour URL"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={virtualTourUrl}
                  onChange={(e) => setVirtualTourUrl(e.target.value)}
                  data-testid="input-virtual-tour"
                />
              </div>

              <div className="flex justify-between pt-6">
                <Link href="/seller/listings/create/step2">
                  <Button variant="outline" type="button" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Button 
                  type="button" 
                  data-testid="button-next"
                  onClick={() => {
                    if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
                      toast({
                        title: "Invalid YouTube URL",
                        description: "Please enter a valid YouTube link or leave the field empty.",
                        variant: "destructive",
                      });
                      return;
                    }
                    try {
                      localStorage.setItem("createListingStep3", JSON.stringify({
                        photoCount: photos.length,
                        photoNames: photos.map(p => p.name),
                        youtubeVideoUrl: videoUrl,
                        virtualTourUrl,
                      }));
                    } catch (err) {
                      console.error("Error saving step 3 data:", err);
                    }
                    navigate("/seller/listings/create/step4");
                  }}
                >
                  Next: Contact & Preview
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
    </main>
  );
}
