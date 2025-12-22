import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Download, Calendar, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import type { Payment, Package } from "@shared/schema";

interface PaymentWithPackage extends Payment {
  package?: Package;
}

function formatPrice(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toLocaleString("en-IN");
}

export default function EarningsPage() {
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery<PaymentWithPackage[]>({
    queryKey: ["/api/me/payments"],
    enabled: !!user,
  });

  const completedPayments = payments.filter(p => p.status === "completed");
  const pendingPayments = payments.filter(p => p.status === "pending");

  const totalEarnings = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const currentMonth = new Date().getMonth();
  const thisMonthPayments = completedPayments.filter(p => {
    const paymentMonth = new Date(p.createdAt).getMonth();
    return paymentMonth === currentMonth;
  });
  const thisMonthTotal = thisMonthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                My Earnings
              </h1>
              <p className="text-muted-foreground">
                Track your commissions and payouts
              </p>
            </div>
            <Button data-testid="button-withdraw" disabled={totalEarnings === 0}>
              <Download className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold" data-testid="text-total-earnings">
                    ₹{formatPrice(totalEarnings)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold" data-testid="text-this-month">
                    ₹{formatPrice(thisMonthTotal)}
                  </p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold" data-testid="text-pending">
                    ₹{formatPrice(pendingAmount)}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold" data-testid="text-withdrawn">
                    ₹0
                  </p>
                  <p className="text-sm text-muted-foreground">Withdrawn</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Transaction History</h3>
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="font-semibold text-lg mb-2">No Transactions Yet</h4>
                <p className="text-muted-foreground">
                  Your payment transactions will appear here once you start receiving payments.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg flex-wrap gap-4"
                    data-testid={`card-transaction-${payment.id}`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className="font-medium">
                          {payment.package?.name || "Package Payment"}
                        </h4>
                        {payment.status === "completed" ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                            Completed
                          </Badge>
                        ) : payment.status === "pending" ? (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                            Pending
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            {payment.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.razorpayOrderId ? "Razorpay" : "Payment"} • {format(new Date(payment.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-serif text-primary">
                        ₹{(payment.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    );
}
