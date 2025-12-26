import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText } from "lucide-react";

export default function PropertyOwnershipTransferPage() {
  const steps = [
    {
      id: "1",
      title: "Document Verification",
      description: "All property documents verified",
      status: "completed",
      date: "Nov 15, 2025",
    },
    {
      id: "2",
      title: "Payment Processing",
      description: "Full payment received and confirmed",
      status: "completed",
      date: "Nov 18, 2025",
    },
    {
      id: "3",
      title: "Sale Agreement Signing",
      description: "Agreement signed by all parties",
      status: "completed",
      date: "Nov 20, 2025",
    },
    {
      id: "4",
      title: "Stamp Duty & Registration",
      description: "Processing registration with authorities",
      status: "in_progress",
      date: "In Progress",
    },
    {
      id: "5",
      title: "Ownership Transfer",
      description: "Final transfer of ownership",
      status: "pending",
      date: "Pending",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "in_progress":
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <FileText className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            In Progress
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Ownership Transfer Process
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Progress Bar */}
          <Card className="p-6 mb-8">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Overall Progress</span>
                <span className="font-semibold">60%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "60%" }} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              3 of 5 steps completed
            </p>
          </Card>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={step.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getStatusIcon(step.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {index + 1}. {step.title}
                      </h3>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Info */}
          <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <p className="text-sm text-muted-foreground">
              The registration process typically takes 3-5 business days. You'll
              receive email updates at each stage. Once completed, the property
              ownership will be officially transferred to your name.
            </p>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
