import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, Shield, Upload } from "lucide-react";
import { format } from "date-fns";

interface Verification {
  id: string;
  type: string;
  status: "verified" | "pending" | "not_submitted";
  verifiedDate?: string;
  submittedDate?: string;
}

export default function VerificationCenterPage() {
  const [, setLocation] = useLocation();

  const { data: verifications = [], isLoading } = useQuery<Verification[]>({
    queryKey: ["/api/me/verifications"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case "not_submitted":
        return <Badge variant="outline">Not Submitted</Badge>;
      default:
        return null;
    }
  };

  const handleUpload = (verificationId: string) => {
    setLocation(`/seller/verification/documents?type=${verificationId}`);
  };

  const verifiedCount = verifications.filter((v) => v.status === "verified").length;
  const totalCount = verifications.length;

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Verification Center
            </h1>
            <p className="text-muted-foreground">
              Complete your profile verification
            </p>
          </div>

          {/* Progress */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-full bg-primary/20">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Verification Progress</h3>
                <p className="text-muted-foreground">
                  {verifiedCount} of {totalCount} verifications completed
                </p>
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </Card>

          {/* Verifications List */}
          <div className="space-y-4">
            {verifications.length === 0 ? (
              <Card className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No verifications found</p>
              </Card>
            ) : (
              verifications.map((verification) => (
                <Card key={verification.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{verification.type}</h3>
                        {getStatusBadge(verification.status)}
                      </div>
                      {verification.status === "verified" && verification.verifiedDate && (
                        <p className="text-sm text-muted-foreground">
                          Verified on {format(new Date(verification.verifiedDate), "MMM dd, yyyy")}
                        </p>
                      )}
                      {verification.status === "pending" && verification.submittedDate && (
                        <p className="text-sm text-muted-foreground">
                          Submitted on {format(new Date(verification.submittedDate), "MMM dd, yyyy")}
                        </p>
                      )}
                    </div>
                  </div>

                  {verification.status === "verified" && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Document verified successfully</span>
                    </div>
                  )}

                  {verification.status === "pending" && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-900 dark:text-yellow-400">
                        Your document is under review. This typically takes 24-48 hours.
                      </p>
                    </div>
                  )}

                  {verification.status === "not_submitted" && (
                    <Button 
                      data-testid={`button-upload-${verification.id}`}
                      onClick={() => handleUpload(verification.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Help */}
          <Card className="p-6 mt-8">
            <h3 className="font-semibold mb-4">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Having trouble with verification? Contact our support team for assistance.
            </p>
            <Button 
              variant="outline"
              onClick={() => window.open("mailto:support@vengrow.com?subject=Verification Support", "_blank")}
              data-testid="button-contact-support"
            >
              Contact Support
            </Button>
          </Card>
        </div>
      </main>
  );
}
