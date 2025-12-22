import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SavedSearch } from "@shared/schema";
import {
  Search,
  Bell,
  BellOff,
  Trash2,
  MapPin,
  Building2,
  IndianRupee,
  ExternalLink,
} from "lucide-react";

export default function SavedSearchesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: searches = [], isLoading } = useQuery<SavedSearch[]>({
    queryKey: ["/api/me/saved-searches"],
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/saved-searches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/saved-searches"] });
      toast({ title: "Search deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete search", variant: "destructive" });
    },
  });

  const toggleAlertsMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      await apiRequest("PATCH", `/api/saved-searches/${id}`, { alertEnabled: enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/saved-searches"] });
      toast({ title: "Alert preferences updated" });
    },
    onError: () => {
      toast({ title: "Failed to update alerts", variant: "destructive" });
    },
  });

  const formatFilters = (filters: Record<string, unknown>) => {
    const parts: { icon: typeof MapPin; label: string }[] = [];
    
    if (filters.city) {
      parts.push({ icon: MapPin, label: filters.city as string });
    }
    if (filters.propertyType) {
      parts.push({ icon: Building2, label: filters.propertyType as string });
    }
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice as number;
      const max = filters.maxPrice as number;
      const formatPrice = (p: number) => {
        if (p >= 10000000) return `${(p / 10000000).toFixed(1)}Cr`;
        if (p >= 100000) return `${(p / 100000).toFixed(0)}L`;
        return `${p}`;
      };
      const label = min && max 
        ? `₹${formatPrice(min)} - ₹${formatPrice(max)}`
        : min ? `₹${formatPrice(min)}+` : `Up to ₹${formatPrice(max)}`;
      parts.push({ icon: IndianRupee, label });
    }
    if (filters.bedrooms) {
      parts.push({ icon: Building2, label: `${filters.bedrooms} BHK` });
    }
    
    return parts;
  };

  const buildSearchUrl = (filters: Record<string, unknown>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    return `/listings?${params.toString()}`;
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/buyer/dashboard" },
    { label: "Saved Searches" },
  ];

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Saved Searches</h1>
              <p className="text-muted-foreground">
                {searches.length === 0 
                  ? "No saved searches yet" 
                  : `${searches.length} saved ${searches.length === 1 ? 'search' : 'searches'}`}
              </p>
            </div>
          </div>
        </div>

        {searches.length > 0 ? (
          <div className="space-y-4">
            {searches.map((search) => {
              const filterParts = formatFilters(search.filters);
              return (
                <Card key={search.id} className="p-6" data-testid={`card-saved-search-${search.id}`}>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg" data-testid={`text-search-name-${search.id}`}>
                              {search.name}
                            </h3>
                            {search.alertEnabled && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Bell className="h-3 w-3 mr-1" />
                                Alerts On
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(search.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        {filterParts.map((part, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <part.icon className="h-4 w-4 text-muted-foreground" />
                            <span>{part.label}</span>
                          </div>
                        ))}
                        {filterParts.length === 0 && (
                          <span className="text-muted-foreground">All properties</span>
                        )}
                      </div>

                      {search.alertEnabled && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                          <Bell className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-900 dark:text-blue-400">
                            You'll receive email alerts for new matching properties
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Link href={buildSearchUrl(search.filters)}>
                        <Button variant="default" className="flex-1" data-testid={`button-view-results-${search.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => toggleAlertsMutation.mutate({ 
                          id: search.id, 
                          enabled: !search.alertEnabled 
                        })}
                        disabled={toggleAlertsMutation.isPending}
                        data-testid={`button-toggle-alerts-${search.id}`}
                      >
                        {search.alertEnabled ? (
                          <>
                            <BellOff className="h-4 w-4 mr-2" />
                            Disable Alerts
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 mr-2" />
                            Enable Alerts
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(search.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-search-${search.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">No saved searches yet</h3>
                <p className="text-muted-foreground mb-4">
                  Save your property searches to get notified when new listings match your criteria
                </p>
                <Link href="/listings">
                  <Button data-testid="button-browse-properties">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
