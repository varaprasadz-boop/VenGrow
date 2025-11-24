import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function AwardsPage() {
  const awards = [
    {
      id: "1",
      title: "Best PropTech Startup 2025",
      organization: "Indian Real Estate Awards",
      year: "2025",
    },
    {
      id: "2",
      title: "Innovation in Technology",
      organization: "Mumbai Tech Awards",
      year: "2024",
    },
    {
      id: "3",
      title: "Customer Choice Award",
      organization: "Property Buyers Association",
      year: "2024",
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
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Awards & Recognition
            </h1>
            <p className="text-xl text-muted-foreground">
              Celebrating excellence in real estate innovation
            </p>
          </div>
        </div>

        {/* Awards */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {awards.map((award) => (
                <Card key={award.id} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-lg bg-primary/10 flex-shrink-0">
                      <Trophy className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-2xl mb-2">
                        {award.title}
                      </h3>
                      <p className="text-muted-foreground mb-1">
                        {award.organization}
                      </p>
                      <p className="text-sm text-muted-foreground">{award.year}</p>
                    </div>
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
