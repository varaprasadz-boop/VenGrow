import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Upload, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { format } from "date-fns";

interface Document {
  id: string;
  name: string;
  type?: string;
  status: "verified" | "pending" | "rejected";
  uploadDate?: string;
  verifiedDate?: string;
  reason?: string;
}

export default function DocumentVerificationPage() {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/me/documents"],
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: { type: string; url: string; name: string }) => {
      return apiRequest("POST", "/api/me/documents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/verifications"] });
      toast({ title: "Document uploaded successfully" });
      setUploadDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to upload document", variant: "destructive" });
    },
  });

  const handleUpload = () => {
    setSelectedDocType("");
    setUploadDialogOpen(true);
  };

  const handleUploadComplete = (results: any[]) => {
    if (results.length === 0) return;
    
    const file = results[0];
    const docType = selectedDocType || "other";
    const docName = file.name || `${docType} Document`;

    uploadDocumentMutation.mutate({
      type: docType,
      url: file.url,
      name: docName,
    });
  };

  const handleReupload = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setSelectedDocType(doc.type || "");
      setUploadDialogOpen(true);
    }
  };

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

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </main>
    );
  }

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
            <Button data-testid="button-upload" onClick={handleUpload}>
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
            {documents.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">No Documents Uploaded</h3>
                <p className="text-muted-foreground mb-4">
                  Upload documents to verify your seller profile
                </p>
                <Button onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Document
                </Button>
              </Card>
            ) : (
              documents.map((doc) => (
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
                        {doc.type && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Type: {doc.type}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {doc.uploadDate && `Uploaded: ${format(new Date(doc.uploadDate), "MMM dd, yyyy")}`}
                          {doc.verifiedDate && ` • Verified: ${format(new Date(doc.verifiedDate), "MMM dd, yyyy")}`}
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
                        onClick={() => handleReupload(doc.id)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Re-upload Document
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Upload Dialog */}
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Document Type</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                  >
                    <option value="">Select document type</option>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="rera">RERA Certificate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <ObjectUploader
                  bucket="seller-documents"
                  prefix="verification/"
                  onComplete={handleUploadComplete}
                  maxFiles={1}
                  accept="image/*,.pdf"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
  );
}
