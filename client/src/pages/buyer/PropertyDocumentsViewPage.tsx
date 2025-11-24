import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, CheckCircle } from "lucide-react";

export default function PropertyDocumentsViewPage() {
  const documents = [
    {
      id: "1",
      name: "Property Title Deed",
      type: "Legal",
      verified: true,
      size: "2.4 MB",
      uploadedDate: "Nov 10, 2025",
    },
    {
      id: "2",
      name: "Sale Agreement",
      type: "Legal",
      verified: true,
      size: "1.8 MB",
      uploadedDate: "Nov 10, 2025",
    },
    {
      id: "3",
      name: "Property Tax Receipts",
      type: "Financial",
      verified: true,
      size: "856 KB",
      uploadedDate: "Nov 12, 2025",
    },
    {
      id: "4",
      name: "Building Plan Approval",
      type: "Regulatory",
      verified: true,
      size: "3.2 MB",
      uploadedDate: "Nov 8, 2025",
    },
    {
      id: "5",
      name: "Occupancy Certificate",
      type: "Regulatory",
      verified: false,
      size: "1.2 MB",
      uploadedDate: "Nov 15, 2025",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property Documents
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Document Verification</h3>
                <p className="text-sm text-muted-foreground">
                  All documents have been verified by our legal team to ensure
                  authenticity and compliance.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-muted flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{doc.name}</h3>
                        {doc.verified ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending Verification</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{doc.type}</Badge>
                        <span>{doc.size}</span>
                        <span>Uploaded {doc.uploadedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-view-${doc.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-download-${doc.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
