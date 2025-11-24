import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Target, TrendingUp } from "lucide-react";

export default function CorporatePage() {
  const services = [
    {
      icon: Building,
      title: "Corporate Housing",
      description: "Furnished accommodations for employees and executives",
    },
    {
      icon: Users,
      title: "Bulk Property Deals",
      description: "Special rates for corporate property purchases",
    },
    {
      icon: Target,
      title: "Dedicated Account Manager",
      description: "Personal support for all your real estate needs",
    },
    {
      icon: TrendingUp,
      title: "Investment Advisory",
      description: "Strategic real estate investment consulting",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
              <Building className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Corporate Solutions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Tailored real estate services for businesses and enterprises
            </p>
            <Button size="lg" data-testid="button-contact">
              Contact Corporate Team
            </Button>
          </div>
        </div>

        {/* Services */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Our Corporate Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12 text-center">
              <h2 className="font-serif font-bold text-3xl mb-4">
                Partner With Us
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Let's discuss how we can support your corporate real estate needs
              </p>
              <Button size="lg">Schedule a Consultation</Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
