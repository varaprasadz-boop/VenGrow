import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageSquare,
  Eye,
  TrendingUp,
  Home,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import heroImage from '@assets/generated_images/luxury_indian_apartment_building.png';
import apartmentImage from '@assets/generated_images/modern_apartment_interior_india.png';

export default function BuyerDashboardPage() {
  const stats = [
    {
      label: "Favorites",
      value: "12",
      icon: Heart,
      change: "+2 this week",
      trend: "up",
    },
    {
      label: "Active Inquiries",
      value: "5",
      icon: MessageSquare,
      change: "2 pending replies",
      trend: "neutral",
    },
    {
      label: "Properties Viewed",
      value: "34",
      icon: Eye,
      change: "+8 this week",
      trend: "up",
    },
    {
      label: "Saved Searches",
      value: "3",
      icon: TrendingUp,
      change: "All active",
      trend: "neutral",
    },
  ];

  const recentInquiries = [
    {
      id: "1",
      property: "Luxury 3BHK Apartment in Bandra West",
      seller: "Prestige Estates",
      status: "pending",
      date: "2 hours ago",
    },
    {
      id: "2",
      property: "Spacious 2BHK Flat in Koramangala",
      seller: "John Smith",
      status: "replied",
      date: "1 day ago",
    },
    {
      id: "3",
      property: "Beautiful Villa in Whitefield",
      seller: "Real Estate Pro",
      status: "closed",
      date: "3 days ago",
    },
  ];

  const savedSearches = [
    { id: "1", name: "3BHK in Mumbai under ₹1 Cr", results: 45, newResults: 3 },
    { id: "2", name: "Villas in Bangalore", results: 23, newResults: 0 },
    { id: "3", name: "Commercial in Gurgaon", results: 12, newResults: 1 },
  ];

  const recentlyViewed = [
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
      isVerified: true,
      sellerType: "Builder" as const,
      transactionType: "Sale" as const,
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
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "replied":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Welcome back, John!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your property search
            </p>
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
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

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
                        <h3 className="font-medium mb-1 truncate">
                          {inquiry.property}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {inquiry.seller}
                        </p>
                        <p className="text-xs text-muted-foreground">{inquiry.date}</p>
                      </div>
                      <Badge
                        className={`${getStatusColor(inquiry.status)} flex items-center gap-1`}
                      >
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recently Viewed */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-xl">Recently Viewed</h2>
                  <Button variant="ghost" size="sm" data-testid="button-view-history">
                    View History
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentlyViewed.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Saved Searches */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Saved Searches</h3>
                  <Button variant="ghost" size="sm" data-testid="button-manage-searches">
                    Manage
                  </Button>
                </div>
                <div className="space-y-3">
                  {savedSearches.map((search) => (
                    <div
                      key={search.id}
                      className="p-3 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium flex-1">{search.name}</h4>
                        {search.newResults > 0 && (
                          <Badge variant="default" className="ml-2">
                            {search.newResults} new
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {search.results} properties
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-browse-properties">
                    <Home className="h-4 w-4 mr-2" />
                    Browse Properties
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-view-favorites">
                    <Heart className="h-4 w-4 mr-2" />
                    View Favorites
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-create-alert">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
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
