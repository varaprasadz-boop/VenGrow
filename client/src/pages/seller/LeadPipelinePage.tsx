
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LeadPipelinePage() {
  const pipeline = [
    {
      stage: "New Leads",
      count: 45,
      value: "₹38 Cr",
      leads: [
        {
          id: "1",
          name: "Amit Kumar",
          property: "Luxury 3BHK Apartment",
          value: "₹85 L",
        },
        { id: "2", name: "Priya Sharma", property: "2BHK Flat", value: "₹65 L" },
      ],
    },
    {
      stage: "Contacted",
      count: 28,
      value: "₹24 Cr",
      leads: [
        {
          id: "3",
          name: "Rahul Patel",
          property: "4BHK Villa",
          value: "₹1.2 Cr",
        },
      ],
    },
    {
      stage: "Site Visit",
      count: 15,
      value: "₹13 Cr",
      leads: [
        {
          id: "4",
          name: "Neha Gupta",
          property: "Commercial Space",
          value: "₹2.5 Cr",
        },
      ],
    },
    {
      stage: "Negotiation",
      count: 8,
      value: "₹7 Cr",
      leads: [],
    },
  ];

  return (


      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">Lead Pipeline</h1>
            <p className="text-muted-foreground">
              Track leads through your sales funnel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pipeline.map((stage, index) => (
              <div key={index} className="space-y-4">
                <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
                  <h3 className="font-semibold mb-2">{stage.stage}</h3>
                  <div className="flex items-center justify-between">
                    <Badge>{stage.count} leads</Badge>
                    <span className="font-semibold text-sm">{stage.value}</span>
                  </div>
                </Card>

                <div className="space-y-3">
                  {stage.leads.map((lead) => (
                    <Card key={lead.id} className="p-4 cursor-pointer hover-elevate">
                      <h4 className="font-medium mb-1">{lead.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {lead.property}
                      </p>
                      <p className="font-semibold text-sm text-primary">
                        {lead.value}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
  );
}
