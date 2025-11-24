import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Plus,
  Calendar,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import heroImage from '@assets/generated_images/luxury_indian_apartment_building.png';
import apartmentImage from '@assets/generated_images/modern_apartment_interior_india.png';

export default function SellerDashboardPage() {
  const stats = [
    {
      label: "Active Listings",
      value: "8",
      icon: Building,
      change: "2 of 20 used",
      packageInfo: "Premium Package",
    },
    {
      label: "Total Views",
      value: "1,234",
      icon: Eye,
      change: "+156 this week",
      trend: "up",
    },
    {
      label: "Favorites",
      value: "89",
      icon: Heart,
      change: "+12 this week",
      trend: "up",
    },
    {
      label: "Inquiries",
      value: "45",
      icon: MessageSquare,
      change: "8 pending replies",
      trend: "neutral",
    },
  ];

  const recentInquiries = [
    {
      id: "1",
      property: "Luxury 3BHK Apartment in Bandra West",
      buyer: "Rahul Sharma",
      time: "2 hours ago",
      status: "new",
    },
    {
      id: "2",
      property: "Spacious 2BHK Flat in Koramangala",
      buyer: "Priya Patel",
      time: "5 hours ago",
      status: "replied",
    },
    {
      id: "3",
      property: "Beautiful Villa in Whitefield",
      buyer: "Amit Kumar",
      time: "1 day ago",
      status: "new",
    },
  ];

  const myListings = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment in Prime Location",
      price: 8500000,
      location: "Bandra West, Mumbai",
      imageUrl: heroImage,
      bedrooms: 3,
      bathrooms: 2,
      area: 1450,
      propertyType: "Apartment",
      isFeatured: true,
      isVerified: true,
      sellerType: "Builder" as const,
      transactionType: "Sale" as const,
      views: 345,
      favorites: 28,
      status: "active",
    },
    {
      id: "2",
      title: "Spacious 2BHK Flat with Modern Amenities",
      price: 45000,
      location: "Koramangala, Bangalore",
      imageUrl: apartmentImage,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: "Apartment",
      isVerified: true,
      sellerType: "Individual" as const,
      transactionType: "Rent" as const,
      views: 234,
      favorites: 15,
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Welcome back, Prestige Estates!
              </h1>
              <p className="text-muted-foreground">
                Here's an overview of your property listings
              </p>
            </div>
            <Button size="lg" data-testid="button-create-listing">
              <Plus className="h-5 w-5 mr-2" />
              Create New Listing
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.packageInfo || stat.change}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Current Package */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default">Premium Package</Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    Renews in 23 days
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">
                  ₹2,999/month • 20 Listings • Featured Badge
                </h3>
                <p className="text-sm text-muted-foreground">
                  8 of 20 listings used • Upgrade for unlimited listings
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" data-testid="button-manage-package">
                  Manage Package
                </Button>
                <Button data-testid="button-upgrade">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Inquiries */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-xl">Recent Inquiries</h2>
                  <Button variant="ghost" size="sm" data-testid="button-view-all-inquiries">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="flex items-start gap-4 p-4 rounded-lg hover-elevate active-elevate-2 border"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">
                            {inquiry.buyer}
                          </h3>
                          {inquiry.status === "new" && (
                            <Badge variant="default" className="flex-shrink-0">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {inquiry.property}
                        </p>
                        <p className="text-xs text-muted-foreground">{inquiry.time}</p>
                      </div>
                      <Button size="sm" variant="outline" data-testid={`button-reply-${inquiry.id}`}>
                        Reply
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* My Listings */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-xl">My Listings</h2>
                  <Button variant="ghost" size="sm" data-testid="button-manage-listings">
                    Manage All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myListings.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-create-new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-view-analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-view-inquiries">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Inquiries
                  </Button>
                </div>
              </Card>

              {/* Performance Tips */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Performance Tips</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Add more photos</p>
                    <p className="text-xs text-muted-foreground">
                      Listings with 10+ photos get 3x more views
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Respond quickly</p>
                    <p className="text-xs text-muted-foreground">
                      Fast responses increase conversion by 40%
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Update pricing</p>
                    <p className="text-xs text-muted-foreground">
                      Competitive pricing attracts more buyers
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
