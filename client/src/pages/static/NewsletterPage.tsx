import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterPage() {
  const benefits = [
    "Weekly property market insights",
    "Exclusive property listings before they go public",
    "Real estate investment tips",
    "Market trends and analysis",
    "Legal and tax updates",
    "Success stories from buyers and sellers",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Subscribe to Our Newsletter
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get the latest property news and exclusive listings delivered to
              your inbox
            </p>

            {/* Subscription Form */}
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1"
                  data-testid="input-email"
                />
                <Button size="lg" data-testid="button-subscribe">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              What You'll Get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Recent Issues
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "November 2025 Market Report",
                  date: "Nov 15, 2025",
                  description: "Mumbai real estate sees 12% YoY growth",
                },
                {
                  title: "Investment Opportunities in 2025",
                  date: "Nov 1, 2025",
                  description: "Top 5 emerging neighborhoods to watch",
                },
              ].map((issue, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{issue.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {issue.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{issue.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
