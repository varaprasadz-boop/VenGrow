import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Phone, Mail } from "lucide-react";

export default function MyInquiriesPage() {
  const inquiries = [
    {
      id: "1",
      property: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      seller: "Raj Properties",
      status: "awaiting_response",
      date: "Nov 20, 2025",
      message: "I'm interested in this property. Can we schedule a visit?",
    },
    {
      id: "2",
      property: "Commercial Office Space",
      location: "BKC, Mumbai",
      seller: "Prime Realty",
      status: "responded",
      date: "Nov 18, 2025",
      message: "What is the final price for this property?",
      response: "The price is negotiable. We can discuss further.",
    },
    {
      id: "3",
      property: "2BHK Flat",
      location: "Andheri East, Mumbai",
      seller: "Metro Homes",
      status: "closed",
      date: "Nov 10, 2025",
      message: "Is parking included?",
      response: "Yes, one covered parking is included.",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting_response":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            Awaiting Response
          </Badge>
        );
      case "responded":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Responded
          </Badge>
        );
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return null;
    }
  };

  const filterInquiries = (status: string) => {
    if (status === "all") return inquiries;
    return inquiries.filter((i) => i.status === status);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              My Inquiries
            </h1>
            <p className="text-muted-foreground">
              Track all your property inquiries in one place
            </p>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="awaiting_response" data-testid="tab-awaiting">
                Awaiting (
                {inquiries.filter((i) => i.status === "awaiting_response").length})
              </TabsTrigger>
              <TabsTrigger value="responded" data-testid="tab-responded">
                Responded (
                {inquiries.filter((i) => i.status === "responded").length})
              </TabsTrigger>
              <TabsTrigger value="closed" data-testid="tab-closed">
                Closed ({inquiries.filter((i) => i.status === "closed").length})
              </TabsTrigger>
            </TabsList>

            {["all", "awaiting_response", "responded", "closed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="space-y-4">
                  {filterInquiries(tab).map((inquiry) => (
                    <Card key={inquiry.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {inquiry.property}
                            </h3>
                            {getStatusBadge(inquiry.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {inquiry.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sent to {inquiry.seller} • {inquiry.date}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-muted rounded-lg mb-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Your Message
                        </p>
                        <p className="text-sm">{inquiry.message}</p>
                      </div>

                      {inquiry.response && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                          <p className="text-sm text-muted-foreground mb-1">
                            Seller Response
                          </p>
                          <p className="text-sm">{inquiry.response}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-message-${inquiry.id}`}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-call-${inquiry.id}`}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-email-${inquiry.id}`}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
