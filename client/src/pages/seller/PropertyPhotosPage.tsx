import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Trash2, Eye, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Property } from "@shared/schema";

interface Photo {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

export default function PropertyPhotosPage() {
  const params = useParams();
  const propertyId = params.id;
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const { data: photos = [], isLoading: photosLoading } = useQuery<Photo[]>({
    queryKey: [`/api/properties/${propertyId}/photos`],
    enabled: !!propertyId,
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      return apiRequest("DELETE", `/api/properties/${propertyId}/photos/${photoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}/photos`] });
      toast({ title: "Photo deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete photo", variant: "destructive" });
    },
  });

  const reorderPhotosMutation = useMutation({
    mutationFn: async (photoIds: string[]) => {
      return apiRequest("PATCH", `/api/properties/${propertyId}/photos/reorder`, { photoIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}/photos`] });
      toast({ title: "Photos reordered successfully" });
    },
    onError: () => {
      toast({ title: "Failed to reorder photos", variant: "destructive" });
    },
  });

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadComplete = () => {
    setUploadDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}/photos`] });
    toast({ title: "Photos uploaded successfully" });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...photos];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    const photoIds = newOrder.map(p => p.id);
    reorderPhotosMutation.mutate(photoIds);
  };

  const handleMoveDown = (index: number) => {
    if (index === photos.length - 1) return;
    const newOrder = [...photos];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    const photoIds = newOrder.map(p => p.id);
    reorderPhotosMutation.mutate(photoIds);
  };

  const handleView = (photo: Photo) => {
    setViewingPhoto(photo);
  };

  const handleDelete = (photoId: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhotoMutation.mutate(photoId);
    }
  };

  const sortedPhotos = [...photos].sort((a, b) => a.order - b.order);

  if (propertyLoading || photosLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </main>
    );
  }

  const propertyTitle = property?.title || "Property";
  const propertyLocation = property 
    ? `${property.locality || ''}, ${property.city}`.replace(/^, /, '')
    : "";

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Property Photos
              </h1>
              <p className="text-muted-foreground">
                {propertyTitle} {propertyLocation ? `• ${propertyLocation}` : ''}
              </p>
            </div>
            <Button data-testid="button-upload" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Photos
            </Button>
          </div>

          {/* Upload Area */}
          {sortedPhotos.length === 0 && (
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
                <Button variant="outline" onClick={handleUpload}>Browse Files</Button>
              </div>
            </Card>
          )}

          {/* Photo Grid */}
          {sortedPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {sortedPhotos.map((photo, index) => (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={photo.url} 
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {photo.isPrimary && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary">Primary</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-sm font-medium truncate">{photo.caption || `Photo ${index + 1}`}</p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === 0 || reorderPhotosMutation.isPending}
                        data-testid={`button-up-${photo.id}`}
                        onClick={() => handleMoveUp(index)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === sortedPhotos.length - 1 || reorderPhotosMutation.isPending}
                        data-testid={`button-down-${photo.id}`}
                        onClick={() => handleMoveDown(index)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-view-${photo.id}`}
                        onClick={() => handleView(photo)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={deletePhotoMutation.isPending}
                        data-testid={`button-delete-${photo.id}`}
                        onClick={() => handleDelete(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

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

          {/* Upload Dialog */}
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Property Photos</DialogTitle>
              </DialogHeader>
              <ObjectUploader
                bucket="property-photos"
                prefix={`${propertyId}/`}
                onComplete={handleUploadComplete}
                maxFiles={20}
                accept="image/*"
              />
            </DialogContent>
          </Dialog>

          {/* View Photo Dialog */}
          <Dialog open={!!viewingPhoto} onOpenChange={() => setViewingPhoto(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{viewingPhoto?.caption || "Property Photo"}</DialogTitle>
              </DialogHeader>
              {viewingPhoto && (
                <img 
                  src={viewingPhoto.url} 
                  alt={viewingPhoto.caption || "Property photo"}
                  className="w-full h-auto rounded-lg"
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    );
}
