import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

export default function DocumentsPage() {
  const [documents] = useState([
    {
      id: "1",
      name: "RERA Certificate",
      type: "PDF",
      size: "2.4 MB",
      uploadedDate: "Nov 20, 2025",
      status: "verified",
    },
    {
      id: "2",
      name: "Property Ownership Proof",
      type: "PDF",
      size: "1.8 MB",
      uploadedDate: "Nov 20, 2025",
      status: "verified",
    },
    {
      id: "3",
      name: "ID Proof - Aadhaar",
      type: "PDF",
      size: "0.9 MB",
      uploadedDate: "Nov 20, 2025",
      status: "pending",
    },
    {
      id: "4",
      name: "PAN Card",
      type: "PDF",
      size: "0.5 MB",
      uploadedDate: "Nov 19, 2025",
      status: "rejected",
      reason: "Document not clear, please re-upload",
    },
  ]);

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
            <Button data-testid="button-upload">
              <Upload className="h-4 w-4 mr-2" />
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
            {documents.map((doc) => (
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
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Uploaded {doc.uploadedDate}</span>
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
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {doc.status === "rejected" && (
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-reupload-${doc.id}`}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Re-upload
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-delete-${doc.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
