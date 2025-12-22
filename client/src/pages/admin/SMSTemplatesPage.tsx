import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Edit, Trash2 } from "lucide-react";

export default function SMSTemplatesPage() {
  const templates = [
    {
      id: "1",
      name: "Property Inquiry Confirmation",
      content: "Hi {name}, Thank you for your interest in {property}. We'll contact you soon. - VenGrow",
      category: "Buyer",
      active: true,
      usageCount: 1234,
    },
    {
      id: "2",
      name: "Visit Booking Confirmation",
      content: "Your property visit for {property} is confirmed on {date} at {time}. See you there!",
      category: "Buyer",
      active: true,
      usageCount: 856,
    },
    {
      id: "3",
      name: "Listing Approved",
      content: "Congratulations! Your property listing '{property}' has been approved and is now live.",
      category: "Seller",
      active: true,
      usageCount: 542,
    },
    {
      id: "4",
      name: "Payment Successful",
      content: "Payment of Rs.{amount} received. Your package is now active. Invoice: {invoice_id}",
      category: "Seller",
      active: true,
      usageCount: 423,
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                SMS Templates
              </h1>
              <p className="text-muted-foreground">
                Manage SMS notification templates
              </p>
            </div>
            <Button data-testid="button-create">
              <MessageSquare className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <Badge variant="outline">{template.category}</Badge>
                      {template.active && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Used {template.usageCount} times
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-${template.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-delete-${template.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
}
