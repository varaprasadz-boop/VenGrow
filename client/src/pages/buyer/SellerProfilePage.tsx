import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Building, Phone, Mail, MessageCircle } from "lucide-react";

export default function SellerProfilePage() {
  const seller = {
    name: "Raj Properties",
    type: "Broker",
    rating: 4.5,
    reviews: 234,
    location: "Mumbai, Maharashtra",
    activeListings: 45,
    totalSold: 123,
    memberSince: "2020",
    verified: true,
  };

  const properties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      bedrooms: 3,
      area: "1,200 sqft",
    },
    {
      id: "2",
      title: "Commercial Office Space",
      location: "BKC, Mumbai",
      price: "₹2.5 Cr",
      area: "3,000 sqft",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Seller Profile Header */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">RP</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-serif font-bold text-3xl">{seller.name}</h1>
                  {seller.verified && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline">{seller.type}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{seller.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({seller.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {seller.location}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-2xl font-bold">{seller.activeListings}</p>
                    <p className="text-sm text-muted-foreground">
                      Active Listings
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{seller.totalSold}</p>
                    <p className="text-sm text-muted-foreground">
                      Properties Sold
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{seller.memberSince}</p>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button data-testid="button-call">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" data-testid="button-email">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" data-testid="button-chat">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Active Listings */}
          <div className="mb-8">
            <h2 className="font-serif font-bold text-2xl mb-6">
              Active Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover-elevate">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Image</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                    <p className="text-2xl font-bold font-serif text-primary mb-4">
                      {property.price}
                    </p>
                    <div className="flex gap-2 mb-4">
                      {property.bedrooms && (
                        <Badge variant="outline">{property.bedrooms} BHK</Badge>
                      )}
                      <Badge variant="outline">{property.area}</Badge>
                    </div>
                    <Button
                      className="w-full"
                      data-testid={`button-view-${property.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <Card className="p-8">
            <h2 className="font-serif font-bold text-2xl mb-6">
              Customer Reviews
            </h2>
            <div className="space-y-6">
              {[
                {
                  name: "Amit Kumar",
                  rating: 5,
                  comment: "Very professional and helpful. Found my dream home!",
                  date: "Nov 15, 2025",
                },
                {
                  name: "Priya Sharma",
                  rating: 4,
                  comment: "Good service, quick response to queries.",
                  date: "Nov 10, 2025",
                },
              ].map((review, index) => (
                <div key={index} className="pb-6 border-b last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {review.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
