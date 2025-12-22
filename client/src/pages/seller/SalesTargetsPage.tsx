
import { Card } from "@/components/ui/card";
import { Target, TrendingUp } from "lucide-react";

export default function SalesTargetsPage() {
  const targets = [
    {
      period: "This Month",
      target: 10,
      achieved: 7,
      percentage: 70,
    },
    {
      period: "This Quarter",
      target: 30,
      achieved: 22,
      percentage: 73,
    },
    {
      period: "This Year",
      target: 120,
      achieved: 85,
      percentage: 71,
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Sales Targets
            </h1>
            <p className="text-muted-foreground">
              Track your performance against targets
            </p>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {targets.map((target, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold mb-6">{target.period}</h3>
                <div className="flex items-end gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Achieved</p>
                    <p className="text-4xl font-bold text-primary">
                      {target.achieved}
                    </p>
                  </div>
                  <div className="pb-2">
                    <p className="text-sm text-muted-foreground">of {target.target}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{target.percentage}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${target.percentage}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Performance Chart */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Performance
            </h3>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">Performance Chart</span>
            </div>
          </Card>
        </div>
      </main>
  );
}
