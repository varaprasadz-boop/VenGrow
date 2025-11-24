import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Camera, DollarSign, Clock, Users } from "lucide-react";

export default function SellFasterGuidePage() {
  const tips = [
    {
      icon: Camera,
      title: "High-Quality Photos",
      description: "Professional photos increase inquiries by 60%. Use natural lighting and showcase all rooms.",
      dos: ["Use wide-angle shots", "Clean and stage rooms", "Highlight unique features"],
      donts: ["Use blurry images", "Include personal items", "Over-edit photos"],
    },
    {
      icon: DollarSign,
      title: "Price It Right",
      description: "Competitive pricing attracts more buyers. Research similar properties in your area.",
      dos: ["Check recent sales", "Consider market conditions", "Be open to negotiation"],
      donts: ["Overprice significantly", "Ignore market feedback", "Change price frequently"],
    },
    {
      icon: Clock,
      title: "Respond Quickly",
      description: "Fast responses convert 3x better. Reply to inquiries within 2 hours.",
      dos: ["Enable notifications", "Set up auto-responses", "Check messages daily"],
      donts: ["Delay responses", "Ignore follow-ups", "Miss scheduled viewings"],
    },
    {
      icon: Users,
      title: "Be Flexible",
      description: "Accommodate viewing schedules to maximize buyer interest.",
      dos: ["Offer multiple time slots", "Weekend viewings", "Virtual tours option"],
      donts: ["Limited availability", "Rush viewings", "Cancel last minute"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="seller" />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              How to Sell Your Property Faster
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert tips to attract buyers and close deals quickly
            </p>
          </div>
        </div>

        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {tips.map((tip, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-lg bg-primary/10 flex-shrink-0">
                      <tip.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-serif font-bold text-2xl mb-3">
                        {tip.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {tip.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-900/20">
                          <h3 className="font-semibold mb-3 text-green-900 dark:text-green-400">
                            Do's
                          </h3>
                          <ul className="space-y-2">
                            {tip.dos.map((item, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/20">
                          <h3 className="font-semibold mb-3 text-red-900 dark:text-red-400">
                            Don'ts
                          </h3>
                          <ul className="space-y-2">
                            {tip.donts.map((item, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-red-600">✗</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
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
