import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import avatarImg1 from "@assets/stock_images/professional_indian__996a8952.jpg";
import avatarImg2 from "@assets/stock_images/professional_indian__e3e9c94e.jpg";
import avatarImg3 from "@assets/stock_images/professional_indian__3a68d1a9.jpg";

const testimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Found my dream apartment through VenGrow. The verification process gave me confidence that I was dealing with genuine sellers. Highly recommended!",
    avatarUrl: avatarImg1,
    propertyType: "Apartment",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    location: "Bangalore",
    rating: 5,
    comment: "As a first-time home buyer, I was nervous about the process. VenGrow made it so easy with their verified listings and responsive support team.",
    avatarUrl: avatarImg2,
    propertyType: "Villa",
  },
  {
    id: "3",
    name: "Anita Desai",
    location: "Delhi",
    rating: 5,
    comment: "Excellent platform for property search. The filters helped me find exactly what I was looking for within my budget. Very professional service!",
    avatarUrl: avatarImg3,
    propertyType: "Plot",
  },
];

// Duplicate for seamless infinite marquee (same pattern as VerifiedBuildersSection)
const testimonialsDoubled = [...testimonials, ...testimonials];

function TestimonialCard({ testimonial, index }: { testimonial: (typeof testimonials)[0]; index: number }) {
  return (
    <Card
      className="p-6 relative flex-shrink-0 w-[min(85vw,380px)] min-w-[320px]"
      data-testid={`card-testimonial-${testimonial.id}-${index}`}
    >
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />

      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
        ))}
      </div>

      <p
        className="text-muted-foreground mb-6 line-clamp-4"
        data-testid={`text-testimonial-comment-${testimonial.id}`}
      >
        "{testimonial.comment}"
      </p>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {testimonial.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold" data-testid={`text-testimonial-name-${testimonial.id}`}>
            {testimonial.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {testimonial.location} • {testimonial.propertyType}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-16" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-sm font-medium">Customer Stories</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real experiences from real customers who found their perfect property
          </p>
        </div>

        <div className="relative overflow-hidden py-2" data-testid="grid-testimonials">
          <div className="flex gap-6 w-max animate-marquee-left">
            {testimonialsDoubled.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
