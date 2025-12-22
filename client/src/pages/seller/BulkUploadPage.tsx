
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, CheckCircle, XCircle, Clock } from "lucide-react";

export default function BulkUploadPage() {
  const uploadHistory = [
    {
      id: "1",
      filename: "properties_batch_1.csv",
      uploadedDate: "Nov 20, 2025",
      total: 50,
      successful: 48,
      failed: 2,
      status: "completed",
    },
    {
      id: "2",
      filename: "properties_batch_2.csv",
      uploadedDate: "Nov 18, 2025",
      total: 30,
      successful: 30,
      failed: 0,
      status: "completed",
    },
    {
      id: "3",
      filename: "properties_batch_3.csv",
      uploadedDate: "Nov 24, 2025",
      total: 100,
      successful: 0,
      failed: 0,
      status: "processing",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            <Clock className="h-3 w-3 mr-1" />
            Processing
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
              Bulk Property Upload
            </h1>
            <p className="text-muted-foreground">
              Upload multiple properties at once using CSV file
            </p>
          </div>

          {/* Upload Area */}
          <Card className="p-12 mb-8 border-dashed border-2">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">
                Upload CSV File
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop your CSV file here or click to browse
              </p>
              <div className="flex gap-4 justify-center">
                <Button data-testid="button-upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button variant="outline" data-testid="button-template">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-4">Upload Instructions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Download the CSV template and fill in property details</li>
              <li>• Maximum 100 properties per upload</li>
              <li>• Ensure all required fields are filled</li>
              <li>• File size should not exceed 10MB</li>
              <li>• Processing time: ~2-5 minutes per batch</li>
            </ul>
          </Card>

          {/* Upload History */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Upload History</h2>
            <div className="space-y-4">
              {uploadHistory.map((upload) => (
                <Card key={upload.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{upload.filename}</h3>
                        {getStatusBadge(upload.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {upload.uploadedDate}
                      </p>
                    </div>
                  </div>

                  {upload.status === "completed" && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Total</p>
                        <p className="font-semibold">{upload.total}</p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Successful
                        </p>
                        <p className="font-semibold text-green-600">
                          {upload.successful}
                        </p>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Failed</p>
                        <p className="font-semibold text-red-600">
                          {upload.failed}
                        </p>
                      </div>
                    </div>
                  )}

                  {upload.status === "processing" && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-400">
                        Processing {upload.total} properties. This may take a few
                        minutes...
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
  );
}
