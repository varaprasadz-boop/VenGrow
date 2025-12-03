import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onGetUploadParameters: () => Promise<{
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

  useEffect(() => {
    const handleComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
      onComplete?.(result);
      setShowModal(false);
    };
    
    uppy.on("complete", handleComplete);
    
    return () => {
      uppy.off("complete", handleComplete);
    };
  }, [uppy, onComplete]);

  return (
    <div>
      <Button 
        onClick={() => setShowModal(true)} 
        className={buttonClassName}
        variant={buttonVariant}
        disabled={disabled}
        type="button"
        data-testid="button-open-uploader"
      >
        {children}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
          </DialogHeader>
          <div className="min-h-[400px]">
            <Dashboard
              uppy={uppy}
              hideUploadButton={false}
              proudlyDisplayPoweredByUppy={false}
              showProgressDetails={true}
              note="Images only, up to 10 MB each"
              height={350}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
