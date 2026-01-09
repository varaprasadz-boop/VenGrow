import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, CheckCircle, XCircle, Clock, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface UploadResult {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
}

export default function BulkUploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/properties/bulk-upload/template", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "property-bulk-upload-template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Template downloaded",
        description: "CSV template has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      toast({
        title: "Error",
        description: "Failed to download template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should not exceed 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      // Read file as text
      const fileContent = await selectedFile.text();

      // Send to server
      const response = await fetch("/api/properties/bulk-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          csvData: fileContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadResult(data.results);
      setSelectedFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/subscription"] });

      toast({
        title: "Upload completed",
        description: data.message || `Processed ${data.results.total} properties: ${data.results.successful} successful, ${data.results.failed} failed`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
        <Card
          className={`p-12 mb-8 border-dashed border-2 transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : selectedFile
              ? "border-green-500 bg-green-50/50 dark:bg-green-900/10"
              : "border-gray-300 dark:border-gray-700"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">
              {selectedFile ? "File Selected" : "Upload CSV File"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedFile
                ? selectedFile.name
                : "Drag & drop your CSV file here or click to browse"}
            </p>
            <div className="flex gap-4 justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
                id="csv-upload"
              />
              <Button
                data-testid="button-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? "Change File" : "Choose File"}
              </Button>
              <Button
                variant="outline"
                data-testid="button-template"
                onClick={handleDownloadTemplate}
                disabled={isUploading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUploading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Upload Results */}
        {uploadResult && (
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">Upload Results</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="font-semibold text-2xl">{uploadResult.total}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Successful</p>
                <p className="font-semibold text-2xl text-green-600">
                  {uploadResult.successful}
                </p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Failed</p>
                <p className="font-semibold text-2xl text-red-600">
                  {uploadResult.failed}
                </p>
              </div>
            </div>

            {uploadResult.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Errors ({uploadResult.errors.length})
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {uploadResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-900/20"
                    >
                      <p className="text-sm">
                        <span className="font-semibold">Row {error.row}:</span>{" "}
                        {error.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
          <h3 className="font-semibold mb-4">Upload Instructions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Download the CSV template and fill in property details</li>
            <li>• Maximum 100 properties per upload</li>
            <li>• Required fields: title, city, state, address, propertyType, transactionType, price, area</li>
            <li>• File size should not exceed 10MB</li>
            <li>• Processing time: ~2-5 minutes per batch</li>
            <li>• Properties will be created as drafts and need to be submitted for approval</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
