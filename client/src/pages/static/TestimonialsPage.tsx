import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: "1",
      name: "Rahul Sharma",
      role: "Home Buyer",
      location: "Mumbai",
      rating: 5,
      comment: "VenGrow made my home buying journey incredibly smooth. The platform is user-friendly and the sellers are verified which gave me confidence. Found my dream apartment within 2 weeks!",
    },
    {
      id: "2",
      name: "Priya Patel",
      role: "Property Seller",
      location: "Bangalore",
      rating: 5,
      comment: "As a real estate broker, I've tried many platforms. VenGrow stands out with its professional approach and quality leads. Sold 5 properties in just 2 months!",
    },
    {
      id: "3",
      name: "Amit Kumar",
      role: "First-time Buyer",
      location: "Delhi",
      rating: 5,
      comment: "Being a first-time buyer, I was nervous about the process. VenGrow's support team guided me every step of the way. Highly recommended!",
    },
    {
      id: "4",
      name: "Sneha Reddy",
      role: "Real Estate Investor",
      location: "Hyderabad",
      rating: 5,
      comment: "The analytics and market insights on VenGrow helped me make informed investment decisions. The ROI calculator is particularly useful!",
    },
    {
      id: "5",
      name: "Vikram Singh",
      role: "Builder",
      location: "Pune",
      rating: 5,
      comment: "Excellent platform for listing our projects. The premium package features like featured listings really helped us reach the right audience quickly.",
    },
    {
      id: "6",
      name: "Neha Gupta",
      role: "Home Buyer",
      location: "Chennai",
      rating: 5,
      comment: "The virtual tour feature saved me so much time. I could shortlist properties from the comfort of my home before visiting in person. Great experience!",
    },
  ];

  const stats = [
    { value: "50,000+", label: "Happy Customers" },
    { value: "10,000+", label: "Properties Sold" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
              What Our Customers Say
            </h1>
            <p className="text-lg text-muted-foreground">
              Real stories from real people who found their dream properties
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold font-serif text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6 relative">
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {testimonial.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground italic">
                    "{testimonial.comment}"
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied customers who found their perfect home
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/register">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover-elevate active-elevate-2">
                  Get Started
                </button>
              </a>
              <a href="/search">
                <button className="px-8 py-3 border rounded-lg font-medium hover-elevate active-elevate-2">
                  Browse Properties
                </button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
