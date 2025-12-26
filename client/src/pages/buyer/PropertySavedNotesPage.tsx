import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Edit, Trash2 } from "lucide-react";

export default function PropertySavedNotesPage() {
  const notes = [
    {
      id: "1",
      property: "Luxury 3BHK Apartment, Bandra West",
      note: "Great location, close to schools. Need to check parking availability. Ask about maintenance charges.",
      createdAt: "Nov 20, 2025",
      updatedAt: "Nov 22, 2025",
    },
    {
      id: "2",
      property: "Commercial Office Space, BKC",
      note: "Perfect for our team of 50. Good connectivity. Rent seems slightly high, try to negotiate.",
      createdAt: "Nov 18, 2025",
      updatedAt: "Nov 18, 2025",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Property Notes
            </h1>
            <p className="text-muted-foreground">
              Keep track of your thoughts about each property
            </p>
          </div>

          {/* Add New Note */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Add New Note</h3>
            <Textarea
              placeholder="Write your notes here..."
              className="mb-4"
              rows={4}
              data-testid="textarea-note"
            />
            <Button data-testid="button-save-note">Save Note</Button>
          </Card>

          {/* Existing Notes */}
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{note.property}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {note.note}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created: {note.createdAt}</span>
                      {note.createdAt !== note.updatedAt && (
                        <span>Updated: {note.updatedAt}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-${note.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-delete-${note.id}`}
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

      <BuyerBottomNav />
    </div>
  );
}
