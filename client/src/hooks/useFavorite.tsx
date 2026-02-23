import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

export function useFavorite(propertyId: string | undefined) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: favorites = [] } = useQuery<Property[]>({
    queryKey: ["/api/me/favorites"],
    enabled: !!user && !!propertyId,
  });

  const isFavorited = !!propertyId && favorites.some((p: Property) => p.id === propertyId);

  const mutation = useMutation({
    mutationFn: async (adding: boolean) => {
      if (!propertyId) throw new Error("Property not found");
      if (!user) throw new Error("Please log in to save favorites");
      if (adding) {
        await apiRequest("POST", "/api/me/favorites", { propertyId });
      } else {
        await apiRequest("DELETE", "/api/me/favorites", { propertyId });
      }
    },
    onSuccess: (_, adding) => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/dashboard"] });
      toast({
        title: adding ? "Added to favorites" : "Removed from favorites",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update favorites",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggle = () => {
    if (!propertyId) return;
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save favorites.",
        variant: "destructive",
        action: (
          <ToastAction
            onClick={() => setLocation(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
            altText="Go to login"
          >
            Login
          </ToastAction>
        ),
      });
      return;
    }
    mutation.mutate(!isFavorited);
  };

  return { isFavorited, toggle, isPending: mutation.isPending };
}
