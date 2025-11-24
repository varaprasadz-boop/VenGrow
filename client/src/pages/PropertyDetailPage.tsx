import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import heroImage from '@assets/generated_images/luxury_indian_apartment_building.png';
import apartmentImage from '@assets/generated_images/modern_apartment_interior_india.png';
import kitchenImage from '@assets/generated_images/modern_kitchen_interior_apartment.png';

export default function PropertyDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // TODO: Remove mock data
  const property = {
    id: "1",
    title: "Luxury 3BHK Apartment in Prime Location",
    price: 8500000,
    location: "Bandra West, Mumbai, Maharashtra",
    description: "Experience luxury living in this spacious 3BHK apartment located in the heart of Bandra West. This property features modern amenities, premium finishes, and breathtaking views of the Arabian Sea. Perfect for families looking for comfort and convenience.",
    propertyType: "Apartment",
    transactionType: "Sale",
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    carpetArea: 1200,
    floor: 12,
    totalFloors: 20,
    facing: "West",
    ageOfProperty: "Under Construction",
    furnishing: "Semi-Furnished",
    possession: "Dec 2025",
    images: [heroImage, apartmentImage, kitchenImage],
    amenities: [
      "Swimming Pool",
      "Gym",
      "24/7 Security",
      "Power Backup",
      "Lift",
      "Parking",
      "Clubhouse",
      "Children's Play Area",
      "Garden",
    ],
    seller: {
      name: "Prestige Estates",
      type: "Builder",
      isVerified: true,
      phone: "+91 98765 43210",
      email: "contact@prestigeestates.com",
    },
  };

  const formatPrice = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleInquiry = () => {
    console.log('Inquiry submitted');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />
      
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
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                  <img
                    src={property.images[selectedImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/90 backdrop-blur-sm"
                      onClick={() => setIsFavorited(!isFavorited)}
                      data-testid="button-favorite"
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
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
                <div className="grid grid-cols-3 gap-4">
                  {property.images.map((image, index) => (
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
              </div>

              {/* Title & Price */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>For {property.transactionType}</Badge>
                      <Badge variant="outline">{property.propertyType}</Badge>
                    </div>
                    <h1 className="font-serif font-bold text-3xl mb-2">{property.title}</h1>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary font-serif">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">Bedrooms</span>
                    </div>
                    <p className="font-semibold">{property.bedrooms} BHK</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">Bathrooms</span>
                    </div>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">Built-up Area</span>
                    </div>
                    <p className="font-semibold">{property.area} sq.ft</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">Floor</span>
                    </div>
                    <p className="font-semibold">{property.floor} of {property.totalFloors}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Compass className="h-4 w-4" />
                      <span className="text-sm">Facing</span>
                    </div>
                    <p className="font-semibold">{property.facing}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span className="text-sm">Furnishing</span>
                    </div>
                    <p className="font-semibold">{property.furnishing}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Possession</span>
                    </div>
                    <p className="font-semibold">{property.possession}</p>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </Card>

              {/* Amenities */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Map Section */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Location</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive map will be shown here</p>
                    <p className="text-sm text-muted-foreground mt-1">(Google Maps integration)</p>
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
                        <h3 className="font-semibold">{property.seller.name}</h3>
                        {property.seller.isVerified && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{property.seller.type}</p>
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
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleInquiry(); }}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" data-testid="input-inquiry-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" data-testid="input-inquiry-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+91 98765 43210" data-testid="input-inquiry-phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="I'm interested in this property..."
                      rows={4}
                      data-testid="textarea-inquiry-message"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-inquiry">
                    Submit Inquiry
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
