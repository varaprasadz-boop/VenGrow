
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, X } from "lucide-react";

export default function PropertyTagsPage() {
  const currentTags = [
    "Luxury",
    "Sea View",
    "Gated Community",
    "Pet Friendly",
    "Spacious",
    "Modern",
  ];

  const suggestedTags = [
    "Family Friendly",
    "Near Metro",
    "Swimming Pool",
    "Gym",
    "24/7 Security",
  ];

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Tag className="h-8 w-8 text-primary" />
              Property Tags
            </h1>
            <p className="text-muted-foreground">
              Add tags to improve discoverability
            </p>
          </div>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Current Tags</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {currentTags.map((tag, index) => (
                <Badge
                  key={index}
                  className="px-3 py-2 text-sm"
                  variant="outline"
                >
                  {tag}
                  <X className="h-3 w-3 ml-2 cursor-pointer" />
                </Badge>
              ))}
            </div>

            <div>
              <Label htmlFor="newTag">Add New Tag</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="newTag"
                  placeholder="Enter tag name"
                  data-testid="input-new-tag"
                />
                <Button data-testid="button-add-tag">
                  <Tag className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Suggested Tags</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag, index) => (
                <Badge
                  key={index}
                  className="px-3 py-2 text-sm cursor-pointer hover-elevate"
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
}
