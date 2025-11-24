import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Download, Calendar } from "lucide-react";

export default function EarningsPage() {
  const earnings = {
    total: 145000,
    thisMonth: 35000,
    pending: 12000,
    withdrawn: 133000,
  };

  const transactions = [
    {
      id: "1",
      type: "commission",
      property: "Luxury 3BHK Apartment",
      amount: 15000,
      status: "completed",
      date: "Nov 20, 2025",
    },
    {
      id: "2",
      type: "referral",
      property: "Referral Bonus - Amit Kumar",
      amount: 500,
      status: "completed",
      date: "Nov 18, 2025",
    },
    {
      id: "3",
      type: "commission",
      property: "Commercial Office Space",
      amount: 12000,
      status: "pending",
      date: "Nov 15, 2025",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                My Earnings
              </h1>
              <p className="text-muted-foreground">
                Track your commissions and payouts
              </p>
            </div>
            <Button data-testid="button-withdraw">
              <Download className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    ₹{(earnings.total / 1000).toFixed(0)}K
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
                  <p className="text-3xl font-bold">
                    ₹{(earnings.thisMonth / 1000).toFixed(0)}K
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
                  <p className="text-3xl font-bold">
                    ₹{(earnings.pending / 1000).toFixed(0)}K
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
                  <p className="text-3xl font-bold">
                    ₹{(earnings.withdrawn / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-muted-foreground">Withdrawn</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Transactions */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Transaction History</h3>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium">{transaction.property}</h4>
                      {transaction.status === "completed" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {transaction.type === "commission" ? "Commission" : "Referral"} • {transaction.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-serif text-primary">
                      ₹{transaction.amount.toLocaleString()}
                    </p>
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
