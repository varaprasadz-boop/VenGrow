
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";

export default function CustomerReviewsPage() {
  const stats = {
    average: 4.5,
    total: 156,
    breakdown: [
      { stars: 5, count: 98, percentage: 63 },
      { stars: 4, count: 35, percentage: 22 },
      { stars: 3, count: 15, percentage: 10 },
      { stars: 2, count: 5, percentage: 3 },
      { stars: 1, count: 3, percentage: 2 },
    ],
  };

  const reviews = [
    {
      id: "1",
      author: "Rahul Sharma",
      rating: 5,
      date: "Nov 20, 2025",
      property: "Luxury 3BHK Apartment",
      comment:
        "Excellent service! The seller was very professional and responsive. Property was exactly as described.",
      helpful: 12,
    },
    {
      id: "2",
      author: "Priya Patel",
      rating: 4,
      date: "Nov 15, 2025",
      property: "Commercial Office Space",
      comment:
        "Good experience overall. Seller was helpful during the viewing process.",
      helpful: 8,
    },
    {
      id: "3",
      author: "Amit Kumar",
      rating: 5,
      date: "Nov 10, 2025",
      property: "2BHK Flat",
      comment:
        "Very satisfied with the purchase. Smooth transaction and great communication.",
      helpful: 15,
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Customer Reviews
            </h1>
            <p className="text-muted-foreground">
              See what buyers are saying about you
            </p>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="mb-4">
                <p className="text-6xl font-bold font-serif text-primary">
                  {stats.average}
                </p>
                <div className="flex justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= stats.average
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">
                Based on {stats.total} reviews
              </p>
            </Card>

            <Card className="lg:col-span-2 p-6">
              <h3 className="font-semibold mb-6">Rating Breakdown</h3>
              <div className="space-y-3">
                {stats.breakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{item.stars}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{review.author}</h4>
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
                    <p className="text-sm text-muted-foreground mb-1">
                      {review.property}
                    </p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{review.comment}</p>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-helpful-${review.id}`}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful ({review.helpful})
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
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
