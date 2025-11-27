import { useQuery } from "@tanstack/react-query";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Building2, Heart, Search, MessageSquare, Eye, Calendar,
  MapPin, BedDouble, Bath, Maximize, Star, ArrowRight
} from "lucide-react";

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  href 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  href?: string;
}) {
  const content = (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function PropertyCard({ property }: { property: any }) {
  return (
    <Card className="overflow-hidden hover-elevate">
      <div className="h-40 bg-muted flex items-center justify-center">
        <Building2 className="h-12 w-12 text-muted-foreground" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{property.type}</Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="font-semibold truncate">{property.title}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="h-3 w-3" /> {property.location}
        </p>
        <p className="text-lg font-bold text-primary mt-2">₹{property.price}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3 w-3" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3 w-3" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-3 w-3" /> {property.area} sqft
          </span>
        </div>
        <Button className="w-full mt-4" variant="outline" size="sm" asChild>
          <Link href={`/property/${property.id}`} data-testid={`button-view-property-${property.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function BuyerDashboardPage() {
  const { data: stats } = useQuery<{
    savedProperties: number;
    activeSearches: number;
    scheduledVisits: number;
    unreadMessages: number;
    recentlyViewed: any[];
    recommendations: any[];
    savedSearches: any[];
  }>({
    queryKey: ["/api/buyer/stats"],
  });

  const sampleProperties = [
    { id: 1, title: "3BHK Premium Apartment", location: "Andheri West, Mumbai", price: "1.85 Cr", type: "Apartment", bedrooms: 3, bathrooms: 2, area: 1450 },
    { id: 2, title: "Luxury Villa with Pool", location: "Juhu, Mumbai", price: "5.5 Cr", type: "Villa", bedrooms: 4, bathrooms: 3, area: 3200 },
    { id: 3, title: "2BHK Sea View Flat", location: "Worli, Mumbai", price: "2.1 Cr", type: "Apartment", bedrooms: 2, bathrooms: 2, area: 1100 },
    { id: 4, title: "Independent House", location: "Powai, Mumbai", price: "3.2 Cr", type: "House", bedrooms: 3, bathrooms: 3, area: 2000 },
  ];

  return (
    <BuyerLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-muted-foreground">Find your perfect home from thousands of verified properties.</p>
          </div>
          <Button asChild>
            <Link href="/properties" data-testid="button-browse-properties">
              <Search className="h-4 w-4 mr-2" />
              Browse Properties
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Saved Properties" 
            value={stats?.savedProperties ?? 8}
            icon={Heart}
            href="/buyer/favorites"
          />
          <StatCard 
            title="Active Searches" 
            value={stats?.activeSearches ?? 3}
            icon={Search}
            href="/buyer/saved-searches"
          />
          <StatCard 
            title="Scheduled Visits" 
            value={stats?.scheduledVisits ?? 2}
            icon={Calendar}
            href="/buyer/visits"
          />
          <StatCard 
            title="Unread Messages" 
            value={stats?.unreadMessages ?? 5}
            icon={MessageSquare}
            href="/buyer/messages"
          />
        </div>

        {/* Recently Viewed & Quick Search */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Search */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Search</CardTitle>
              <CardDescription>Find your ideal property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/buy" data-testid="button-buy">
                  Buy Property
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/rent" data-testid="button-rent">
                  Rent Property
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/new-projects" data-testid="button-new-projects">
                  New Projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/map-search" data-testid="button-map-search">
                  Map Search
                  <MapPin className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Saved Searches */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Saved Searches</CardTitle>
                <CardDescription>Get notified when new properties match</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/buyer/saved-searches" data-testid="button-view-all-searches">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">3BHK in Mumbai</p>
                    <p className="text-xs text-muted-foreground">Budget: ₹1.5-2.5 Cr • Andheri, Bandra, Juhu</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">12 new</Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/properties?search=1" data-testid="button-view-search-1">View</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Villa in Pune</p>
                    <p className="text-xs text-muted-foreground">Budget: ₹2-4 Cr • Kothrud, Baner</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">5 new</Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/properties?search=2" data-testid="button-view-search-2">View</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Plot in Bangalore</p>
                    <p className="text-xs text-muted-foreground">Budget: ₹50L-1 Cr • Electronic City, Whitefield</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">3 new</Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/properties?search=3" data-testid="button-view-search-3">View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Recommended For You</h2>
              <p className="text-sm text-muted-foreground">Based on your search preferences</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/properties" data-testid="button-view-all-properties">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sampleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Recently Viewed
              </CardTitle>
              <CardDescription>Properties you looked at recently</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/buyer/recently-viewed" data-testid="button-view-history">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">3BHK Premium Apartment</p>
                    <p className="text-xs text-muted-foreground">Andheri West, Mumbai • ₹1.85 Cr</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Viewed 2h ago</span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/property/1" data-testid="button-view-recent-1">View</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Luxury Villa with Pool</p>
                    <p className="text-xs text-muted-foreground">Juhu, Mumbai • ₹5.5 Cr</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Viewed yesterday</span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/property/2" data-testid="button-view-recent-2">View</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BuyerLayout>
  );
}
