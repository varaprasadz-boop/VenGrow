import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif font-bold text-4xl mb-4">Refund Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: November 24, 2025
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 mb-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="font-serif font-bold text-2xl mb-4">
                Money-Back Guarantee
              </h2>
              <p className="text-muted-foreground mb-6">
                At PropConnect, we stand behind the quality of our service. We offer
                a 7-day money-back guarantee for all our packages.
              </p>

              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-lg">
                    7-Day Money-Back Guarantee
                  </h3>
                </div>
                <p className="text-sm">
                  If you're not completely satisfied with our service within 7 days
                  of purchase, we'll provide a full refund—no questions asked.
                </p>
              </div>

              <h3 className="font-semibold text-xl mb-4">Eligibility Criteria</h3>
              <p className="text-muted-foreground mb-4">
                To be eligible for a refund, the following conditions must be met:
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Refund request must be made within 7 days of the original
                    purchase date
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Account must not have violated our Terms of Service
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Refund request must be submitted through the official support
                    channel
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    For package subscriptions, this applies to the initial purchase
                    only (not renewals)
                  </span>
                </li>
              </ul>

              <h3 className="font-semibold text-xl mb-4">Non-Refundable Items</h3>
              <p className="text-muted-foreground mb-4">
                The following are not eligible for refunds:
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Package renewals (automatic or manual)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Requests made after the 7-day guarantee period</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Services where the account has been suspended or terminated due
                    to Terms of Service violations
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Add-on services or additional features purchased separately
                  </span>
                </li>
              </ul>

              <h3 className="font-semibold text-xl mb-4">Refund Process</h3>
              <p className="text-muted-foreground mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="space-y-3 mb-8">
                <li className="flex gap-2">
                  <span className="font-semibold">1.</span>
                  <span>
                    Contact our support team at support@propconnect.com with your
                    transaction ID and reason for refund
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">2.</span>
                  <span>
                    Our team will review your request within 24-48 business hours
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">3.</span>
                  <span>
                    If approved, the refund will be processed to your original
                    payment method
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold">4.</span>
                  <span>
                    Refunds typically appear in your account within 5-10 business
                    days, depending on your bank or payment provider
                  </span>
                </li>
              </ol>

              <h3 className="font-semibold text-xl mb-4">Partial Refunds</h3>
              <p className="text-muted-foreground mb-8">
                In certain cases, we may offer partial refunds. This may apply when:
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    You've used a significant portion of your package features
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    You're downgrading from a higher tier package to a lower one
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Special circumstances are reviewed on a case-by-case basis
                  </span>
                </li>
              </ul>

              <h3 className="font-semibold text-xl mb-4">
                Subscription Cancellations
              </h3>
              <p className="text-muted-foreground mb-4">
                You can cancel your subscription at any time:
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Go to your account settings and select "Cancel Subscription"
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Your subscription will remain active until the end of the
                    current billing period
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    No refunds will be issued for the remaining time in the current
                    billing cycle
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You will not be charged for subsequent billing periods</span>
                </li>
              </ul>

              <h3 className="font-semibold text-xl mb-4">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about our refund policy, please contact us
                at:
                <br />
                <br />
                Email: support@propconnect.com
                <br />
                Phone: +91 98765 43210
                <br />
                Business Hours: Monday - Saturday, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
