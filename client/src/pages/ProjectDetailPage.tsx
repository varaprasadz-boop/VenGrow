import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, MapPin, Calendar, Loader2, ArrowLeft, Home, IndianRupee,
  Bed, Bath, Maximize, Phone, Mail, ChevronRight, Play
} from "lucide-react";
import type { Project, Property } from "@shared/schema";
import { useState } from "react";

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  return `₹${(price / 100000).toFixed(2)} Lac`;
}

function YouTubeEmbed({ url }: { url: string }) {
  const getVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getVideoId(url);
  if (!videoId) return null;

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Project Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ["/api/projects/slug", slug],
    queryFn: async () => {
      let response = await fetch(`/api/projects/slug/${slug}`);
      if (!response.ok) {
        response = await fetch(`/api/projects/${slug}`);
      }
      if (!response.ok) throw new Error("Project not found");
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["/api/projects", project?.id, "properties"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${project!.id}/properties`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!project?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <Building2 className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Project Not Found</h1>
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          <Link href="/projects">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = project.galleryImages || [];
  const amenities = project.amenities || [];
  const floorPlans = project.floorPlans || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="bg-background border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Projects
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={images[selectedImage]} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((img: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition ${
                            idx === selectedImage ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : project.bannerImage ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={project.bannerImage} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Card className="aspect-video flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-muted-foreground" />
                </Card>
              )}

              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {project.projectStage && (
                        <Badge variant="secondary" className="capitalize">
                          {project.projectStage.replace(/_/g, " ")}
                        </Badge>
                      )}
                      {project.isFeatured && <Badge className="bg-primary">Featured</Badge>}
                    </div>
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl" data-testid="text-project-name">
                      {project.name}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-1 mt-2">
                      <MapPin className="h-4 w-4" />
                      {[project.locality, project.city, project.state].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>

                <Card className="p-4 mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price Range</p>
                      <p className="font-semibold text-primary">
                        {project.priceRangeMin && project.priceRangeMax 
                          ? `${formatPrice(project.priceRangeMin)} - ${formatPrice(project.priceRangeMax)}`
                          : "On Request"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Units</p>
                      <p className="font-semibold">{project.totalUnits || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completion</p>
                      <p className="font-semibold">
                        {project.completionDate 
                          ? new Date(project.completionDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
                          : "TBA"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RERA Number</p>
                      <p className="font-semibold">{project.reraNumber || "Applied"}</p>
                    </div>
                  </div>
                </Card>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="units">Floor Plans</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    {project.youtubeVideoUrl && <TabsTrigger value="video">Video</TabsTrigger>}
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <Card className="p-6">
                      <h2 className="font-semibold text-lg mb-4">About the Project</h2>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {project.description || "No description available."}
                      </p>
                    </Card>
                  </TabsContent>

                  <TabsContent value="units" className="mt-6">
                    {floorPlans.length > 0 ? (
                      <div className="grid gap-4">
                        {floorPlans.map((plan, idx) => (
                          <Card key={idx} className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground">{plan.area} sq.ft</p>
                              </div>
                              <p className="font-semibold text-primary">{formatPrice(plan.price)}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : properties.length > 0 ? (
                      <div className="grid gap-4">
                        {properties.map((property) => (
                          <Link key={property.id} href={`/property/${property.id}`}>
                            <Card className="p-4 hover-elevate cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                                    <Home className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{property.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                      {property.bedrooms && (
                                        <span className="flex items-center gap-1">
                                          <Bed className="h-3 w-3" /> {property.bedrooms} Bed
                                        </span>
                                      )}
                                      {property.bathrooms && (
                                        <span className="flex items-center gap-1">
                                          <Bath className="h-3 w-3" /> {property.bathrooms} Bath
                                        </span>
                                      )}
                                      {property.area && (
                                        <span className="flex items-center gap-1">
                                          <Maximize className="h-3 w-3" /> {property.area} sq.ft
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-primary">{formatPrice(property.price)}</p>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground inline" />
                                </div>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center">
                        <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No floor plan details available yet.</p>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="amenities" className="mt-6">
                    {amenities.length > 0 ? (
                      <Card className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {amenities.map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </Card>
                    ) : (
                      <Card className="p-8 text-center">
                        <p className="text-muted-foreground">No amenities listed.</p>
                      </Card>
                    )}
                  </TabsContent>

                  {project.youtubeVideoUrl && (
                    <TabsContent value="video" className="mt-6">
                      <Card className="p-6">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Play className="h-5 w-5" />
                          Project Video
                        </h2>
                        <YouTubeEmbed url={project.youtubeVideoUrl} />
                      </Card>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="p-6 sticky top-4">
                <h2 className="font-semibold text-lg mb-4">Interested in this project?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Get in touch with the developer for more details, site visits, and pricing.
                </p>
                <div className="space-y-3">
                  <Button className="w-full" size="lg" data-testid="button-contact-developer">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Developer
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" data-testid="button-request-callback">
                    <Mail className="h-4 w-4 mr-2" />
                    Request Callback
                  </Button>
                </div>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground text-center">
                  By contacting, you agree to VenGrow's Terms & Privacy Policy
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
