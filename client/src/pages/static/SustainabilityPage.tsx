import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Leaf, Sun, Droplet, Recycle } from "lucide-react";

export default function SustainabilityPage() {
  const initiatives = [
    {
      icon: Leaf,
      title: "Green Buildings",
      description:
        "Promoting eco-friendly and sustainable property developments",
    },
    {
      icon: Sun,
      title: "Solar Energy",
      description:
        "Encouraging properties with renewable energy installations",
    },
    {
      icon: Droplet,
      title: "Water Conservation",
      description:
        "Supporting rainwater harvesting and water-efficient buildings",
    },
    {
      icon: Recycle,
      title: "Waste Management",
      description: "Promoting properties with effective waste segregation systems",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Our Sustainability Commitment
            </h1>
            <p className="text-xl text-muted-foreground">
              Building a greener future for real estate
            </p>
          </div>
        </div>

        {/* Initiatives */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Our Green Initiatives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {initiatives.map((initiative, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 flex-shrink-0">
                      <initiative.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">
                        {initiative.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {initiative.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { value: "45%", label: "Green Certified Properties" },
                { value: "30%", label: "Energy Savings Average" },
                { value: "100+", label: "Sustainable Projects" },
              ].map((stat, index) => (
                <Card key={index} className="p-8 text-center">
                  <p className="text-5xl font-bold font-serif text-green-600 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
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
