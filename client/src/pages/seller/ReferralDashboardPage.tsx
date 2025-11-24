import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, Copy } from "lucide-react";

export default function ReferralDashboardPage() {
  const stats = {
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: 12000,
    pendingEarnings: 3500,
  };

  const referrals = [
    {
      id: "1",
      name: "Amit Kumar",
      email: "amit@example.com",
      status: "active",
      joinedDate: "Nov 15, 2025",
      earnings: 500,
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@example.com",
      status: "active",
      joinedDate: "Nov 10, 2025",
      earnings: 500,
    },
    {
      id: "3",
      name: "Rahul Patel",
      email: "rahul@example.com",
      status: "pending",
      joinedDate: "Nov 20, 2025",
      earnings: 0,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Referral Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your referrals and earnings
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.totalReferrals}</p>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.activeReferrals}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">₹{stats.totalEarnings}</p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">₹{stats.pendingEarnings}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Referral Link */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="font-semibold mb-4">Your Referral Link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value="https://propconnect.com/ref/ABC123"
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-black"
              />
              <Button>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </Card>

          {/* Referrals List */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Your Referrals</h3>
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium mb-1">{referral.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {referral.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined {referral.joinedDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">₹{referral.earnings}</p>
                      <p className="text-xs text-muted-foreground">Earned</p>
                    </div>
                    {referral.status === "active" ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                        Pending
                      </Badge>
                    )}
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
