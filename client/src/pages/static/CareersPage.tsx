import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Clock, Users, TrendingUp, Heart } from "lucide-react";

export default function CareersPage() {
  const positions = [
    {
      id: "1",
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "5+ years",
    },
    {
      id: "2",
      title: "Product Manager",
      department: "Product",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-5 years",
    },
    {
      id: "3",
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "2-4 years",
    },
    {
      id: "4",
      title: "Customer Success Manager",
      department: "Support",
      location: "Delhi, India",
      type: "Full-time",
      experience: "2-3 years",
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear growth paths and learning opportunities",
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with talented and passionate people",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work-life balance with flexible working hours",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Help us transform the real estate industry in India
            </p>
            <Button size="lg" data-testid="button-view-openings">
              View Open Positions
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Why Join VenGrow?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-8">
              Open Positions
            </h2>
            <div className="space-y-4">
              {positions.map((position) => (
                <Card key={position.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-2">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{position.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{position.location}</span>
                        </div>
                        <Badge variant="outline">{position.type}</Badge>
                        <span>{position.experience}</span>
                      </div>
                    </div>
                    <Button data-testid={`button-apply-${position.id}`}>
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Don't See a Fit?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button variant="outline" size="lg" data-testid="button-general-application">
              Submit General Application
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
