import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Building, Download } from "lucide-react";

export default function InvestorRelationsPage() {
  const stats = [
    { label: "Annual Revenue", value: "₹245 Cr", change: "+35%" },
    { label: "Active Users", value: "52K+", change: "+28%" },
    { label: "Properties Listed", value: "10K+", change: "+42%" },
    { label: "Transactions", value: "₹1,200 Cr", change: "+38%" },
  ];

  const financials = [
    { year: "FY 2025", revenue: "₹245 Cr", growth: "35%" },
    { year: "FY 2024", revenue: "₹182 Cr", growth: "28%" },
    { year: "FY 2023", revenue: "₹142 Cr", growth: "25%" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
              Investor Relations
            </h1>
            <p className="text-lg text-muted-foreground">
              Transforming India's real estate market through technology
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center">
                  <p className="text-4xl font-bold font-serif text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-sm text-green-600 font-medium">
                    {stat.change} YoY
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Performance */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-8 text-center">
              Financial Performance
            </h2>
            <Card className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Fiscal Year</th>
                      <th className="text-right p-4">Revenue</th>
                      <th className="text-right p-4">YoY Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financials.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="p-4 font-medium">{item.year}</td>
                        <td className="p-4 text-right font-semibold">
                          {item.revenue}
                        </td>
                        <td className="p-4 text-right text-green-600 font-medium">
                          {item.growth}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Downloads */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-8 text-center">
              Financial Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Annual Report FY 2025",
                "Q4 2025 Earnings Report",
                "Q3 2025 Earnings Report",
                "Investor Presentation 2025",
              ].map((report, index) => (
                <Card key={index} className="p-6 hover-elevate">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{report}</h3>
                      <p className="text-sm text-muted-foreground">PDF, 2.4 MB</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      data-testid={`button-download-${index}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Investor Inquiries
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              For investor relations queries, please contact our team
            </p>
            <div className="space-y-2 mb-8">
              <p>
                <strong>Email:</strong> investors@propconnect.com
              </p>
              <p>
                <strong>Phone:</strong> +91 22 1234 5678
              </p>
            </div>
            <Button size="lg">Contact Investor Relations</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
