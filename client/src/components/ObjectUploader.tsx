import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onGetUploadParameters: (file?: any) => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  children: ReactNode;
  disabled?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: "pending" | "uploading" | "success" | "error";
  error?: string;
  finalURL?: string;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760,
  allowedFileTypes = ["image/*"],
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  buttonVariant = "default",
  children,
  disabled = false,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const shouldAutoUploadRef = useRef(false);

  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes,
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
      })
  );

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = Array.from(selectedFiles)
      .slice(0, maxNumberOfFiles - files.length)
      .map((file) => {
        const fileWithPreview: FileWithPreview = file;
        fileWithPreview.preview = URL.createObjectURL(file);
        fileWithPreview.uploadStatus = "pending";
        fileWithPreview.uploadProgress = 0;
        return fileWithPreview;
      });

    setFiles((prev) => [...prev, ...newFiles]);
    
    // Mark that we should auto-upload after modal closes
    shouldAutoUploadRef.current = true;
    
    // Don't close modal immediately - let user see upload progress/errors
    // Modal will close automatically after successful upload or user can close manually
  }, [files.length, maxNumberOfFiles]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  // Remove file
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Clean up object URLs
      if (prev[index]?.preview) {
        URL.revokeObjectURL(prev[index].preview!);
      }
      return updated;
    });
  }, []);

  // Upload files
  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const uploadPromise = (async () => {
        try {
          setFiles((prev) => {
            const updated = [...prev];
            updated[i] = { ...updated[i], uploadStatus: "uploading", uploadProgress: 0 };
            return updated;
          });

          // Get upload parameters
          const uploadParams = await onGetUploadParameters(file);
          
          // Check if this is a local storage endpoint (starts with /api/upload/direct)
          const isLocalStorage = uploadParams.url.startsWith("/api/upload/direct");
          
          if (isLocalStorage) {
            // For local storage, use PUT with raw file data
            const xhr = new XMLHttpRequest();
            
            return new Promise<void>((resolve, reject) => {
              xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                  const progress = Math.round((e.loaded / e.total) * 100);
                  setFiles((prev) => {
                    const updated = [...prev];
                    updated[i] = { ...updated[i], uploadProgress: progress };
                    return updated;
                  });
                }
              });

              xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  try {
                    const response = JSON.parse(xhr.responseText);
                    // For local storage, the response contains the URL
                    // The URL might be a relative path like /storage/public/... or full URL
                    let finalURL = response.url || response.uploadURL;
                    
                    // If it's a relative path, make it absolute by prepending the origin
                    if (finalURL && finalURL.startsWith("/")) {
                      finalURL = `${window.location.origin}${finalURL}`;
                    }

                    setFiles((prev) => {
                      const updated = [...prev];
                      updated[i] = {
                        ...updated[i],
                        uploadStatus: "success",
                        uploadProgress: 100,
                        finalURL: finalURL || uploadParams.url,
                      };
                      return updated;
                    });
                    resolve();
                  } catch (e) {
                    // If response is not JSON, try to use the upload URL as final URL
                    let finalURL = uploadParams.url;
                    if (finalURL.startsWith("/")) {
                      finalURL = `${window.location.origin}${finalURL.split("?")[0]}`;
                    } else {
                      try {
                        const urlObj = new URL(uploadParams.url);
                        finalURL = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
                      } catch (parseError) {
                        // Keep original URL if parsing fails
                      }
                    }
                    
                    setFiles((prev) => {
                      const updated = [...prev];
                      updated[i] = {
                        ...updated[i],
                        uploadStatus: "success",
                        uploadProgress: 100,
                        finalURL,
                      };
                      return updated;
                    });
                    resolve();
                  }
                } else {
                  let errorMessage = `Upload failed with status ${xhr.status}`;
                  try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.error || errorResponse.message || errorMessage;
                    if (errorResponse.details && process.env.NODE_ENV === 'development') {
                      errorMessage += `: ${errorResponse.details}`;
                    }
                  } catch (e) {
                    // If response is not JSON, use the response text or default message
                    if (xhr.responseText) {
                      errorMessage = xhr.responseText;
                    }
                  }
                  throw new Error(errorMessage);
                }
              });

              xhr.addEventListener("error", () => {
                setFiles((prev) => {
                  const updated = [...prev];
                  updated[i] = {
                    ...updated[i],
                    uploadStatus: "error",
                    error: "Upload failed",
                  };
                  return updated;
                });
                reject(new Error("Upload failed"));
              });

              xhr.open("PUT", uploadParams.url);
              // Set content type and disposition headers for local storage
              if (file.type) {
                xhr.setRequestHeader("Content-Type", file.type);
              }
              xhr.setRequestHeader("Content-Disposition", `attachment; filename="${file.name}"`);
              xhr.send(file);
            });
          } else {
            // For Replit storage, use PUT with signed URL
            const xhr = new XMLHttpRequest();
            
            return new Promise<void>((resolve, reject) => {
              xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                  const progress = Math.round((e.loaded / e.total) * 100);
                  setFiles((prev) => {
                    const updated = [...prev];
                    updated[i] = { ...updated[i], uploadProgress: progress };
                    return updated;
                  });
                }
              });

              xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  // Extract final URL from upload URL
                  let finalURL = uploadParams.url;
                  try {
                    const urlObj = new URL(uploadParams.url);
                    finalURL = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
                  } catch (e) {
                    // Keep original URL if parsing fails
                  }

                  setFiles((prev) => {
                    const updated = [...prev];
                    updated[i] = {
                      ...updated[i],
                      uploadStatus: "success",
                      uploadProgress: 100,
                      finalURL,
                    };
                    return updated;
                  });
                  resolve();
                } else {
                  throw new Error(`Upload failed with status ${xhr.status}`);
                }
              });

              xhr.addEventListener("error", () => {
                setFiles((prev) => {
                  const updated = [...prev];
                  updated[i] = {
                    ...updated[i],
                    uploadStatus: "error",
                    error: "Upload failed",
                  };
                  return updated;
                });
                reject(new Error("Upload failed"));
              });

              xhr.open(uploadParams.method, uploadParams.url);
              xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
              xhr.send(file);
            });
          }
        } catch (error: any) {
          setFiles((prev) => {
            const updated = [...prev];
            updated[i] = {
              ...updated[i],
              uploadStatus: "error",
              error: error.message || "Upload failed",
            };
            return updated;
          });
          throw error;
        }
      })();

      uploadPromises.push(uploadPromise);
    }

    try {
      await Promise.all(uploadPromises);
      
      // Get the current files state to prepare result
      const currentFiles = files;
      
      // Prepare result for onComplete callback
      const successful = currentFiles
        .map((file, index) => {
          // Get the final URL - prefer finalURL from upload response, fallback to preview
          const finalURL = file.finalURL || file.preview;
          
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            source: finalURL,
            url: finalURL,
            uploadURL: finalURL,
            meta: { 
              finalURL: finalURL,
              uploadURL: finalURL,
            },
            response: {
              url: finalURL,
              uploadURL: finalURL,
            },
          };
        })
        .filter((_, index) => currentFiles[index].uploadStatus === "success");

      const failed = currentFiles
        .map((file, index) => ({
          name: file.name,
          error: { message: file.error || "Upload failed" },
        }))
        .filter((_, index) => currentFiles[index].uploadStatus === "error");

      // Call onComplete with the result
      if (onComplete) {
        onComplete({
          successful,
          failed,
        } as UploadResult<Record<string, unknown>, Record<string, unknown>>);
      }

      // Clear files after upload completes
      setTimeout(() => {
        setFiles([]);
        setIsUploading(false);
      }, 500);
    } catch (error) {
      setIsUploading(false);
    }
  }, [files, onGetUploadParameters, onComplete]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Auto-upload files when files are selected
  useEffect(() => {
    if (shouldAutoUploadRef.current && files.length > 0 && !isUploading && showModal) {
      const hasPendingFiles = files.some(f => f.uploadStatus === "pending");
      if (hasPendingFiles) {
        shouldAutoUploadRef.current = false;
        // Auto-upload files when modal is open
        handleUpload();
      }
    }
  }, [files.length, isUploading, showModal, handleUpload]);

  // Close modal automatically after all files are successfully uploaded
  useEffect(() => {
    if (files.length > 0 && !isUploading) {
      const allSuccessful = files.every(f => f.uploadStatus === "success");
      const hasErrors = files.some(f => f.uploadStatus === "error");
      
      // Only auto-close if all files are successful (not if there are errors)
      if (allSuccessful && !hasErrors) {
        // Close after a short delay to show success state
        const timer = setTimeout(() => {
          setShowModal(false);
          // Clear files after modal closes
          setTimeout(() => {
            setFiles([]);
          }, 300);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [files, isUploading]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const canUpload = files.length > 0 && files.every((f) => f.uploadStatus !== "uploading");
  const allUploaded = files.length > 0 && files.every((f) => f.uploadStatus === "success");

  return (
    <div>
      <Button 
        onClick={() => {
          shouldAutoUploadRef.current = false;
          setShowModal(true);
        }} 
        className={buttonClassName}
        variant={buttonVariant}
        disabled={disabled}
        type="button"
        data-testid="button-open-uploader"
      >
        {children}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Upload Photos</DialogTitle>
            <DialogDescription>
              Upload high-quality images. Maximum {maxNumberOfFiles} file{maxNumberOfFiles > 1 ? "s" : ""}, up to {formatFileSize(maxFileSize)} each.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Drop Zone */}
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                files.length > 0 && "p-6"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={maxNumberOfFiles > 1}
                accept={allowedFileTypes.join(",")}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {files.length === 0 ? (
                <div className="space-y-4">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Drop files here or click to browse
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {allowedFileTypes.includes("image/*") ? "Images" : "Files"} only, up to {formatFileSize(maxFileSize)} each
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to add more files ({files.length}/{maxNumberOfFiles})
                  </p>
                </div>
              )}
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Selected Files ({files.length})</h4>
                  {files.length < maxNumberOfFiles && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add More
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-lg p-4 space-y-3 bg-card"
                    >
                      {/* Preview */}
                      {file.preview && (
                        <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          {file.uploadStatus === "success" && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                          )}
                          {file.uploadStatus === "error" && (
                            <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                              <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                          )}
                          {file.uploadStatus === "uploading" && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* File Info */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          {file.uploadStatus !== "uploading" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {file.uploadStatus === "uploading" && (
                          <div className="space-y-1">
                            <Progress value={file.uploadProgress || 0} className="h-2" />
                            <p className="text-xs text-muted-foreground text-center">
                              {file.uploadProgress || 0}%
                            </p>
                          </div>
                        )}

                        {/* Error Message */}
                        {file.uploadStatus === "error" && file.error && (
                          <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                              <span>{file.error}</span>
                            </div>
                          </div>
                        )}

                        {/* Success Message */}
                        {file.uploadStatus === "success" && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Uploaded successfully
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!canUpload || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : allUploaded ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Done
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {files.length} File{files.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
