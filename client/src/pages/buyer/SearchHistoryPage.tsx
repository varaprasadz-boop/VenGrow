import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface SearchHistoryItem {
  id: string;
  userId: string;
  filters: Record<string, unknown>;
  createdAt: string;
}

function filtersToQueryString(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  if (filters.category && typeof filters.category === "string") params.set("category", filters.category);
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.transactionType && typeof filters.transactionType === "string") params.set("transactionTypes", filters.transactionType);
  if (filters.city && typeof filters.city === "string") params.set("city", filters.city);
  if (filters.propertyType && typeof filters.propertyType === "string") params.set("propertyType", filters.propertyType);
  if (filters.bhk != null) params.set("bhk", String(filters.bhk));
  return params.toString();
}

function filtersToLabel(filters: Record<string, unknown>): string {
  const parts: string[] = [];
  if (filters.city && typeof filters.city === "string") parts.push(filters.city);
  if (filters.propertyType && typeof filters.propertyType === "string") parts.push(filters.propertyType);
  if (filters.transactionType && typeof filters.transactionType === "string") parts.push(filters.transactionType);
  if (filters.minPrice != null || filters.maxPrice != null) {
    const min = filters.minPrice != null ? Number(filters.minPrice) : null;
    const max = filters.maxPrice != null ? Number(filters.maxPrice) : null;
    if (min != null && max != null) parts.push(`₹${(min / 100000).toFixed(0)}L - ₹${(max / 100000).toFixed(0)}L`);
    else if (min != null) parts.push(`₹${(min / 100000).toFixed(0)}L+`);
    else if (max != null) parts.push(`Up to ₹${(max / 100000).toFixed(0)}L`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Search";
}

export default function SearchHistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: history = [], isLoading } = useQuery<SearchHistoryItem[]>({
    queryKey: ["/api/me/search-history"],
    enabled: !!user,
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/me/search-history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/search-history"] });
      toast({ title: "Search history cleared" });
    },
    onError: () => {
      toast({ title: "Failed to clear history", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-2">
                <Search className="h-8 w-8" />
                Search History
              </h1>
              <p className="text-muted-foreground">
                Your recent property searches
              </p>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearMutation.mutate()}
                disabled={clearMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => {
                const query = filtersToQueryString(item.filters);
                const path = query ? `/properties?${query}` : "/properties";
                return (
                  <Link key={item.id} href={path}>
                    <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {filtersToLabel(item.filters)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Search again
                        </Button>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No search history</p>
              <p className="text-sm mt-1">Searches you run while logged in will appear here.</p>
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
