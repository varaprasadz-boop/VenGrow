
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function PropertyStatusPage() {
  const properties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      status: "active",
      views: 1234,
      inquiries: 45,
      listingDate: "Nov 1, 2025",
      expiryDate: "Dec 1, 2025",
    },
    {
      id: "2",
      title: "Commercial Office Space",
      location: "BKC, Mumbai",
      status: "pending_approval",
      submittedDate: "Nov 20, 2025",
      reason: "Under review by moderation team",
    },
    {
      id: "3",
      title: "2BHK Flat",
      location: "Andheri East, Mumbai",
      status: "rejected",
      reason: "Missing property documents",
      rejectedDate: "Nov 18, 2025",
    },
    {
      id: "4",
      title: "4BHK Villa",
      location: "Powai, Mumbai",
      status: "expired",
      expiryDate: "Nov 15, 2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "pending_approval":
      return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case "rejected":
      return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "expired":
      return (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (


      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property Status
            </h1>
            <p className="text-muted-foreground">
              Track the status of all your property listings
            </p>
    

          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      {getStatusBadge(property.status)}
              
                    <p className="text-sm text-muted-foreground">
                      {property.location}
                    </p>
            
          

                {property.status === "active" && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Views</p>
                        <p className="font-semibold">{property.views}</p>
                
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Inquiries
                        </p>
                        <p className="font-semibold">{property.inquiries}</p>
                
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Days Left
                        </p>
                        <p className="font-semibold">7</p>
                
              
                    <p className="text-xs text-muted-foreground mb-4">
                      Listed on {property.listingDate} • Expires on{" "}
                      {property.expiryDate}
                    </p>
                  </>
                )}

                {property.status === "pending_approval" && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg mb-4">
                    <p className="text-sm text-yellow-900 dark:text-yellow-400">
                      {property.reason}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted on {property.submittedDate}
                    </p>
            
                )}

                {property.status === "rejected" && (
                  <>
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg mb-4">
                      <p className="text-sm text-red-900 dark:text-red-400">
                        {property.reason}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Rejected on {property.rejectedDate}
                      </p>
              
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-resubmit-${property.id}`}
                    >
                      Resubmit Property
                    </Button>
                  </>
                )}

                {property.status === "expired" && (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">
                      Listing expired on {property.expiryDate}
                    </p>
                    <Button
                      size="sm"
                      data-testid={`button-renew-${property.id}`}
                    >
                      Renew Listing
                    </Button>
                  </>
                )}
              </Card>
            ))}
    
  
      </main>
  );
}
