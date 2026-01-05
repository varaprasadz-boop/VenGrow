import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, Download } from "lucide-react";
import { format } from "date-fns";
import type { SellerSubscription, Package, Payment } from "@shared/schema";
import { generateSubscriptionInvoicePDF } from "@/utils/invoicePDF";

interface SubscriptionWithPackage extends SellerSubscription {
  package?: Package;
}

interface SubscriptionHistoryResponse {
  success: boolean;
  subscriptions: SubscriptionWithPackage[];
}

export default function SubscriptionHistoryPage() {
  const { data: response, isLoading } = useQuery<SubscriptionHistoryResponse>({
    queryKey: ["/api/subscriptions/history"],
  });

  const subscriptions = response?.subscriptions || [];

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/me/payments"],
  });

  const handleDownloadInvoice = async (subscription: SubscriptionWithPackage) => {
    // Find payment associated with this subscription
    const payment = payments.find(p => p.subscriptionId === subscription.id);
    
    if (!payment) {
      alert("No payment found for this subscription");
      return;
    }

    const invoiceNumber = payment.razorpayOrderId || `INV-${payment.id.slice(0, 8).toUpperCase()}`;
    const invoiceDate = payment.createdAt ? format(new Date(payment.createdAt), "MMM dd, yyyy") : format(new Date(), "MMM dd, yyyy");
    const startDate = subscription.startDate ? format(new Date(subscription.startDate), "MMM dd, yyyy") : "N/A";
    const endDate = subscription.endDate ? format(new Date(subscription.endDate), "MMM dd, yyyy") : "N/A";

    try {
      await generateSubscriptionInvoicePDF({
        invoiceNumber,
        invoiceDate,
        subscription: {
          packageName: subscription.package?.name || "Package",
          duration: subscription.package?.duration || 30,
          startDate,
          endDate,
        },
        payment: {
          amount: payment.amount || 0,
          status: payment.status,
          paymentMethod: payment.paymentMethod || undefined,
          razorpayPaymentId: payment.razorpayPaymentId || undefined,
        },
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Receipt className="h-8 w-8 text-primary" />
              Subscription History
            </h1>
            <p className="text-muted-foreground">
              View all your past and current subscriptions
            </p>
          </div>

          {subscriptions.length === 0 ? (
            <div className="text-center py-16">
              <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No Subscription History</h3>
              <p className="text-muted-foreground">You don't have any subscriptions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub) => {
                const payment = payments.find(p => p.subscriptionId === sub.id);
                const isActive = sub.isActive && new Date(sub.endDate) > new Date();
                const startDate = sub.startDate ? format(new Date(sub.startDate), "MMM d, yyyy") : "N/A";
                const endDate = sub.endDate ? format(new Date(sub.endDate), "MMM d, yyyy") : "N/A";
                
                return (
                  <Card key={sub.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{sub.package?.name || "Package"}</h3>
                          {isActive ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline">Expired</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                            <p className="font-medium">{startDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">End Date</p>
                            <p className="font-medium">{endDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="font-medium">
                              {payment ? `₹${formatPrice(payment.amount || 0)}` : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Listings</p>
                            <p className="font-medium">{sub.package?.listingLimit || 0} Listings</p>
                          </div>
                        </div>
                      </div>

                      {payment && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(sub)}
                          data-testid={`button-invoice-${sub.id}`}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
  );
}
