import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewsBlock, type ReviewWithDetails } from "@/components/ReviewsBlock";

export default function ReviewsPage() {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/me/reviews"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-48 w-full mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReviewsBlock
          reviews={reviews}
          title="Reviews & Ratings"
          subtitle="Feedback from your buyers"
          emptyDescription="Reviews from buyers will appear here once you complete transactions."
        />
      </div>
    </main>
  );
}
