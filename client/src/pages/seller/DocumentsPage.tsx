import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Document {
  id: string;
  name: string;
  type?: string;
  url?: string;
  status: "verified" | "pending" | "rejected";
  uploadDate?: string;
  verifiedDate?: string;
  reason?: string;
}

export default function DocumentsPage() {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [replaceDocId, setReplaceDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ["/api/me/documents"],
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: {
      type: string;
      url: string;
      name: string;
      replaceId?: string;
    }) => {
      return apiRequest("POST", "/api/me/documents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/verifications"] });
      toast({ title: "Document uploaded successfully" });
      setUploadDialogOpen(false);
      setReplaceDocId(null);
      setSelectedFile(null);
    },
    onError: () => {
      toast({ title: "Failed to upload document", variant: "destructive" });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return apiRequest("DELETE", `/api/me/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/verifications"] });
      toast({ title: "Document deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete document", variant: "destructive" });
    },
  });

  const handleUpload = () => {
    setSelectedDocType("");
    setReplaceDocId(null);
    setSelectedFile(null);
    setUploadDialogOpen(true);
  };

  const handleSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    e.target.value = "";
  }, []);

  const handleRemoveFile = useCallback(() => setSelectedFile(null), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      setSelectedFile(file);
    } else {
      toast({ title: "Please select an image or PDF file", variant: "destructive" });
    }
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      toast({ title: "Please select a file first", variant: "destructive" });
      return;
    }

    const docType = selectedDocType || "other";
    const docName = selectedFile.name || `${docType} Document`;

    try {
      const urlRes = await apiRequest("POST", "/api/objects/upload?bucket=seller-documents&prefix=verification/");
      const { uploadURL } = await urlRes.json();
      if (!uploadURL) throw new Error("No upload URL received");

      const uploadUrl = uploadURL.startsWith("/") ? `${window.location.origin}${uploadURL}` : uploadURL;

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${selectedFile.name}"`,
        },
        credentials: "include",
      });

      if (!putRes.ok) {
        const err = await putRes.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }

      let fileUrl = "";
      try {
        const putData = await putRes.json();
        fileUrl = putData.url || putData.uploadURL || "";
      } catch {
        fileUrl = "";
      }

      if (!fileUrl) {
        const urlObj = new URL(uploadURL);
        fileUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
      }
      if (fileUrl.startsWith("/") && !fileUrl.startsWith("//")) {
        fileUrl = `${window.location.origin}${fileUrl}`;
      }

      uploadDocumentMutation.mutate({
        type: docType,
        url: fileUrl,
        name: docName,
        ...(replaceDocId ? { replaceId: replaceDocId } : {}),
      });
    } catch (err: unknown) {
      toast({
        title: "Failed to upload document",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const getDownloadUrl = (url: string | undefined): string => {
    if (!url) return "";
    const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;
    if (localhostPattern.test(url)) {
      try {
        const u = new URL(url);
        return `${window.location.origin}${u.pathname}${u.search}`;
      } catch {
        return url;
      }
    }
    return url.startsWith("/") ? `${window.location.origin}${url}` : url;
  };

  const handleDownload = (doc: Document) => {
    const url = doc.url ? getDownloadUrl(doc.url) : "";
    if (url) {
      window.open(url, "_blank");
    } else {
      toast({ title: "Download URL not available", variant: "destructive" });
    }
  };

  const handleDelete = (doc: Document) => {
    if (window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      deleteDocumentMutation.mutate(doc.id);
    }
  };

  const handleReupload = (doc: Document) => {
    setSelectedDocType(doc.type || "other");
    setReplaceDocId(doc.id);
    setUploadDialogOpen(true);
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
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
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
              My Documents
            </h1>
            <p className="text-muted-foreground">
              Manage your verification documents
            </p>
          </div>
          <Button
            data-testid="button-upload"
            onClick={handleUpload}
            disabled={uploadDocumentMutation.isPending}
          >
            {uploadDocumentMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Document
          </Button>
        </div>

        {/* Required Documents */}
        <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
          <h3 className="font-semibold mb-4">Required Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              "RERA Certificate (for builders/brokers)",
              "Property Ownership Proof",
              "Valid Government ID (Aadhaar/Passport)",
              "PAN Card",
            ].map((doc, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </Card>

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
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{doc.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>
                            Uploaded{" "}
                            {doc.uploadDate
                              ? format(new Date(doc.uploadDate), "MMM dd, yyyy")
                              : "—"}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>

                    {doc.status === "rejected" && doc.reason && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg mb-3">
                        <p className="text-sm text-red-900 dark:text-red-400">
                          <strong>Reason:</strong> {doc.reason}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-download-${doc.id}`}
                        onClick={() => handleDownload(doc)}
                        disabled={!doc.url}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {doc.status === "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-reupload-${doc.id}`}
                          onClick={() => handleReupload(doc)}
                          disabled={uploadDocumentMutation.isPending}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Re-upload
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-delete-${doc.id}`}
                        onClick={() => handleDelete(doc)}
                        disabled={deleteDocumentMutation.isPending}
                      >
                        {deleteDocumentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open);
          if (!open) setSelectedFile(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {replaceDocId ? "Re-upload Document" : "Upload Document"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Document Type
              </label>
              <select
                className="w-full p-2 border rounded-md bg-background"
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                File
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  selectedFile
                    ? "border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleSelectFile}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-10 w-10 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Drop file here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Images or PDF, max 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleUploadDocument}
              disabled={!selectedFile || uploadDocumentMutation.isPending}
            >
              {uploadDocumentMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
