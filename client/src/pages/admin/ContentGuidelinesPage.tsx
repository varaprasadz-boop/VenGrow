import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

export default function ContentGuidelinesPage() {
  const guidelines = [
    {
      id: "property-description",
      title: "Property Descriptions",
      content: "Descriptions must be factual and accurate. Avoid misleading claims or exaggerated statements.",
    },
    {
      id: "photos",
      title: "Property Photos",
      content: "Photos must be recent and accurately represent the property. No stock images or misleading edits.",
    },
    {
      id: "pricing",
      title: "Pricing Information",
      content: "All prices must be clearly stated. Hidden fees or misleading pricing is not allowed.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Content Guidelines
            </h1>
            <p className="text-muted-foreground">
              Manage platform content policies and guidelines
            </p>
          </div>

          <div className="space-y-6">
            {guidelines.map((guideline) => (
              <Card key={guideline.id} className="p-6">
                <div className="mb-4">
                  <Label htmlFor={guideline.id}>{guideline.title}</Label>
                </div>
                <Textarea
                  id={guideline.id}
                  defaultValue={guideline.content}
                  rows={4}
                  data-testid={`textarea-${guideline.id}`}
                />
              </Card>
            ))}
          </div>

          <Button className="w-full mt-8" size="lg" data-testid="button-save">
            Save Guidelines
          </Button>

          <Card className="p-6 mt-8 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <h3 className="font-semibold mb-2">Note</h3>
            <p className="text-sm text-muted-foreground">
              These guidelines are shown to sellers when they create listings.
              Make sure they are clear and easy to understand.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
