import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Download, Plus } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { Property } from "@shared/schema";

export default function PropertySoldPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const propertyId = params.id;

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const handleDownloadReport = () => {
    if (!property) return;
    
    const reportContent = `
PROPERTY SOLD REPORT
====================

Property: ${property.title}
Location: ${property.locality || ''}, ${property.city}
Sold Date: ${property.updatedAt ? format(new Date(property.updatedAt), "MMM dd, yyyy") : "N/A"}
Original Price: ₹${(property.price || 0).toLocaleString("en-IN")}
Total Views: ${property.viewCount || 0}
Total Inquiries: ${property.inquiryCount || 0}
Time Listed: ${property.createdAt && property.updatedAt 
  ? `${differenceInDays(new Date(property.updatedAt), new Date(property.createdAt))} days`
  : "N/A"}

Thank you for using VenGrow!
`;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `property-sold-report-${property.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleListAnother = () => {
    setLocation("/seller/property/add");
  };

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-64 mb-8" />
          <Skeleton className="h-48 mb-8" />
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Property not found</p>
          </Card>
        </div>
      </main>
    );
  }

  const soldDate = property.updatedAt ? format(new Date(property.updatedAt), "MMM dd, yyyy") : "N/A";
  const timeListed = property.createdAt && property.updatedAt 
    ? `${differenceInDays(new Date(property.updatedAt), new Date(property.createdAt))} days`
    : "N/A";
  const propertyLocation = `${property.locality || ''}, ${property.city}`.replace(/^, /, '');

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              Property Sold!
            </h1>
            <p className="text-muted-foreground">
              Congratulations on your successful sale
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="font-serif font-bold text-2xl mb-2">
                {property.title}
              </h2>
              <p className="text-muted-foreground mb-4">{propertyLocation}</p>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-5xl font-bold text-green-600">
                  ₹{(property.price || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Sold Date</h3>
              <p className="text-xl font-bold">{soldDate}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Time on Market</h3>
              <p className="text-xl font-bold">{timeListed}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Total Views</h3>
              <p className="text-xl font-bold">{(property.viewCount || 0).toLocaleString()}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Total Inquiries</h3>
              <p className="text-xl font-bold">{property.inquiryCount || 0}</p>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button className="flex-1" data-testid="button-list-another" onClick={handleListAnother}>
              <Plus className="h-4 w-4 mr-2" />
              List Another Property
            </Button>
          </div>
        </div>
      </main>
    );
}
