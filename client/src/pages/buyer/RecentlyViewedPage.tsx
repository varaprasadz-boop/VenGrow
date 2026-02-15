import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface RecentlyViewedItem {
  id: string;
  title: string;
  location: string;
  price: number;
  viewedAt: string;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString()}`;
}

export default function RecentlyViewedPage() {
  const { user } = useAuth();

  const { data: recentList = [], isLoading } = useQuery<RecentlyViewedItem[]>({
    queryKey: ["/api/me/recently-viewed"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-8 w-8 text-primary" />
              <h1 className="font-serif font-bold text-3xl">
                Recently Viewed
              </h1>
            </div>
            <p className="text-muted-foreground">
              {recentList.length} {recentList.length === 1 ? "property" : "properties"} you&apos;ve recently looked at
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : recentList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentList.map((item) => (
                <Card key={item.id} className="overflow-hidden hover-elevate">
                  <Link href={`/properties/${item.id}`}>
                    <div className="relative">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Image</span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-black/70 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(item.viewedAt), { addSuffix: true })}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif font-bold text-lg mb-2">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{item.location}</span>
                      </div>

                      <p className="text-2xl font-bold font-serif text-primary mb-4">
                        {formatPrice(item.price)}
                      </p>

                      <Button className="w-full" data-testid={`button-view-${item.id}`}>
                        View Again
                      </Button>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No recently viewed properties</p>
              <p className="text-sm mt-1">Properties you view will appear here.</p>
              <Link href="/properties">
                <Button className="mt-4">Browse Properties</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
