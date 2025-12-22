
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus, Edit, Trash2 } from "lucide-react";

export default function QuickRepliesPage() {
  const quickReplies = [
    {
      id: "1",
      shortcut: "/price",
      message: "The property is priced at {property_price}. This is a competitive rate for the area.",
    },
    {
      id: "2",
      shortcut: "/visit",
      message: "I'd be happy to schedule a property visit. When would be convenient for you?",
    },
    {
      id: "3",
      shortcut: "/docs",
      message: "All property documents are verified and available. I can share them after the visit.",
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              Quick Replies
            </h1>
            <p className="text-muted-foreground">
              Save time with pre-written message templates
            </p>
          </div>

          {/* Add New */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Quick Reply
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="shortcut">Shortcut (e.g., /price)</Label>
                <Input
                  id="shortcut"
                  placeholder="/keyword"
                  data-testid="input-shortcut"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your quick reply message..."
                  rows={3}
                  data-testid="textarea-message"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use {"{property_price}"}, {"{property_title}"} for dynamic content
                </p>
              </div>
              <Button data-testid="button-create">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </Card>

          {/* Existing Replies */}
          <div className="space-y-4">
            {quickReplies.map((reply) => (
              <Card key={reply.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                        {reply.shortcut}
                      </code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {reply.message}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-${reply.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-delete-${reply.id}`}
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
