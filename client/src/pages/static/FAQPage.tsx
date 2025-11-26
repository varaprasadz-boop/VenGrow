import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      category: "For Buyers",
      questions: [
        {
          q: "How do I search for properties on VenGrow?",
          a: "You can search for properties using our search bar on the homepage. Filter by location, property type, price range, BHK configuration, and more. You can also save your search criteria to get notifications when new matching properties are listed.",
        },
        {
          q: "Are all sellers verified?",
          a: "Yes, we have a thorough verification process for all sellers. Individual owners verify their property documents, brokers provide RERA certification, and builders submit company registration details. Look for the verified badge on listings.",
        },
        {
          q: "How do I contact a property seller?",
          a: "Simply click on a property listing and use the 'Send Inquiry' button or 'Chat with Seller' option. Your contact details will be shared with the seller, and they'll respond directly.",
        },
        {
          q: "Is there any fee for buyers?",
          a: "No, VenGrow is completely free for buyers. You can browse unlimited properties, save favorites, and contact sellers without any charges.",
        },
        {
          q: "Can I schedule property visits?",
          a: "Yes, you can request site visits directly through the inquiry form or chat with sellers to arrange a convenient time for property viewing.",
        },
      ],
    },
    {
      category: "For Sellers",
      questions: [
        {
          q: "What are the different seller packages?",
          a: "We offer three packages: Basic (₹999/month for 5 listings), Premium (₹2,999/month for 20 listings), and Featured (₹9,999/month for unlimited listings). Each package offers different visibility and features.",
        },
        {
          q: "How long does verification take?",
          a: "Verification typically takes 24-48 hours. We verify property documents for individual owners, RERA certification for brokers, and company registration for builders.",
        },
        {
          q: "How do I create a property listing?",
          a: "After purchasing a package, go to your seller dashboard and click 'Create Listing'. Fill in property details, upload photos, set the price, and publish. Your listing will go live after approval.",
        },
        {
          q: "Can I edit or delete my listings?",
          a: "Yes, you can edit listing details, update photos, or change pricing anytime from your dashboard. You can also pause or delete listings as needed.",
        },
        {
          q: "How do I receive inquiries?",
          a: "You'll receive inquiries via email, SMS, and through the platform's messaging system. You can respond directly from your seller dashboard.",
        },
      ],
    },
    {
      category: "Payments & Refunds",
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept all major payment methods through Razorpay including credit/debit cards, UPI, net banking, and wallets.",
        },
        {
          q: "Is there a refund policy?",
          a: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with our service within the first 7 days, contact support for a full refund.",
        },
        {
          q: "Are payments secure?",
          a: "Yes, all payments are processed through Razorpay, a PCI DSS compliant payment gateway. We don't store any payment card details on our servers.",
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes, you can cancel anytime. Your package will remain active until the end of your billing period, and you won't be charged again.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click on 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link.",
        },
        {
          q: "How do I change my email or phone number?",
          a: "Go to your Profile Settings and update your email or phone number. You'll need to verify the new email/phone through OTP.",
        },
        {
          q: "Why can't I upload property photos?",
          a: "Ensure your images are in JPG, PNG, or WebP format and under 5MB each. If the problem persists, try a different browser or contact support.",
        },
        {
          q: "How do I delete my account?",
          a: "Go to Settings > Account Actions > Delete Account. Note that this action is permanent and will remove all your data.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">FAQ</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about VenGrow
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {faqs.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="font-serif font-bold text-2xl mb-6">
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, qIndex) => (
                      <AccordionItem
                        key={qIndex}
                        value={`${catIndex}-${qIndex}`}
                        className="border rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{faq.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="font-serif font-bold text-2xl mb-3">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button data-testid="button-contact-support">
                  Contact Support
                </Button>
                <Button variant="outline" data-testid="button-live-chat">
                  Start Live Chat
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
