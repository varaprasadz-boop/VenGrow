
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function PropertyRatingPage() {
  const ratings = {
    overall: 4.7,
    totalReviews: 28,
    breakdown: [
      { stars: 5, count: 18, percentage: 64 },
      { stars: 4, count: 8, percentage: 29 },
      { stars: 3, count: 2, percentage: 7 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ],
    categories: [
      { name: "Location", rating: 4.9 },
      { name: "Value for Money", rating: 4.5 },
      { name: "Amenities", rating: 4.8 },
      { name: "Maintenance", rating: 4.6 },
    ],
  };

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Star className="h-8 w-8 text-primary" />
              Property Rating
            </h1>
            <p className="text-muted-foreground">
              Buyer feedback and ratings
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Overall Rating</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <p className="text-6xl font-bold text-primary">{ratings.overall}</p>
                <Star className="h-12 w-12 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {ratings.totalReviews} reviews
              </p>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Rating Breakdown</h3>
            <div className="space-y-3">
              {ratings.breakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{item.stars}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Category Ratings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratings.categories.map((category, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="outline">{category.rating}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(category.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
}
