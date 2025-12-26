import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PropertySEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Property } from "@shared/schema";
import PropertyMap from "@/components/PropertyMap";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle2,
  Heart,
  Share2,
  Phone,
  Mail,
  Building2,
  Home,
  Calendar,
  Compass,
  Loader2,
  Play,
  CalendarDays,
  Clock,
} from "lucide-react";

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
    <Card className="p-6" data-testid="youtube-video-section">
      <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
        <Play className="h-5 w-5" />
        Property Video
      </h2>
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Property Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </Card>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Inquiry form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  
  // Schedule visit modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitName, setVisitName] = useState("");
  const [visitPhone, setVisitPhone] = useState("");
  const [visitEmail, setVisitEmail] = useState("");
  const [visitNotes, setVisitNotes] = useState("");

  // Fetch property details
  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  // Check if property is favorited
  const { data: favoriteStatus } = useQuery<{ isFavorite: boolean }>({
    queryKey: [`/api/favorites/check?userId=${user?.id}&propertyId=${id}`],
    enabled: !!user?.id && !!id,
  });

  const isFavorited = favoriteStatus?.isFavorite || false;

  // Add/remove favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        await apiRequest("DELETE", "/api/favorites", { 
          userId: user?.id, 
          propertyId: id 
        });
      } else {
        await apiRequest("POST", "/api/favorites", { 
          userId: user?.id, 
          propertyId: id 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/check?userId=${user?.id}&propertyId=${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/favorites"] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  // Submit inquiry mutation
  const inquiryMutation = useMutation({
    mutationFn: async () => {
      if (!property) throw new Error("Property not found");
      
      return await apiRequest("POST", "/api/inquiries", {
        propertyId: id,
        userId: user?.id || null,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        message: inquiryMessage,
      });
    },
    onSuccess: () => {
      toast({
        title: "Inquiry sent successfully!",
        description: "The seller will respond to your inquiry soon.",
      });
      // Clear form
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
      setInquiryMessage("");
      // Invalidate inquiries cache
      queryClient.invalidateQueries({ queryKey: ["/api/me/inquiries"] });
    },
    onError: () => {
      toast({
        title: "Failed to send inquiry",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      toast({
        title: "Please fill in required fields",
        description: "Name, email, and message are required.",
        variant: "destructive",
      });
      return;
    }
    
    inquiryMutation.mutate();
  };

  // Schedule visit mutation
  const scheduleVisitMutation = useMutation({
    mutationFn: async () => {
      if (!property) throw new Error("Property not found");
      
      return await apiRequest("POST", "/api/appointments", {
        propertyId: id,
        scheduledDate: visitDate,
        scheduledTime: visitTime,
        buyerName: visitName,
        buyerPhone: visitPhone,
        buyerEmail: visitEmail,
        notes: visitNotes,
      });
    },
    onSuccess: () => {
      toast({
        title: "Visit scheduled!",
        description: "The seller will confirm your visit request soon.",
      });
      setShowScheduleModal(false);
      setVisitDate("");
      setVisitTime("");
      setVisitName("");
      setVisitPhone("");
      setVisitEmail("");
      setVisitNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/me/appointments"] });
    },
    onError: () => {
      toast({
        title: "Failed to schedule visit",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleScheduleVisit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to schedule a visit.",
        variant: "destructive",
      });
      return;
    }
    
    if (!visitDate || !visitTime || !visitName.trim() || !visitPhone.trim()) {
      toast({
        title: "Please fill in required fields",
        description: "Date, time, name, and phone are required.",
        variant: "destructive",
      });
      return;
    }
    
    scheduleVisitMutation.mutate();
  };

  const openScheduleModal = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to schedule a visit.",
        variant: "destructive",
      });
      return;
    }
    // Pre-fill with user data
    setVisitName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
    setVisitEmail(user.email || '');
    setVisitPhone(user.phone || '');
    setShowScheduleModal(true);
  };

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save favorites.",
        variant: "destructive",
      });
      return;
    }
    favoriteMutation.mutate();
  };

  const formatPrice = (amount: number, transactionType?: string) => {
    const suffix = transactionType === "rent" || transactionType === "lease" ? "/mo" : "";
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr${suffix}`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L${suffix}`;
    }
    return `₹${amount.toLocaleString('en-IN')}${suffix}`;
  };

  // Pre-fill form with user data if logged in
  useState(() => {
    if (user) {
      setInquiryName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
      setInquiryEmail(user.email || '');
      setInquiryPhone(user.phone || '');
    }
  });

  if (propertyLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={!!user} userType={user?.role || "buyer"} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="aspect-[16/10] rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={!!user} userType={user?.role || "buyer"} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
            <p className="text-muted-foreground">The property you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get property images or use placeholder
  // Handle both array of objects (PropertyImage) and array of strings (legacy)
  const images = (property as any).images?.length > 0 
    ? (property as any).images.map((img: any) => typeof img === 'string' ? img : img.url)
    : ['/placeholder-property.jpg'];

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'sale': return 'Sale';
      case 'rent': return 'Rent';
      case 'lease': return 'Lease';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PropertySEO
        title={property.title}
        location={`${property.locality || property.city}, ${property.state}`}
        price={property.price}
        imageUrl={typeof (property as any).images?.[0] === 'string' 
          ? (property as any).images?.[0] 
          : (property as any).images?.[0]?.url}
      />
      <Header isLoggedIn={!!user} userType={user?.role || "buyer"} />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-foreground">Home</a>
            <span className="mx-2">/</span>
            <a href="/listings" className="hover:text-foreground">Properties</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">{property.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted">
                  <img
                    src={images[selectedImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/90 backdrop-blur-sm"
                      onClick={handleFavoriteClick}
                      disabled={favoriteMutation.isPending}
                      data-testid="button-favorite"
                    >
                      {favoriteMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/90 backdrop-blur-sm"
                      data-testid="button-share"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image: string, index: number) => (
                      <div
                        key={index}
                        className={`aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 ${
                          selectedImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube Video Embed */}
              {property.youtubeVideoUrl && (
                <YouTubeEmbed url={property.youtubeVideoUrl} />
              )}

              {/* Title & Price */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge data-testid="badge-transaction-type">For {getTransactionLabel(property.transactionType)}</Badge>
                      <Badge variant="outline" data-testid="badge-property-type">{property.propertyType}</Badge>
                      {property.isVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <h1 className="font-serif font-bold text-3xl mb-2" data-testid="text-property-title">{property.title}</h1>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span data-testid="text-property-location">
                        {[property.locality, property.city, property.state].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary font-serif" data-testid="text-property-price">
                      {formatPrice(property.price, property.transactionType)}
                    </p>
                    {property.pricePerSqft && (
                      <p className="text-sm text-muted-foreground">
                        ₹{property.pricePerSqft.toLocaleString('en-IN')}/sq.ft
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {property.bedrooms && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bed className="h-4 w-4" />
                        <span className="text-sm">Bedrooms</span>
                      </div>
                      <p className="font-medium" data-testid="text-bedrooms">{property.bedrooms} BHK</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bath className="h-4 w-4" />
                        <span className="text-sm">Bathrooms</span>
                      </div>
                      <p className="font-medium" data-testid="text-bathrooms">{property.bathrooms}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">Area</span>
                    </div>
                    <p className="font-medium" data-testid="text-area">{property.area} sq.ft</p>
                  </div>
                  {property.floor && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span className="text-sm">Floor</span>
                      </div>
                      <p className="font-medium">{property.floor} of {property.totalFloors || '?'}</p>
                    </div>
                  )}
                  {property.facing && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Compass className="h-4 w-4" />
                        <span className="text-sm">Facing</span>
                      </div>
                      <p className="font-medium">{property.facing}</p>
                    </div>
                  )}
                  {property.ageOfProperty && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Property Age</span>
                      </div>
                      <p className="font-medium">{property.ageOfProperty} years</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Description */}
              {property.description && (
                <Card className="p-6">
                  <h2 className="font-semibold text-xl mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                    {property.description}
                  </p>
                </Card>
              )}

              {/* Amenities */}
              {property.amenities && (property.amenities as string[]).length > 0 && (
                <Card className="p-6">
                  <h2 className="font-semibold text-xl mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(property.amenities as string[]).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Location */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Location</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p>{property.address || [property.locality, property.city, property.state, property.pincode].filter(Boolean).join(', ')}</p>
                  </div>
                  <PropertyMap
                    properties={[property]}
                    singleProperty={true}
                    height="300px"
                    showPropertyCards={false}
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Seller Info */}
              <Card className="p-6 sticky top-24">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Property Seller</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Contact for details</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" data-testid="button-call-seller">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Seller
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-chat-seller">
                      <Mail className="h-4 w-4 mr-2" />
                      Chat with Seller
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Inquiry Form */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Send Inquiry</h3>
                <form className="space-y-4" onSubmit={handleInquiry}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      data-testid="input-inquiry-name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      data-testid="input-inquiry-email" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      data-testid="input-inquiry-phone" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="I'm interested in this property..."
                      rows={4}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      data-testid="textarea-inquiry-message"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={inquiryMutation.isPending}
                    data-testid="button-submit-inquiry"
                  >
                    {inquiryMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </Button>
                </form>
              </Card>
              
              {/* Schedule Visit Card */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Schedule a Visit
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Book a visit to see this property in person
                </p>
                <Button 
                  className="w-full" 
                  onClick={openScheduleModal}
                  data-testid="button-schedule-visit"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Property Visit
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Visit Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Schedule Property Visit
            </DialogTitle>
            <DialogDescription>
              Choose a date and time for your property visit. The seller will confirm your request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleVisit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visit-date">Date *</Label>
                <Input
                  id="visit-date"
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  data-testid="input-visit-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visit-time">Time *</Label>
                <Select value={visitTime} onValueChange={setVisitTime}>
                  <SelectTrigger data-testid="select-visit-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                    <SelectItem value="05:00 PM">05:00 PM</SelectItem>
                    <SelectItem value="06:00 PM">06:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-name">Your Name *</Label>
              <Input
                id="visit-name"
                placeholder="Your full name"
                value={visitName}
                onChange={(e) => setVisitName(e.target.value)}
                data-testid="input-visit-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visit-phone">Phone *</Label>
                <Input
                  id="visit-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={visitPhone}
                  onChange={(e) => setVisitPhone(e.target.value)}
                  data-testid="input-visit-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visit-email">Email</Label>
                <Input
                  id="visit-email"
                  type="email"
                  placeholder="your@email.com"
                  value={visitEmail}
                  onChange={(e) => setVisitEmail(e.target.value)}
                  data-testid="input-visit-email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visit-notes">Notes (optional)</Label>
              <Textarea
                id="visit-notes"
                placeholder="Any specific requirements or questions..."
                rows={3}
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                data-testid="textarea-visit-notes"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={scheduleVisitMutation.isPending} data-testid="button-confirm-schedule">
                {scheduleVisitMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Visit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
