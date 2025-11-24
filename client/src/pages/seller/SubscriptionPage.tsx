import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  Download,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

export default function SubscriptionPage() {
  const subscription = {
    plan: "Premium",
    status: "active",
    amount: "₹2,499",
    startDate: "Oct 24, 2025",
    renewalDate: "Dec 24, 2025",
    daysLeft: 30,
    listingsUsed: 12,
    listingsTotal: 20,
    autoRenew: true,
  };

  const billingHistory = [
    {
      id: "INV-001",
      date: "Oct 24, 2025",
      plan: "Premium",
      amount: "₹2,499",
      status: "paid",
    },
    {
      id: "INV-002",
      date: "Sep 24, 2025",
      plan: "Premium",
      amount: "₹2,499",
      status: "paid",
    },
    {
      id: "INV-003",
      date: "Aug 24, 2025",
      plan: "Basic",
      amount: "₹999",
      status: "paid",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Subscription Management
            </h1>
            <p className="text-muted-foreground">
              Manage your package and billing
            </p>
          </div>

          {/* Current Plan */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-serif font-bold text-2xl">
                    {subscription.plan} Plan
                  </h2>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-primary mb-4">
                  {subscription.amount}/month
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Started: {subscription.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4" />
                    <span>
                      Next renewal: {subscription.renewalDate} ({subscription.daysLeft} days)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="outline" data-testid="button-change-plan">
                  Change Plan
                </Button>
                <Button variant="outline" data-testid="button-cancel">
                  Cancel Subscription
                </Button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Package Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Property Listings</span>
                    <span className="text-sm font-medium">
                      {subscription.listingsUsed} / {subscription.listingsTotal}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(subscription.listingsUsed / subscription.listingsTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Payment Method</h3>
              <Button variant="outline" size="sm" data-testid="button-update-payment">
                Update
              </Button>
            </div>
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 rounded-lg bg-muted">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <p className="text-sm">
                  <strong>Auto-renewal is enabled.</strong> Your subscription will automatically renew on {subscription.renewalDate}.
                </p>
              </div>
            </div>
          </Card>

          {/* Billing History */}
          <Card className="p-6">
            <h3 className="font-semibold mb-6">Billing History</h3>
            <div className="space-y-3">
              {billingHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium">{invoice.id}</p>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                        Paid
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{invoice.date}</span>
                      <span>•</span>
                      <span>{invoice.plan} Plan</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-lg">{invoice.amount}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-download-${invoice.id}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
