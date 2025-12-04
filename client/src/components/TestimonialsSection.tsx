import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment: "Found my dream apartment through VenGrow. The verification process gave me confidence that I was dealing with genuine sellers. Highly recommended!",
    avatarUrl: "",
    propertyType: "Apartment",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    location: "Bangalore",
    rating: 5,
    comment: "As a first-time home buyer, I was nervous about the process. VenGrow made it so easy with their verified listings and responsive support team.",
    avatarUrl: "",
    propertyType: "Villa",
  },
  {
    id: "3",
    name: "Anita Desai",
    location: "Delhi",
    rating: 5,
    comment: "Excellent platform for property search. The filters helped me find exactly what I was looking for within my budget. Very professional service!",
    avatarUrl: "",
    propertyType: "Plot",
  },
];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="grid-testimonials">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="p-6 relative"
              data-testid={`card-testimonial-${testimonial.id}`}
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-4 w-4 text-yellow-500 fill-current" 
                  />
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
                  <AvatarImage src={testimonial.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p 
                    className="font-semibold"
                    data-testid={`text-testimonial-name-${testimonial.id}`}
                  >
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.location} • {testimonial.propertyType}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
