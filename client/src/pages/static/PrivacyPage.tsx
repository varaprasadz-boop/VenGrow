import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              Privacy Policy
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
                <h2 className="font-serif font-bold text-2xl mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  PropConnect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our real estate marketplace platform.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">2. Information We Collect</h2>
                <h3 className="font-semibold text-lg mb-3">2.1 Personal Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you register for an account, we collect:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Name, email address, and phone number</li>
                  <li>Profile photo (optional)</li>
                  <li>Location and address information</li>
                  <li>RERA registration (for brokers)</li>
                  <li>Company registration details (for builders)</li>
                </ul>

                <h3 className="font-semibold text-lg mb-3">2.2 Property Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For property listings, we collect details including location, price, specifications, photos, and other property-related information you provide.
                </p>

                <h3 className="font-semibold text-lg mb-3">2.3 Usage Data</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We automatically collect:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Browser type and version</li>
                  <li>IP address and device information</li>
                  <li>Pages viewed and time spent on pages</li>
                  <li>Search queries and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use collected information for:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Providing and maintaining our Service</li>
                  <li>Processing transactions and managing subscriptions</li>
                  <li>Verifying seller credentials and property listings</li>
                  <li>Facilitating communication between buyers and sellers</li>
                  <li>Sending notifications about inquiries, messages, and platform updates</li>
                  <li>Improving our services through analytics</li>
                  <li>Detecting and preventing fraud or abuse</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">4. Information Sharing</h2>
                <h3 className="font-semibold text-lg mb-3">4.1 With Other Users</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you submit an inquiry, your contact information is shared with the relevant seller. Property listings and seller profiles are publicly visible on our platform.
                </p>

                <h3 className="font-semibold text-lg mb-3">4.2 With Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We share information with third-party service providers who help us operate our platform:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Payment processors (Razorpay)</li>
                  <li>Email service providers (SendGrid)</li>
                  <li>SMS providers (Twilio)</li>
                  <li>Cloud hosting providers</li>
                  <li>Analytics services</li>
                </ul>

                <h3 className="font-semibold text-lg mb-3">4.3 Legal Requirements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may disclose your information if required by law or in response to valid requests by public authorities.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Object to or restrict certain processing activities</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">7. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site traffic and usage patterns</li>
                  <li>Personalize content and advertisements</li>
                  <li>Maintain session security</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  You can control cookies through your browser settings, but disabling cookies may limit some functionality.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">8. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Inactive accounts may be deleted after 2 years of inactivity.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service is not intended for users under 18 years of age. We do not knowingly collect information from children.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">10. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">11. Changes to Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the platform.
                </p>
              </section>

              <section>
                <h2 className="font-serif font-bold text-2xl mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about this Privacy Policy or to exercise your rights, contact us at:<br />
                  Email: privacy@propconnect.in<br />
                  Phone: +91 1800-123-4567<br />
                  Address: Mumbai, Maharashtra, India
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
