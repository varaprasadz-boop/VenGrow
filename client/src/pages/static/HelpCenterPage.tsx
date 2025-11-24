import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Book,
  CreditCard,
  Home,
  Users,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Home,
      title: "Getting Started",
      description: "Learn the basics of using PropConnect",
      articles: 12,
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Manage subscriptions and payments",
      articles: 8,
    },
    {
      icon: Book,
      title: "Listing Properties",
      description: "How to create and manage listings",
      articles: 15,
    },
    {
      icon: Users,
      title: "Account Management",
      description: "Profile, security, and preferences",
      articles: 10,
    },
  ];

  const faqs = [
    {
      question: "How do I create a property listing?",
      answer:
        "To create a property listing, log in to your seller account, navigate to 'Create Listing' from your dashboard, and follow the step-by-step form. You'll need to provide property details, upload images, set pricing, and choose a package.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and popular wallets through our secure payment partner Razorpay.",
    },
    {
      question: "How long does seller verification take?",
      answer:
        "Seller verification typically takes 24-48 hours. Our team reviews your submitted documents to ensure authenticity. You'll receive an email notification once your account is verified.",
    },
    {
      question: "Can I edit my listing after publishing?",
      answer:
        "Yes, you can edit your property listing at any time from your 'Manage Listings' dashboard. Changes to pricing and availability are reflected immediately, while major changes may require re-verification.",
    },
    {
      question: "How do I contact a property seller?",
      answer:
        "You can contact sellers directly through our built-in messaging system. Click 'Contact Seller' on any property listing to send an inquiry. You can also schedule property visits through the platform.",
    },
    {
      question: "What is the refund policy?",
      answer:
        "We offer a 7-day money-back guarantee for all packages. If you're not satisfied, contact our support team within 7 days of purchase for a full refund. See our Refund Policy page for complete details.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              How Can We Help?
            </h1>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className="p-6 text-center hover-elevate cursor-pointer"
                >
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <category.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.articles} articles
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-6 bg-white dark:bg-gray-900"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium text-left">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Contact Support */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <h2 className="font-serif font-bold text-3xl mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our support team is here to help you 24/7
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/contact">
                <Button size="lg" data-testid="button-contact">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </a>
              <a href="/faq">
                <Button variant="outline" size="lg" data-testid="button-faq">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  View All FAQs
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
