import { useQuery } from "@tanstack/react-query";
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
import { MessageCircle, Loader2, AlertCircle } from "lucide-react";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

const defaultFaqs: FaqItem[] = [
  {
    id: "default-1",
    category: "For Buyers",
    question: "How do I search for properties on VenGrow?",
    answer: "You can search for properties using our search bar on the homepage. Filter by location, property type, price range, BHK configuration, and more. You can also save your search criteria to get notifications when new matching properties are listed.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "default-2",
    category: "For Buyers",
    question: "Are all sellers verified?",
    answer: "Yes, we have a thorough verification process for all sellers. Individual owners verify their property documents, brokers provide RERA certification, and builders submit company registration details. Look for the verified badge on listings.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "default-3",
    category: "For Buyers",
    question: "Is there any fee for buyers?",
    answer: "No, VenGrow is completely free for buyers. You can browse unlimited properties, save favorites, and contact sellers without any charges.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "default-4",
    category: "For Sellers",
    question: "What are the different seller packages?",
    answer: "We offer multiple packages: Free (1 listing), Basic (3 listings at ₹999), Premium (10 listings at ₹2,499), and Enterprise (50 listings at ₹9,999). Each package offers different visibility and features.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "default-5",
    category: "For Sellers",
    question: "How long does verification take?",
    answer: "Verification typically takes 24-48 hours. We verify property documents for individual owners, RERA certification for brokers, and company registration for builders.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "default-6",
    category: "Payments & Refunds",
    question: "What payment methods are accepted?",
    answer: "We accept all major payment methods through Razorpay including credit/debit cards, UPI, net banking, and wallets.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "default-7",
    category: "Payments & Refunds",
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with our service within the first 7 days, contact support for a full refund.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "default-8",
    category: "Technical Support",
    question: "I forgot my password. How do I reset it?",
    answer: "Click on 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link.",
    sortOrder: 1,
    isActive: true,
  },
];

export default function FAQPage() {
  const { data: faqItems, isLoading, isError } = useQuery<FaqItem[]>({
    queryKey: ["/api/faq"],
  });

  const displayFaqs = (faqItems && faqItems.length > 0) ? faqItems : defaultFaqs;

  const groupedFaqs = displayFaqs.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  const categories = Object.keys(groupedFaqs);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
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

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Unable to load FAQs. Showing default content.</p>
                <div className="space-y-8">
                  {categories.map((category, catIndex) => (
                    <div key={catIndex}>
                      <h2 className="font-serif font-bold text-2xl mb-6">
                        {category}
                      </h2>
                      <Accordion type="single" collapsible className="space-y-4">
                        {groupedFaqs[category].map((faq, qIndex) => (
                          <AccordionItem
                            key={faq.id}
                            value={`${catIndex}-${qIndex}`}
                            className="border rounded-lg px-6"
                            data-testid={`faq-item-${faq.id}`}
                          >
                            <AccordionTrigger className="text-left hover:no-underline">
                              <span className="font-medium">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category, catIndex) => (
                  <div key={catIndex}>
                    <h2 className="font-serif font-bold text-2xl mb-6">
                      {category}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {groupedFaqs[category].map((faq, qIndex) => (
                        <AccordionItem
                          key={faq.id}
                          value={`${catIndex}-${qIndex}`}
                          className="border rounded-lg px-6"
                          data-testid={`faq-item-${faq.id}`}
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

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
