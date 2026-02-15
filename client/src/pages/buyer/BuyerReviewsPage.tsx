import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { format } from "date-fns";
import type { Review } from "@shared/schema";

interface ReviewWithDetails extends Review {
  property?: { title: string };
}

export default function BuyerReviewsPage() {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/me/my-reviews"],
    enabled: !!user,
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-16 lg:pb-8">
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
        <BuyerBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">My Reviews</h1>
            <p className="text-muted-foreground">
              All reviews you have submitted
            </p>
          </div>

          {totalReviews === 0 ? (
            <Card className="p-8 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-semibold text-xl mb-2">No Reviews Yet</h2>
              <p className="text-muted-foreground">
                Reviews you leave on properties and sellers will appear here.
              </p>
            </Card>
          ) : (
            <>
              <Card className="p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-center">
                    <p className="text-6xl font-bold font-serif text-primary mb-2">
                      {averageRating.toFixed(1)}
                    </p>
                    <div className="flex gap-1 mb-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= averageRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average rating
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-4xl font-bold text-primary">
                      {totalReviews}
                    </p>
                    <p className="text-muted-foreground">
                      Total review{totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="p-6"
                    data-testid={`card-review-${review.id}`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <p className="font-medium text-muted-foreground">
                            {review.property?.title || "Property"}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p
                          className="text-muted-foreground"
                          data-testid={`text-comment-${review.id}`}
                        >
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <BuyerBottomNav />
    </div>
  );
}
