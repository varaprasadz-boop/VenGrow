import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
import type { Property } from "@shared/schema";
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
} from "lucide-react";

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
  const images = (property as any).images?.length > 0 
    ? (property as any).images 
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
                  <div className="bg-muted rounded-lg h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Interactive map will be shown here</p>
                  </div>
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
