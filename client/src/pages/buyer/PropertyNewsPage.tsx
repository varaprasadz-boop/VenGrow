import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, ArrowRight } from "lucide-react";

export default function PropertyNewsPage() {
  const news = [
    {
      id: "1",
      title: "Mumbai Real Estate Prices Expected to Rise 15% in 2026",
      excerpt: "Market analysts predict significant growth in Mumbai's property market driven by infrastructure development and demand.",
      category: "Market Trends",
      date: "Nov 24, 2025",
      readTime: "4 min read",
    },
    {
      id: "2",
      title: "New RERA Guidelines to Benefit Home Buyers",
      excerpt: "The government announces stricter regulations to protect buyer interests and ensure timely project completion.",
      category: "Policy",
      date: "Nov 23, 2025",
      readTime: "5 min read",
    },
    {
      id: "3",
      title: "Bangalore Emerges as Top Choice for Tech Professionals",
      excerpt: "Growing IT sector drives residential demand in Bangalore's emerging localities.",
      category: "City Focus",
      date: "Nov 22, 2025",
      readTime: "6 min read",
    },
    {
      id: "4",
      title: "Home Loan Interest Rates Drop to 8-Year Low",
      excerpt: "Major banks reduce home loan rates, making property purchase more affordable for buyers.",
      category: "Finance",
      date: "Nov 21, 2025",
      readTime: "3 min read",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Real Estate News & Updates
            </h1>
            <p className="text-muted-foreground">
              Stay informed with the latest property market insights
            </p>
          </div>

          {/* Featured News */}
          <Card className="overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Featured Image</span>
              </div>
              <div className="p-8">
                <Badge className="mb-4">Featured</Badge>
                <h2 className="font-serif font-bold text-2xl mb-4">
                  {news[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {news[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{news[0].date}</span>
                  </div>
                  <span>•</span>
                  <span>{news[0].readTime}</span>
                </div>
                <Button>
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {news.slice(1).map((article) => (
              <Card key={article.id} className="overflow-hidden hover-elevate">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Image</span>
                </div>
                <div className="p-6">
                  <Badge className="mb-3">{article.category}</Badge>
                  <h3 className="font-serif font-bold text-xl mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  <Button variant="ghost" className="w-full group">
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
