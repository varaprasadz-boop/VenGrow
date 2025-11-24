import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              Refund Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: November 24, 2025
            </p>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">7-Day Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Full refund within 7 days of purchase
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">5-7 Business Days</h3>
                <p className="text-sm text-muted-foreground">
                  Refund processing time
                </p>
              </Card>
              <Card className="p-6 text-center">
                <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Partial Refunds</h3>
                <p className="text-sm text-muted-foreground">
                  After 7 days from purchase
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">1. 7-Day Money-Back Guarantee</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a 7-day money-back guarantee for all seller package subscriptions. If you're not satisfied with our service within the first 7 days of your purchase, you can request a full refund.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">2. Eligibility for Refunds</h2>
                <h3 className="font-semibold text-lg mb-3">2.1 Eligible Scenarios</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are eligible for a refund if:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Your refund request is made within 7 days of the initial purchase</li>
                  <li>You have not violated our Terms of Service</li>
                  <li>Technical issues prevented you from using the service and we were unable to resolve them</li>
                  <li>You were charged incorrectly or duplicate charges occurred</li>
                </ul>

                <h3 className="font-semibold text-lg mb-3">2.2 Non-Eligible Scenarios</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Refunds will NOT be issued if:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>The refund request is made after 7 days from purchase</li>
                  <li>Your account was terminated due to Terms of Service violations</li>
                  <li>You simply changed your mind after using the service for more than 7 days</li>
                  <li>Your listings were removed for violating our listing policies</li>
                  <li>You did not receive inquiries (we do not guarantee specific results)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">3. How to Request a Refund</h2>
                <h3 className="font-semibold text-lg mb-3">3.1 Submission Process</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To request a refund:
                </p>
                <ol className="list-decimal pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Contact our support team at support@propconnect.in</li>
                  <li>Include your transaction ID and account email</li>
                  <li>Provide a brief reason for the refund request</li>
                  <li>Our team will review your request within 2 business days</li>
                </ol>

                <h3 className="font-semibold text-lg mb-3">3.2 Required Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Please provide:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Full name and registered email address</li>
                  <li>Transaction/Order ID</li>
                  <li>Purchase date</li>
                  <li>Reason for refund request</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">4. Refund Processing</h2>
                <h3 className="font-semibold text-lg mb-3">4.1 Timeline</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once your refund is approved:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Refunds are processed within 2-3 business days of approval</li>
                  <li>The refund amount will be credited to your original payment method</li>
                  <li>It may take 5-7 business days for the refund to appear in your account, depending on your bank or payment provider</li>
                </ul>

                <h3 className="font-semibold text-lg mb-3">4.2 Refund Method</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Refunds are issued to the original payment method used for the purchase. We cannot issue refunds to a different payment method or account.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">5. Cancellation Policy</h2>
                <h3 className="font-semibold text-lg mb-3">5.1 Monthly Subscriptions</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can cancel your subscription at any time:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Your subscription remains active until the end of the current billing period</li>
                  <li>No charges will be made for subsequent months</li>
                  <li>You can continue using the service until the paid period ends</li>
                </ul>

                <h3 className="font-semibold text-lg mb-3">5.2 No Pro-Rated Refunds</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We do not offer pro-rated refunds for cancellations made after the 7-day refund period. If you cancel mid-month, you will not receive a partial refund for the unused portion.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">6. Special Circumstances</h2>
                <h3 className="font-semibold text-lg mb-3">6.1 Technical Issues</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you experience technical issues that prevent you from using our service, please contact support immediately. We will work to resolve the issue. If we cannot resolve it within a reasonable time, a refund may be considered even after the 7-day period.
                </p>

                <h3 className="font-semibold text-lg mb-3">6.2 Duplicate Charges</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you were charged twice for the same transaction, please contact us immediately with proof of duplicate charges. We will issue a refund for the duplicate amount promptly.
                </p>

                <h3 className="font-semibold text-lg mb-3">6.3 Service Downtime</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If our platform experiences significant downtime (more than 72 consecutive hours), affected users may be eligible for a partial refund or account credit.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">7. Changes to Refund Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify this refund policy at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our service after changes constitutes acceptance of the modified policy.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">8. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For refund requests or questions about this policy:<br />
                  Email: support@propconnect.in<br />
                  Phone: +91 1800-123-4567<br />
                  Response Time: Within 24-48 hours
                </p>
              </section>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-2xl mb-4">
              Need Help with a Refund?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our support team is here to assist you with any refund-related questions
            </p>
            <Button size="lg" data-testid="button-contact-support">
              Contact Support
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
