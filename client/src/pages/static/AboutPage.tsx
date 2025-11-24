import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "10,000+", label: "Active Listings" },
    { value: "50,000+", label: "Registered Users" },
    { value: "5,000+", label: "Properties Sold" },
    { value: "1,000+", label: "Verified Sellers" },
  ];

  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "We prioritize transparency, trust, and exceptional service in every interaction.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Leveraging technology to make property transactions seamless and efficient.",
    },
    {
      icon: Award,
      title: "Quality",
      description: "Maintaining high standards through seller verification and listing authenticity.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Empowering buyers and sellers to achieve their real estate goals.",
    },
  ];

  const team = [
    { name: "Rajesh Kumar", role: "Founder & CEO", image: "" },
    { name: "Priya Sharma", role: "Chief Technology Officer", image: "" },
    { name: "Amit Patel", role: "Head of Operations", image: "" },
    { name: "Neha Singh", role: "Head of Customer Success", image: "" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">About Us</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              India's Trusted Real Estate Marketplace
            </h1>
            <p className="text-lg text-muted-foreground">
              PropConnect is revolutionizing the Indian real estate market by connecting property buyers with verified sellers through a transparent, technology-driven platform.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif font-bold text-3xl mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  To democratize real estate transactions in India by providing a trustworthy platform that brings transparency, efficiency, and ease to property buying and selling.
                </p>
                <p className="text-muted-foreground">
                  We believe that everyone deserves access to verified property listings, fair pricing, and a seamless transaction experience.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-6 text-center">
                    <p className="text-3xl font-bold font-serif text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-3xl mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-6 text-center">
                    <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-3xl mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passionate professionals dedicated to transforming Indian real estate
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="h-32 w-32 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Join Us in Transforming Real Estate
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Whether you're buying or selling, PropConnect is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register">
                <button className="bg-background text-foreground hover-elevate active-elevate-2 px-8 py-3 rounded-lg font-semibold">
                  Get Started
                </button>
              </a>
              <a href="/contact">
                <button className="border border-primary-foreground hover-elevate active-elevate-2 px-8 py-3 rounded-lg font-semibold">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
