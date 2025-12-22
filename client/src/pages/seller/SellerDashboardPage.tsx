import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
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
import { ApprovalStatusTracker } from "@/components/ApprovalStatusTracker";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import type { Property, Inquiry, SellerProfile, SellerSubscription, Package } from "@shared/schema";

interface InquiryWithBuyer extends Inquiry {
  buyer?: {
    firstName?: string;
    lastName?: string;
  };
  property?: {
    title: string;
  };
}

export default function SellerDashboardPage() {
  const { user } = useAuth();

  const { data: sellerProfile, isLoading: profileLoading } = useQuery<SellerProfile>({
    queryKey: ["/api/me/seller-profile"],
    enabled: !!user,
  });

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/me/properties"],
    enabled: !!user,
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery<InquiryWithBuyer[]>({
    queryKey: ["/api/me/seller-inquiries"],
    enabled: !!user,
  });

  const { data: subscription, isLoading: subscriptionLoading } = useQuery<SellerSubscription & { package?: Package }>({
    queryKey: ["/api/me/subscription"],
    enabled: !!user,
  });

  const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalFavorites = properties.reduce((sum, p) => sum + (p.favoriteCount || 0), 0);
  const activeListings = properties.filter(p => p.status === "active").length;
  const pendingInquiries = inquiries.filter(i => i.status === "pending").length;

  const stats = [
    {
      label: "Active Listings",
      value: activeListings.toString(),
      icon: Building,
      change: subscription ? `${activeListings} of ${subscription.package?.listingLimit || 5} used` : "No subscription",
      packageInfo: subscription?.package?.name || "Basic",
      link: "/seller/listings",
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      change: "All time",
      trend: "up",
      link: "/seller/analytics",
    },
    {
      label: "Favorites",
      value: totalFavorites.toString(),
      icon: Heart,
      change: "Properties saved",
      trend: "up",
      link: "/seller/analytics",
    },
    {
      label: "Inquiries",
      value: inquiries.length.toString(),
      icon: MessageSquare,
      change: `${pendingInquiries} pending`,
      trend: "neutral",
      link: "/seller/inquiries",
    },
  ];

  const recentInquiries = inquiries.slice(0, 3);
  const recentListings = properties.slice(0, 2);

  const formatPropertyForCard = (property: Property) => ({
    id: property.id,
    title: property.title,
    price: property.price,
    location: `${property.locality || ''}, ${property.city}`.replace(/^, /, ''),
    imageUrl: (property as any).images?.[0] || '/placeholder-property.jpg',
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area,
    propertyType: property.propertyType,
    isFeatured: property.isFeatured || false,
    isVerified: property.isVerified || false,
    sellerType: (sellerProfile?.sellerType || "individual") as "Individual" | "Broker" | "Builder",
    transactionType: (property.transactionType === "sale" ? "Sale" : "Rent") as "Sale" | "Rent",
  });

  const getBuyerName = (inquiry: InquiryWithBuyer) => {
    if (inquiry.buyer?.firstName) {
      return `${inquiry.buyer.firstName} ${inquiry.buyer.lastName || ''}`.trim();
    }
    return "Buyer";
  };

  const renewalDays = subscription?.endDate 
    ? differenceInDays(new Date(subscription.endDate), new Date())
    : 0;

  const isLoading = profileLoading || propertiesLoading || inquiriesLoading || subscriptionLoading;

  return (
    <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Breadcrumbs
            homeHref="/seller/dashboard"
            items={[]}
            className="mb-4"
          />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-6">
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl mb-1">
                Welcome back{sellerProfile?.companyName ? `, ${sellerProfile.companyName}` : user?.firstName ? `, ${user.firstName}` : ''}!
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Here's an overview of your property listings
              </p>
      
            <Link href="/seller/listings/create/step1">
              <Button size="default" className="sm:!min-h-10" data-testid="button-create-listing-dashboard">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Create New Listing
              </Button>
            </Link>
    

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-3 sm:p-6">
                  <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg mb-2 sm:mb-3" />
                  <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
                </Card>
              ))
            ) : (
              stats.map((stat, index) => (
                <Link key={index} href={stat.link}>
                  <Card className="p-3 sm:p-6 hover-elevate active-elevate-2 cursor-pointer">
                    <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                        <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                
              
                    <div>
                      <p className="text-xl sm:text-3xl font-bold font-serif mb-0.5 sm:mb-1">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{stat.label}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                        {stat.packageInfo || stat.change}
                      </p>
              
                  </Card>
                </Link>
              ))
            )}
    

          {subscription && (
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="default">{subscription.package?.name || "Package"}</Badge>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {renewalDays > 0 ? `Renews in ${renewalDays} days` : "Expired"}
                    </Badge>
            
                  <h3 className="font-semibold text-lg mb-1">
                    ₹{(subscription.package?.price || 0).toLocaleString()}/month • {subscription.package?.listingLimit || 5} Listings
                    {subscription.package?.features?.includes("featured_badge") && " • Featured Badge"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeListings} of {subscription.package?.listingLimit || 5} listings used
                    {subscription.package?.listingLimit && activeListings < subscription.package.listingLimit && " • Upgrade for unlimited listings"}
                  </p>
          
                <div className="flex flex-wrap gap-3">
                  <Link href="/seller/subscription">
                    <Button variant="outline" data-testid="button-manage-package">
                      Manage Package
                    </Button>
                  </Link>
                  <Link href="/seller/packages">
                    <Button data-testid="button-upgrade">
                      Upgrade Plan
                    </Button>
                  </Link>
          
        
            </Card>
          )}

          {!subscription && !subscriptionLoading && (
            <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-yellow-500/5 to-orange-500/10 border-yellow-500/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">No Active Subscription</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a package to start listing your properties
                  </p>
          
                <Link href="/seller/packages">
                  <Button data-testid="button-choose-package">
                    Choose Package
                  </Button>
                </Link>
        
            </Card>
          )}

          <ApprovalStatusTracker 
            properties={properties} 
            isLoading={propertiesLoading} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-8">
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                  <h2 className="font-semibold text-lg sm:text-xl">Recent Inquiries</h2>
                  <Link href="/seller/inquiries">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-inquiries">
                      View All
                    </Button>
                  </Link>
          
                {inquiriesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-3 w-1/4" />
                
                    ))}
            
                ) : recentInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-start gap-4 p-4 rounded-lg hover-elevate active-elevate-2 border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-medium truncate">
                              {getBuyerName(inquiry)}
                            </h3>
                            {inquiry.status === "pending" && (
                              <Badge variant="default" className="flex-shrink-0">New</Badge>
                            )}
                    
                          <p className="text-sm text-muted-foreground mb-1">
                            {inquiry.property?.title || "Property Inquiry"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                          </p>
                  
                        <Link href={`/seller/inquiries/${inquiry.id}`}>
                          <Button size="sm" variant="outline" data-testid={`button-reply-${inquiry.id}`}>
                            Reply
                          </Button>
                        </Link>
                
                    ))}
            
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No inquiries yet</p>
                    <p className="text-sm mt-1">Inquiries will appear here when buyers contact you</p>
            
                )}
              </Card>

              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                  <h2 className="font-semibold text-lg sm:text-xl">My Listings</h2>
                  <Link href="/seller/listings">
                    <Button variant="ghost" size="sm" data-testid="button-manage-listings">
                      Manage All
                    </Button>
                  </Link>
          
                {propertiesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                
                    ))}
            
                ) : recentListings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentListings.map((property) => (
                      <PropertyCard key={property.id} {...formatPropertyForCard(property)} />
                    ))}
            
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No listings yet</p>
                    <Link href="/seller/listings/create/step1">
                      <Button variant="ghost" className="mt-2">Create Your First Listing</Button>
                    </Link>
                  </Card>
                )}
        
      

            <div className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/seller/listings/create/step1">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-create-new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>
                  </Link>
                  <Link href="/seller/analytics">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-view-analytics">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                  <Link href="/seller/inquiries">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-view-inquiries">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View Inquiries
                    </Button>
                  </Link>
          
              </Card>

              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4">Performance Tips</h3>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Add more photos</p>
                    <p className="text-xs text-muted-foreground">
                      Listings with 10+ photos get 3x more views
                    </p>
            
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Respond quickly</p>
                    <p className="text-xs text-muted-foreground">
                      Fast responses increase conversion by 40%
                    </p>
            
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-1">Update pricing</p>
                    <p className="text-xs text-muted-foreground">
                      Competitive pricing attracts more buyers
                    </p>
            
          
              </Card>
      
    
  
    </main>
  );
}
