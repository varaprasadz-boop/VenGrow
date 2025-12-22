
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function PropertyBrandingPage() {
  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              Property Branding
            </h1>
            <p className="text-muted-foreground">
              Create a unique brand identity for your property
            </p>
    

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Branding Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brandName">Property Brand Name</Label>
                <Input
                  id="brandName"
                  defaultValue="Bandra Heights Residency"
                  data-testid="input-brand-name"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Create a memorable name for your property
                </p>
        
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  defaultValue="Luxury Living at its Finest"
                  data-testid="input-tagline"
                />
        
              <div>
                <Label htmlFor="story">Property Story</Label>
                <Textarea
                  id="story"
                  defaultValue="A premium residential complex offering the perfect blend of modern amenities and coastal living."
                  rows={4}
                  data-testid="input-story"
                />
        
      
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Visual Identity</h3>
            <div className="space-y-4">
              <div>
                <Label>Property Logo</Label>
                <div className="mt-2 p-12 border-2 border-dashed rounded-lg text-center cursor-pointer hover-elevate">
                  <p className="text-sm text-muted-foreground">
                    Upload logo (Max 2MB, PNG/SVG)
                  </p>
          
        
              <div>
                <Label htmlFor="brandColor">Brand Color</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Input
                    id="brandColor"
                    type="text"
                    defaultValue="#FF6B35"
                    data-testid="input-brand-color"
                  />
                  <div
                    className="w-16 h-12 rounded border-2"
                    style={{ backgroundColor: "#FF6B35" }}
                  />
          
        
      
          </Card>

          <Button className="w-full" size="lg" data-testid="button-save">
            Save Branding
          </Button>
  
      </main>
  );
}
