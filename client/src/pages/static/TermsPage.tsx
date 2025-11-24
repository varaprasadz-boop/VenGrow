import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: November 24, 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using PropConnect ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">2. Use of Service</h2>
                <h3 className="font-semibold text-lg mb-3">2.1 Eligibility</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You must be at least 18 years old to use our Service. By using PropConnect, you represent and warrant that you meet this age requirement.
                </p>
                <h3 className="font-semibold text-lg mb-3">2.2 Account Registration</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
                <h3 className="font-semibold text-lg mb-3">2.3 Prohibited Activities</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Posting false, misleading, or fraudulent property listings</li>
                  <li>Harassing or threatening other users</li>
                  <li>Attempting to bypass our security measures</li>
                  <li>Using automated systems to scrape or collect data</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">3. Property Listings</h2>
                <h3 className="font-semibold text-lg mb-3">3.1 Seller Responsibilities</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sellers are solely responsible for the accuracy and completeness of their property listings. You must have the legal right to list and sell the properties you advertise.
                </p>
                <h3 className="font-semibold text-lg mb-3">3.2 Verification</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  PropConnect reserves the right to verify property listings and seller information. We may remove listings that do not meet our standards or violate these terms.
                </p>
                <h3 className="font-semibold text-lg mb-3">3.3 Listing Duration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Listing duration depends on your selected package. Listings may be renewed before expiration or upgraded to a higher visibility package.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">4. Payments and Subscriptions</h2>
                <h3 className="font-semibold text-lg mb-3">4.1 Package Pricing</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All package prices are listed in Indian Rupees (₹). Prices may change with 30 days' notice to existing subscribers.
                </p>
                <h3 className="font-semibold text-lg mb-3">4.2 Payment Processing</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Payments are processed securely through Razorpay. By making a payment, you agree to Razorpay's terms of service.
                </p>
                <h3 className="font-semibold text-lg mb-3">4.3 Refunds</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We offer a 7-day money-back guarantee from the date of purchase. Refund requests must be submitted through our support channels. See our Refund Policy for full details.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All content on PropConnect, including text, graphics, logos, and software, is the property of PropConnect or its licensors and is protected by copyright and trademark laws.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By uploading content to PropConnect, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on our platform.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">6. Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your use of PropConnect is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">7. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PropConnect is provided "as is" without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of property listings or user-generated content.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PropConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">9. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">10. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the platform. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">12. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, please contact us at:<br />
                  Email: legal@propconnect.in<br />
                  Phone: +91 1800-123-4567
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
