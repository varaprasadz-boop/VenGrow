import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export interface ReviewWithDetails {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string | Date;
  property?: { title: string };
  user?: { name: string };
}

interface ReviewsBlockProps {
  reviews: ReviewWithDetails[];
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Optional class for the container */
  className?: string;
  /** Show Helpful/Reply buttons on each review */
  showActions?: boolean;
}

export function ReviewsBlock({
  reviews,
  title = "Reviews & Ratings",
  subtitle,
  emptyTitle = "No Reviews Yet",
  emptyDescription = "Reviews will appear here once available.",
  className = "",
  showActions = true,
}: ReviewsBlockProps) {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  if (totalReviews === 0) {
    return (
      <div className={className}>
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h2 className="font-serif font-bold text-2xl sm:text-3xl mb-1">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <Card className="p-6 sm:p-8 text-center">
          <Star className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold text-lg sm:text-xl mb-2">{emptyTitle}</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            {emptyDescription}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="font-serif font-bold text-2xl sm:text-3xl mb-1">
              {title}
            </h2>
            )}
          {subtitle && (
            <p className="text-muted-foreground text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <Card className="p-6 sm:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
          <div className="text-center">
            <p className="text-5xl sm:text-6xl font-bold font-serif text-primary mb-2">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex gap-1 mb-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
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
          <div className="flex-1 w-full min-w-0">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div
                  key={rating}
                  className="flex items-center gap-2 sm:gap-3 mb-2"
                >
                  <span className="text-sm w-6 sm:w-8">{rating}★</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-0">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 sm:w-12">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="space-y-4 sm:space-y-6">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="p-4 sm:p-6"
            data-testid={`card-review-${review.id}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 sm:shrink-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarFallback className="text-xs sm:text-sm">
                    {(review.user?.name || "AN").substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="sm:hidden flex-1 min-w-0">
                  <h3 className="font-semibold truncate" data-testid={`text-reviewer-${review.id}`}>
                    {review.user?.name || "Anonymous"}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {review.property?.title || "Property"}
                  </p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="hidden sm:block mb-2">
                  <h3 className="font-semibold" data-testid={`text-reviewer-${review.id}`}>
                    {review.user?.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {review.property?.title || "Property"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
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
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {format(new Date(review.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                {review.comment && (
                  <p
                    className="text-sm text-muted-foreground mb-3 sm:mb-4"
                    data-testid={`text-comment-${review.id}`}
                  >
                    {review.comment}
                  </p>
                )}
                {showActions && (
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-helpful-${review.id}`}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1 sm:mr-2" />
                      Helpful
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-reply-${review.id}`}
                    >
                      <MessageSquare className="h-4 w-4 mr-1 sm:mr-2" />
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
