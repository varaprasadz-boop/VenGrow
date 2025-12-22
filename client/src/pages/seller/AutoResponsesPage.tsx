
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

export default function AutoResponsesPage() {
  const autoResponses = [
    {
      id: "inquiry",
      title: "Initial Inquiry Response",
      description: "Sent when a buyer makes their first inquiry",
      enabled: true,
      template: "Thank you for your interest in {property_title}. I'll get back to you within 24 hours with more details.",
    },
    {
      id: "visit-request",
      title: "Visit Request Response",
      description: "Sent when a buyer requests a site visit",
      enabled: true,
      template: "Thank you for requesting a visit to {property_title}. I'll confirm the visit timing shortly.",
    },
    {
      id: "offline",
      title: "Offline Auto-Response",
      description: "Sent when you're offline",
      enabled: false,
      template: "I'm currently unavailable. I'll respond to your message as soon as possible.",
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Auto Responses
            </h1>
            <p className="text-muted-foreground">
              Automate your responses to buyer inquiries
            </p>
          </div>

          <div className="space-y-6">
            {autoResponses.map((response) => (
              <Card key={response.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {response.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {response.description}
                    </p>
                  </div>
                  <Switch
                    defaultChecked={response.enabled}
                    data-testid={`switch-${response.id}`}
                  />
                </div>

                <div>
                  <Label htmlFor={`template-${response.id}`}>
                    Message Template
                  </Label>
                  <Textarea
                    id={`template-${response.id}`}
                    defaultValue={response.template}
                    rows={3}
                    className="mt-2"
                    data-testid={`textarea-${response.id}`}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Use {"{property_title}"} to insert property name dynamically
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-8" size="lg" data-testid="button-save">
            Save Changes
          </Button>
        </div>
      </main>
  );
}
