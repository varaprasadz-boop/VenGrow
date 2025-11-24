import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function PropertyLegalChecklistPage() {
  const checks = [
    {
      category: "Title & Ownership",
      items: [
        { name: "Clear Property Title", status: "completed", critical: true },
        { name: "No Legal Disputes", status: "completed", critical: true },
        { name: "Previous Owner Chain Verified", status: "completed", critical: false },
      ],
    },
    {
      category: "Regulatory Approvals",
      items: [
        { name: "Building Plan Approval", status: "completed", critical: true },
        { name: "Occupancy Certificate", status: "pending", critical: true },
        { name: "RERA Registration", status: "completed", critical: true },
      ],
    },
    {
      category: "Financial & Tax",
      items: [
        { name: "Property Tax Paid", status: "completed", critical: true },
        { name: "No Pending Dues", status: "completed", critical: true },
        { name: "Bank NOC (if applicable)", status: "not_applicable", critical: false },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "not_applicable":
        return <span className="text-sm text-muted-foreground">N/A</span>;
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Legal Verification Checklist
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Overall Status */}
          <Card className="p-6 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Verification Status</h3>
                <p className="text-sm text-muted-foreground">
                  9 of 10 critical checks completed. 1 pending verification.
                </p>
              </div>
            </div>
          </Card>

          {/* Checklist */}
          <div className="space-y-6">
            {checks.map((category, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-6">{category.category}</h3>
                <div className="space-y-4">
                  {category.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(item.status)}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.critical && (
                            <Badge variant="outline" className="mt-1">
                              Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
