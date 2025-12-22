import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { Review } from "@shared/schema";

interface ReviewWithDetails extends Review {
  property?: { title: string };
  user?: { name: string };
}

export default function ReviewsPage() {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/me/reviews"],
    enabled: !!user,
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

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
        <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Reviews & Ratings
            </h1>
            <p className="text-muted-foreground">
              Feedback from your buyers
            </p>
          </div>

          {totalReviews === 0 ? (
            <Card className="p-8 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-semibold text-xl mb-2">No Reviews Yet</h2>
              <p className="text-muted-foreground">
                Reviews from buyers will appear here once you complete transactions.
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
                      Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex-1 w-full">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter((r) => r.rating === rating).length;
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3 mb-2">
                          <span className="text-sm w-8">{rating}★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-6" data-testid={`card-review-${review.id}`}>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {(review.user?.name || "AN").substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div>
                            <h3 className="font-semibold" data-testid={`text-reviewer-${review.id}`}>
                              {review.user?.name || "Anonymous"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {review.property?.title || "Property"}
                            </p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(review.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>

                        <div className="flex gap-1 mb-3">
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

                        {review.comment && (
                          <p className="text-muted-foreground mb-4" data-testid={`text-comment-${review.id}`}>
                            {review.comment}
                          </p>
                        )}

                        <div className="flex gap-3 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-helpful-${review.id}`}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Helpful
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-reply-${review.id}`}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    );
}
