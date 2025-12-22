
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Shield, Upload } from "lucide-react";

export default function VerificationCenterPage() {
  const verifications = [
    {
      id: "1",
      type: "Email Verification",
      status: "verified",
      verifiedDate: "Nov 1, 2025",
    },
    {
      id: "2",
      type: "Phone Verification",
      status: "verified",
      verifiedDate: "Nov 1, 2025",
    },
    {
      id: "3",
      type: "ID Proof (Aadhaar)",
      status: "verified",
      verifiedDate: "Nov 3, 2025",
    },
    {
      id: "4",
      type: "PAN Card",
      status: "pending",
      submittedDate: "Nov 20, 2025",
    },
    {
      id: "5",
      type: "RERA Certificate",
      status: "not_submitted",
    },
  ];

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

  const verifiedCount = verifications.filter((v) => v.status === "verified").length;
  const totalCount = verifications.length;

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
    

          {/* Progress */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-full bg-primary/20">
                <Shield className="h-8 w-8 text-primary" />
        
              <div>
                <h3 className="font-semibold text-lg">Verification Progress</h3>
                <p className="text-muted-foreground">
                  {verifiedCount} of {totalCount} verifications completed
                </p>
        
      
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(verifiedCount / totalCount) * 100}%` }}
              />
      
          </Card>

          {/* Verifications List */}
          <div className="space-y-4">
            {verifications.map((verification) => (
              <Card key={verification.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{verification.type}</h3>
                      {getStatusBadge(verification.status)}
              
                    {verification.status === "verified" && verification.verifiedDate && (
                      <p className="text-sm text-muted-foreground">
                        Verified on {verification.verifiedDate}
                      </p>
                    )}
                    {verification.status === "pending" && verification.submittedDate && (
                      <p className="text-sm text-muted-foreground">
                        Submitted on {verification.submittedDate}
                      </p>
                    )}
            
          

                {verification.status === "verified" && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Document verified successfully</span>
            
                )}

                {verification.status === "pending" && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-900 dark:text-yellow-400">
                      Your document is under review. This typically takes 24-48 hours.
                    </p>
            
                )}

                {verification.status === "not_submitted" && (
                  <Button data-testid={`button-upload-${verification.id}`}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </Card>
            ))}
    

          {/* Help */}
          <Card className="p-6 mt-8">
            <h3 className="font-semibold mb-4">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Having trouble with verification? Contact our support team for assistance.
            </p>
            <Button variant="outline">Contact Support</Button>
          </Card>
  
      </main>
  );
}
