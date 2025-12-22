
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle } from "lucide-react";

export default function PropertyFeedbackPage() {
  const feedback = [
    {
      id: "1",
      buyer: "Rajesh Kumar",
      rating: 5,
      comment: "Excellent property, well-maintained and exactly as described.",
      date: "Nov 20, 2025",
      property: "Luxury 3BHK Apartment",
    },
    {
      id: "2",
      buyer: "Priya Sharma",
      rating: 4,
      comment: "Good property, but pricing could be more competitive.",
      date: "Nov 15, 2025",
      property: "2BHK Flat",
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Buyer Feedback
            </h1>
            <p className="text-muted-foreground">
              Reviews and feedback from property visitors
            </p>
          </div>

          <div className="space-y-4">
            {feedback.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{item.buyer.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{item.buyer}</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < item.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.comment}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{item.property}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
