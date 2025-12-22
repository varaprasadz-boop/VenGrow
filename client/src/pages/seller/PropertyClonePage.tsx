
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export default function PropertyClonePage() {
  const property = {
    id: "123",
    title: "Luxury 3BHK Apartment",
    location: "Bandra West, Mumbai",
    price: "₹85 L",
    bedrooms: 3,
    bathrooms: 2,
    area: "1200 sq ft",
  };

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Copy className="h-8 w-8 text-primary" />
              Clone Property
            </h1>
            <p className="text-muted-foreground">
              Create a duplicate listing with the same details
            </p>
    

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">Original Property</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{property.title}</p>
        
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{property.location}</p>
          
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-primary">{property.price}</p>
          
        
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="font-medium">{property.bedrooms}</p>
          
                <div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="font-medium">{property.bathrooms}</p>
          
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-medium">{property.area}</p>
          
        
      
          </Card>

          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-2">What will be cloned?</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Property details and description</li>
              <li>• Pricing and amenities</li>
              <li>• Photos and documents</li>
              <li>• Contact preferences</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              You can edit any details after cloning.
            </p>
          </Card>

          <Button className="w-full" size="lg" data-testid="button-clone">
            <Copy className="h-4 w-4 mr-2" />
            Clone This Property
          </Button>
  
      </main>
  );
}
