import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
  Flag,
} from "lucide-react";

export default function ListingModerationPage() {
  const [selectedTab, setSelectedTab] = useState("pending");

  const listings = [
    {
      id: "L-001",
      title: "Luxury 3BHK Apartment in Prime Location",
      seller: "Prestige Estates",
      sellerType: "Builder",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      propertyType: "Apartment",
      status: "pending",
      submittedDate: "Nov 24, 2025",
      photosCount: 12,
    },
    {
      id: "L-002",
      title: "Commercial Office Space in IT Park",
      seller: "DLF Properties",
      sellerType: "Builder",
      location: "Cyber City, Gurgaon",
      price: "₹1.5 Cr",
      propertyType: "Commercial",
      status: "pending",
      submittedDate: "Nov 23, 2025",
      photosCount: 8,
    },
    {
      id: "L-003",
      title: "Beautiful Villa with Garden",
      seller: "John Smith",
      sellerType: "Individual",
      location: "Whitefield, Bangalore",
      price: "₹1.25 Cr",
      propertyType: "Villa",
      status: "approved",
      submittedDate: "Nov 22, 2025",
      photosCount: 15,
    },
    {
      id: "L-004",
      title: "2BHK Flat for Rent",
      seller: "Ramesh Kumar",
      sellerType: "Individual",
      location: "Andheri East, Mumbai",
      price: "₹35,000/mo",
      propertyType: "Apartment",
      status: "rejected",
      submittedDate: "Nov 21, 2025",
      photosCount: 5,
      rejectionReason: "Property photos are unclear and misleading",
    },
    {
      id: "L-005",
      title: "Premium Penthouse with City View",
      seller: "Real Estate Pro",
      sellerType: "Broker",
      location: "Powai, Mumbai",
      price: "₹2.5 Cr",
      propertyType: "Apartment",
      status: "flagged",
      submittedDate: "Nov 20, 2025",
      photosCount: 10,
      flagReason: "Reported by user for suspicious pricing",
      reports: 2,
    },
  ];

  const filterListings = () => {
    return listings.filter((l) => l.status === selectedTab);
  };

  const filteredListings = filterListings();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Listing Moderation
            </h1>
            <p className="text-muted-foreground">
              Review and moderate property listings
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({listings.filter((l) => l.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="flagged" data-testid="tab-flagged">
                Flagged ({listings.filter((l) => l.status === "flagged").length})
              </TabsTrigger>
              <TabsTrigger value="approved" data-testid="tab-approved">
                Approved ({listings.filter((l) => l.status === "approved").length})
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected">
                Rejected ({listings.filter((l) => l.status === "rejected").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Listing Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {listing.title}
                                </h3>
                                {listing.status === "pending" && (
                                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending Review
                                  </Badge>
                                )}
                                {listing.status === "approved" && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approved
                                  </Badge>
                                )}
                                {listing.status === "rejected" && (
                                  <Badge variant="destructive">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Rejected
                                  </Badge>
                                )}
                                {listing.status === "flagged" && (
                                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
                                    <Flag className="h-3 w-3 mr-1" />
                                    Flagged ({listing.reports} reports)
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge variant="outline">{listing.propertyType}</Badge>
                                <Badge variant="outline">{listing.sellerType}</Badge>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {listing.location}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="font-medium text-primary">
                                    {listing.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>Seller: {listing.seller}</span>
                          <span>•</span>
                          <span>{listing.photosCount} photos</span>
                          <span>•</span>
                          <span>Submitted {listing.submittedDate}</span>
                        </div>

                        {listing.rejectionReason && (
                          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive">
                              <strong>Rejection Reason:</strong> {listing.rejectionReason}
                            </p>
                          </div>
                        )}

                        {listing.flagReason && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-500">
                              <strong>Flag Reason:</strong> {listing.flagReason}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none"
                          data-testid={`button-view-${listing.id}`}
                        >
                          <Eye className="h-4 w-4 lg:mr-2" />
                          <span className="hidden lg:inline">View Listing</span>
                        </Button>
                        {(listing.status === "pending" || listing.status === "flagged") && (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 lg:flex-none"
                              data-testid={`button-approve-${listing.id}`}
                            >
                              <CheckCircle className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Approve</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              data-testid={`button-reject-${listing.id}`}
                            >
                              <XCircle className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Reject</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredListings.length === 0 && (
                <div className="text-center py-16">
                  <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No {selectedTab} listings
                  </h3>
                  <p className="text-muted-foreground">
                    There are currently no {selectedTab} property listings
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
