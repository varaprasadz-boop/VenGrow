import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Quote, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  customerName: string;
  customerRole: string;
  customerImage: string;
  content: string;
  rating: number;
  location: string;
  isActive: boolean;
  sortOrder: number;
}

export default function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    staleTime: 5 * 60 * 1000,
  });

  const activeTestimonials = testimonials.filter(t => t.isActive).slice(0, 3);

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30" data-testid="section-testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!activeTestimonials.length) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30" data-testid="section-testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Quote className="h-5 w-5" />
            <span className="text-sm font-medium">Customer Stories</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hear from thousands of happy customers who found their perfect property with VenGrow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="grid-testimonials">
          {activeTestimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="p-6 h-full flex flex-col"
              data-testid={`card-testimonial-${testimonial.id}`}
            >
              {renderStars(testimonial.rating)}
              
              <blockquote className="text-muted-foreground flex-grow mb-6">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t">
                <Avatar className="h-12 w-12">
                  {testimonial.customerImage && (
                    <AvatarImage src={testimonial.customerImage} alt={testimonial.customerName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {testimonial.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold" data-testid={`text-customer-name-${testimonial.id}`}>
                    {testimonial.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.customerRole}
                    {testimonial.location && ` | ${testimonial.location}`}
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
