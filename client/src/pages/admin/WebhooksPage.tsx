import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Webhook, Plus, Edit, Trash2 } from "lucide-react";

export default function WebhooksPage() {
  const webhooks = [
    {
      id: "1",
      url: "https://example.com/webhook/new-listing",
      event: "listing.created",
      status: "active",
      lastTriggered: "2 hours ago",
    },
    {
      id: "2",
      url: "https://example.com/webhook/payment",
      event: "payment.success",
      status: "active",
      lastTriggered: "1 day ago",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
                <Webhook className="h-8 w-8 text-primary" />
                Webhooks
              </h1>
              <p className="text-muted-foreground">
                Configure webhooks for platform events
              </p>
            </div>
            <Button data-testid="button-add">
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>

          {/* Add New Webhook */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Create New Webhook</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://example.com/webhook"
                  data-testid="input-url"
                />
              </div>
              <div>
                <Label htmlFor="event">Event Type</Label>
                <Input
                  id="event"
                  placeholder="e.g., listing.created"
                  data-testid="input-event"
                />
              </div>
            </div>
          </Card>

          {/* Existing Webhooks */}
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                        {webhook.status}
                      </Badge>
                      <code className="text-sm px-2 py-1 bg-muted rounded">
                        {webhook.event}
                      </code>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground mb-2">
                      {webhook.url}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last triggered: {webhook.lastTriggered}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-${webhook.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-delete-${webhook.id}`}
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
