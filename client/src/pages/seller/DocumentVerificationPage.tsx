
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle, XCircle, Clock } from "lucide-react";

export default function DocumentVerificationPage() {
  const documents = [
    {
      id: "1",
      name: "Property Title Deed",
      propertyId: "PROP001",
      propertyName: "Luxury 3BHK Apartment",
      status: "verified",
      uploadDate: "Nov 15, 2025",
      verifiedDate: "Nov 16, 2025",
    },
    {
      id: "2",
      name: "NOC from Society",
      propertyId: "PROP001",
      propertyName: "Luxury 3BHK Apartment",
      status: "pending",
      uploadDate: "Nov 20, 2025",
    },
    {
      id: "3",
      name: "Property Tax Receipt",
      propertyId: "PROP002",
      propertyName: "Commercial Office Space",
      status: "rejected",
      uploadDate: "Nov 18, 2025",
      reason: "Document image is not clear. Please upload a better quality scan.",
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
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (


      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Document Verification
              </h1>
              <p className="text-muted-foreground">
                Upload and manage property documents
              </p>
            </div>
            <Button data-testid="button-upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {documents.filter((d) => d.status === "verified").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {documents.filter((d) => d.status === "pending").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {documents.filter((d) => d.status === "rejected").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{doc.name}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Property: {doc.propertyName} (#{doc.propertyId})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {doc.uploadDate}
                        {doc.verifiedDate && ` • Verified: ${doc.verifiedDate}`}
                      </p>
                    </div>
                  </div>
                </div>

                {doc.status === "verified" && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-lg">
                    <p className="text-sm text-green-900 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Document verified successfully
                    </p>
                  </div>
                )}

                {doc.status === "pending" && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-900 dark:text-yellow-400">
                      Document is under review. This usually takes 24-48 hours.
                    </p>
                  </div>
                )}

                {doc.status === "rejected" && doc.reason && (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                      <p className="text-sm text-red-900 dark:text-red-400 flex items-start gap-2">
                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{doc.reason}</span>
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-reupload-${doc.id}`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Re-upload Document
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
