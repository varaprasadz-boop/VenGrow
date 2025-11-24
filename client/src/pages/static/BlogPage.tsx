import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      id: "1",
      title: "Top 10 Tips for First-Time Home Buyers in India",
      excerpt: "Navigate the Indian real estate market with confidence. Learn essential tips for making your first property purchase.",
      category: "Buying Guide",
      author: "Priya Sharma",
      date: "Nov 20, 2025",
      readTime: "5 min read",
    },
    {
      id: "2",
      title: "Understanding RERA: A Complete Guide for Property Buyers",
      excerpt: "Everything you need to know about the Real Estate Regulatory Authority and how it protects your interests.",
      category: "Legal",
      author: "Amit Kumar",
      date: "Nov 18, 2025",
      readTime: "8 min read",
    },
    {
      id: "3",
      title: "2025 Real Estate Market Trends in Metro Cities",
      excerpt: "Analyze the latest trends and predictions for property prices in Mumbai, Delhi, Bangalore, and other major cities.",
      category: "Market Analysis",
      author: "Rahul Patel",
      date: "Nov 15, 2025",
      readTime: "6 min read",
    },
    {
      id: "4",
      title: "How to Maximize ROI on Rental Properties",
      excerpt: "Strategic insights for property investors looking to optimize returns on their rental investments.",
      category: "Investment",
      author: "Sneha Reddy",
      date: "Nov 12, 2025",
      readTime: "7 min read",
    },
    {
      id: "5",
      title: "Home Loan Guide: Types, Eligibility & Documentation",
      excerpt: "Complete guide to securing a home loan in India with tips on interest rates and documentation.",
      category: "Finance",
      author: "Vikram Singh",
      date: "Nov 10, 2025",
      readTime: "10 min read",
    },
    {
      id: "6",
      title: "Smart Home Technology for Modern Indian Homes",
      excerpt: "Explore the latest smart home innovations and how they're transforming residential living in India.",
      category: "Technology",
      author: "Neha Gupta",
      date: "Nov 8, 2025",
      readTime: "5 min read",
    },
  ];

  const categories = ["All", "Buying Guide", "Legal", "Market Analysis", "Investment", "Finance", "Technology"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
              Real Estate Insights & Tips
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert advice, market trends, and guides to help you make informed property decisions
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover-elevate">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Featured Image</span>
                </div>
                <div className="p-6">
                  <Badge className="mb-3">{post.category}</Badge>
                  <h3 className="font-serif font-bold text-xl mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" className="w-full group" data-testid={`button-read-${post.id}`}>
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" size="lg" data-testid="button-load-more">
              Load More Articles
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
