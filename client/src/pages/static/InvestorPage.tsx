import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Building, BarChart } from "lucide-react";

export default function InvestorPage() {
  const stats = [
    { icon: Users, label: "Active Users", value: "50,000+" },
    { icon: Building, label: "Properties Listed", value: "25,000+" },
    { icon: TrendingUp, label: "YoY Growth", value: "200%" },
    { icon: BarChart, label: "Monthly Revenue", value: "₹1.5 Cr" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
              <TrendingUp className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Investor Relations
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Revolutionizing Indian real estate through technology
            </p>
            <Button size="lg" data-testid="button-invest">
              Investment Opportunities
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Our Growth Story
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                Join Our Journey
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Partner with us to transform the Indian real estate market
              </p>
              <Button size="lg">Contact Investor Relations</Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
