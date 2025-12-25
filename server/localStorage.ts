import { Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { createReadStream, existsSync, mkdirSync } from "fs";

// Check if we're running on Replit
function isRunningOnReplit(): boolean {
  return !!process.env.REPL_ID;
}

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export interface LocalFile {
  path: string;
  size: number;
  contentType?: string;
}

export class LocalStorageService {
  private storageDir: string;
  private publicDir: string;
  private baseUrl: string;

  constructor() {
    // Get storage directory from env or use default
    this.storageDir = process.env.LOCAL_STORAGE_DIR || path.join(process.cwd(), "storage");
    this.publicDir = process.env.PUBLIC_STORAGE_DIR || path.join(this.storageDir, "public");
    this.baseUrl = process.env.STORAGE_BASE_URL || "/storage";
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      this.storageDir,
      this.publicDir,
      path.join(this.storageDir, "uploads"),
      path.join(this.storageDir, "private"),
    ];

    for (const dir of dirs) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Get upload endpoint URL for direct file upload
   * Returns a URL that the frontend can POST to
   */
  async getObjectEntityUploadURL(): Promise<string> {
    // For local storage, we return a direct upload endpoint
    const uploadId = randomUUID();
    return `/api/upload/direct?uploadId=${uploadId}`;
  }

  /**
   * Save uploaded file from buffer and return the public URL
   */
  async saveUploadedFile(
    buffer: Buffer,
    originalName: string,
    userId: string,
    visibility: "public" | "private" = "public"
  ): Promise<string> {
    const uploadId = randomUUID();
    const fileExt = path.extname(originalName) || ".bin";
    const fileName = `${uploadId}${fileExt}`;
    
    const targetDir = visibility === "public" 
      ? this.publicDir 
      : path.join(this.storageDir, "private", userId);
    
    // Ensure user directory exists for private files
    if (visibility === "private") {
      if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
      }
    }

    const filePath = path.join(targetDir, fileName);
    await fs.writeFile(filePath, buffer);

    // Return the URL path
    if (visibility === "public") {
      return `${this.baseUrl}/public/${fileName}`;
    } else {
      return `${this.baseUrl}/private/${userId}/${fileName}`;
    }
  }

  /**
   * Get file from storage path
   */
  async getObjectEntityFile(objectPath: string): Promise<LocalFile> {
    // Parse the object path
    // Format: /storage/public/filename or /storage/private/userId/filename
    const normalizedPath = objectPath.startsWith("/storage") 
      ? objectPath 
      : `/storage${objectPath.startsWith("/") ? "" : "/"}${objectPath}`;

    const pathParts = normalizedPath.split("/").filter(p => p);
    
    if (pathParts.length < 3) {
      throw new ObjectNotFoundError();
    }

    let filePath: string;
    if (pathParts[1] === "public") {
      filePath = path.join(this.publicDir, ...pathParts.slice(2));
    } else if (pathParts[1] === "private") {
      filePath = path.join(this.storageDir, "private", ...pathParts.slice(2));
    } else {
      throw new ObjectNotFoundError();
    }

    if (!existsSync(filePath)) {
      throw new ObjectNotFoundError();
    }

    const stats = await fs.stat(filePath);
    
    // Determine content type from file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".json": "application/json",
    };
    const contentType = contentTypeMap[ext] || "application/octet-stream";

    return {
      path: filePath,
      size: stats.size,
      contentType,
    };
  }

  /**
   * Search for public file
   */
  async searchPublicObject(filePath: string): Promise<LocalFile | null> {
    const fullPath = path.join(this.publicDir, filePath);
    
    if (!existsSync(fullPath)) {
      return null;
    }

    const stats = await fs.stat(fullPath);
    
    // Determine content type from file extension
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".json": "application/json",
    };
    const contentType = contentTypeMap[ext] || "application/octet-stream";

    return {
      path: fullPath,
      size: stats.size,
      contentType,
    };
  }

  /**
   * Download/serve file
   */
  async downloadObject(file: LocalFile, res: Response, cacheTtlSec: number = 3600) {
    try {
      res.set({
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Length": file.size.toString(),
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      const stream = createReadStream(file.path);
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  /**
   * Normalize object path (for compatibility)
   */
  normalizeObjectEntityPath(rawPath: string): string {
    // If it's already a local path, return as-is
    if (rawPath.startsWith("/storage/") || rawPath.startsWith(this.baseUrl)) {
      return rawPath;
    }

    // If it's a full URL, extract the path
    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
      try {
        const url = new URL(rawPath);
        return url.pathname;
      } catch {
        return rawPath;
      }
    }

    // Assume it's a relative path
    return `${this.baseUrl}/public/${rawPath}`;
  }

  /**
   * Set ACL policy (for compatibility - local storage is always accessible)
   */
  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: { owner: string; visibility: "public" | "private" }
  ): Promise<string> {
    // For local storage, we just normalize the path
    // The file should already be uploaded to the correct location
    return this.normalizeObjectEntityPath(rawPath);
  }

  /**
   * Check if object can be accessed (for compatibility)
   */
  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: LocalFile;
    requestedPermission?: "read" | "write" | "delete";
  }): Promise<boolean> {
    // For local storage, public files are always accessible
    // Private files should check ownership (implement if needed)
    return true;
  }
}

