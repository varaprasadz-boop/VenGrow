import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";

export default function ReviewsPage() {
  const [reviews] = useState([
    {
      id: "1",
      buyer: "Rahul Sharma",
      property: "Luxury 3BHK Apartment",
      rating: 5,
      comment: "Excellent property! The seller was very professional and helpful throughout the process.",
      date: "Nov 20, 2025",
      helpful: 12,
    },
    {
      id: "2",
      buyer: "Priya Patel",
      property: "Commercial Office Space",
      rating: 4,
      comment: "Good property but the documentation took longer than expected. Otherwise satisfied with the purchase.",
      date: "Nov 18, 2025",
      helpful: 8,
    },
    {
      id: "3",
      buyer: "Amit Kumar",
      property: "2BHK Flat in Koramangala",
      rating: 5,
      comment: "Great experience! Highly recommend this seller. Very transparent and responsive.",
      date: "Nov 15, 2025",
      helpful: 15,
    },
  ]);

  const averageRating = 4.7;
  const totalReviews = reviews.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

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

          {/* Summary */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="text-center">
                <p className="text-6xl font-bold font-serif text-primary mb-2">
                  {averageRating}
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
                  Based on {totalReviews} reviews
                </p>
              </div>

              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r) => r.rating === rating).length;
                  const percentage = (count / totalReviews) * 100;
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

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {review.buyer.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{review.buyer}</h3>
                        <p className="text-sm text-muted-foreground">
                          {review.property}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
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

                    <p className="text-muted-foreground mb-4">
                      {review.comment}
                    </p>

                    <div className="flex gap-3">
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
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
