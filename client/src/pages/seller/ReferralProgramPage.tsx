
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Gift, Copy, Mail, Share2 } from "lucide-react";

export default function ReferralProgramPage() {
  const referralCode = "PROP2025ABC";
  const referralLink = `https://propconnect.com/register?ref=${referralCode}`;

  const stats = [
    { label: "Total Referrals", value: "12", icon: Users },
    { label: "Successful Sign-ups", value: "8", icon: Users },
    { label: "Earnings", value: "₹4,000", icon: Gift },
    { label: "Pending", value: "₹1,500", icon: Gift },
  ];

  const referrals = [
    {
      id: "1",
      name: "Amit Kumar",
      email: "amit@example.com",
      status: "completed",
      date: "Nov 20, 2025",
      earnings: "₹500",
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@example.com",
      status: "pending",
      date: "Nov 18, 2025",
      earnings: "₹500",
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Referral Program
            </h1>
            <p className="text-muted-foreground">
              Earn ₹500 for every successful referral
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Referral Link */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="font-semibold text-lg mb-6 text-center">
              Share Your Referral Link
            </h3>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2 mb-4">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1"
                  data-testid="input-referral-link"
                />
                <Button data-testid="button-copy">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" data-testid="button-share-email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" data-testid="button-share-social">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-8 mb-8">
            <h3 className="font-semibold text-lg mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h4 className="font-semibold mb-2">Share Your Link</h4>
                <p className="text-sm text-muted-foreground">
                  Send your unique referral link to friends and colleagues
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h4 className="font-semibold mb-2">They Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  Your referral creates an account and purchases a package
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h4 className="font-semibold mb-2">You Earn</h4>
                <p className="text-sm text-muted-foreground">
                  Receive ₹500 in your account for each successful referral
                </p>
              </div>
            </div>
          </Card>

          {/* Referral History */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Referral History</h3>
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {referral.email} • {referral.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{referral.earnings}</p>
                      {referral.status === "completed" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
  );
}
