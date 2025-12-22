import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  User,
  Briefcase,
  AlertCircle,
  MapPin,
  FileText,
  Globe,
  Phone,
  Mail,
  Calendar,
  Shield,
  Hash,
  Building,
  Home,
} from "lucide-react";
import { format } from "date-fns";
import type { SellerProfile, User as UserType } from "@shared/schema";

const sellerTypeIcons = {
  individual: User,
  broker: Briefcase,
  builder: Building2,
} as const;

const sellerTypeLabels = {
  individual: "Individual Seller",
  broker: "Real Estate Broker",
  builder: "Builder / Developer",
} as const;

export default function SellerApprovalDetailsPage() {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data: sellerProfile, isLoading: profileLoading, isError: profileError } = useQuery<SellerProfile>({
    queryKey: ["/api/sellers", id],
    enabled: !!id,
  });

  const { data: users = [] } = useQuery<UserType[]>({
    queryKey: ["/api/admin/users"],
  });

  const sellerUser = users.find(u => u.id === sellerProfile?.userId);

  const updateVerificationMutation = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      return apiRequest("PATCH", `/api/sellers/${id}`, { verificationStatus: status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/sellers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sellers", id] });
      toast({
        title: variables.status === "verified" ? "Seller Approved" : "Seller Rejected",
        description: `The seller has been ${variables.status === "verified" ? "approved" : "rejected"} successfully.`,
      });
      navigate("/admin/seller-approvals");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    },
  });

  if (profileLoading) {
    return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Skeleton className="h-5 w-64 mb-4" />
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (profileError || !sellerProfile) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Seller Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The seller profile you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/admin/seller-approvals">
            <Button data-testid="button-back-to-list">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Seller Approvals
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const Icon = sellerTypeIcons[sellerProfile.sellerType] || User;

  const getStatusBadge = () => {
    switch (sellerProfile.verificationStatus) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{sellerProfile.verificationStatus}</Badge>;
    }
  };

  return (
    <main className="flex-1 bg-muted/30">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Breadcrumbs
          homeHref="/admin/dashboard"
          items={[
            { label: "Seller Approvals", href: "/admin/seller-approvals" },
            { label: sellerProfile.companyName || "Seller Details" },
          ]}
          className="mb-4"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/seller-approvals">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl">
                Seller Details
              </h1>
              <p className="text-muted-foreground text-sm">
                Review seller registration information
              </p>
            </div>
          </div>
          {sellerProfile.verificationStatus === "pending" && (
            <div className="flex gap-2">
              <Button
                onClick={() => updateVerificationMutation.mutate({ status: "verified" })}
                disabled={updateVerificationMutation.isPending}
                data-testid="button-approve"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateVerificationMutation.mutate({ status: "rejected" })}
                disabled={updateVerificationMutation.isPending}
                data-testid="button-reject"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 rounded-lg bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-semibold text-xl">
                    {sellerProfile.companyName || "Individual Seller"}
                  </h2>
                  {getStatusBadge()}
                </div>
                <Badge variant="outline" className="capitalize">
                  {sellerTypeLabels[sellerProfile.sellerType] || sellerProfile.sellerType}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Account Information
                </h3>
                
                {sellerUser && (
                  <>
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Account Owner</p>
                        <p className="font-medium">{sellerUser.firstName} {sellerUser.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{sellerUser.email}</p>
                      </div>
                    </div>
                    {sellerUser.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{sellerUser.phone}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Date</p>
                    <p className="font-medium">{format(new Date(sellerProfile.createdAt), "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Business Details
                </h3>
                
                {sellerProfile.companyName && (
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-medium">{sellerProfile.companyName}</p>
                    </div>
                  </div>
                )}

                {sellerProfile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a 
                        href={sellerProfile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {sellerProfile.website}
                      </a>
                    </div>
                  </div>
                )}

                {sellerProfile.description && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-medium">{sellerProfile.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellerProfile.address && (
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{sellerProfile.address}</p>
                  </div>
                </div>
              )}
              {sellerProfile.city && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{sellerProfile.city}</p>
                  </div>
                </div>
              )}
              {sellerProfile.state && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{sellerProfile.state}</p>
                  </div>
                </div>
              )}
              {sellerProfile.pincode && (
                <div className="flex items-start gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">PIN Code</p>
                    <p className="font-medium">{sellerProfile.pincode}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Verification Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellerProfile.reraNumber && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">RERA Number</p>
                    <p className="font-medium font-mono">{sellerProfile.reraNumber}</p>
                  </div>
                </div>
              )}
              {sellerProfile.gstNumber && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">GST Number</p>
                    <p className="font-medium font-mono">{sellerProfile.gstNumber}</p>
                  </div>
                </div>
              )}
              {sellerProfile.panNumber && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">PAN Number</p>
                    <p className="font-medium font-mono">{sellerProfile.panNumber}</p>
                  </div>
                </div>
              )}
              {!sellerProfile.reraNumber && !sellerProfile.gstNumber && !sellerProfile.panNumber && (
                <p className="text-muted-foreground text-sm col-span-2">
                  No verification documents provided
                </p>
              )}
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Activity Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{sellerProfile.totalListings}</p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{sellerProfile.totalSold}</p>
                <p className="text-sm text-muted-foreground">Properties Sold</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{sellerProfile.rating || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{sellerProfile.reviewCount}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Link href="/admin/seller-approvals">
              <Button variant="outline" data-testid="button-back-bottom">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </Link>
            {sellerProfile.verificationStatus === "pending" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => updateVerificationMutation.mutate({ status: "verified" })}
                  disabled={updateVerificationMutation.isPending}
                  data-testid="button-approve-bottom"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Seller
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateVerificationMutation.mutate({ status: "rejected" })}
                  disabled={updateVerificationMutation.isPending}
                  data-testid="button-reject-bottom"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Seller
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
