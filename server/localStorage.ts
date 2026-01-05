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
    // For VPS, use /var/www/storage, otherwise use local storage directory
    const defaultStorageDir = process.env.NODE_ENV === 'production' 
      ? '/var/www/storage'
      : path.join(process.cwd(), "storage");
    
    let storageDir = process.env.LOCAL_STORAGE_DIR || defaultStorageDir;
    
    // In development, if the configured storage dir is a system path and we can't write to it,
    // fall back to a local storage directory
    if (process.env.NODE_ENV !== 'production' && storageDir.startsWith('/var/www')) {
      console.warn(`[LocalStorage] Development mode detected but storage directory is set to system path: ${storageDir}`);
      console.warn(`[LocalStorage] Falling back to local storage directory for development`);
      storageDir = path.join(process.cwd(), "storage");
    }
    
    this.storageDir = storageDir;
    
    // Set publicDir - also apply fallback if it's a system path in development
    let publicDir = process.env.PUBLIC_STORAGE_DIR || path.join(this.storageDir, "public");
    if (process.env.NODE_ENV !== 'production' && publicDir.startsWith('/var/www')) {
      console.warn(`[LocalStorage] Development mode detected but public storage directory is set to system path: ${publicDir}`);
      console.warn(`[LocalStorage] Falling back to local public storage directory for development`);
      publicDir = path.join(this.storageDir, "public");
    }
    this.publicDir = publicDir;
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
        try {
          mkdirSync(dir, { recursive: true, mode: 0o755 });
          console.log(`Created storage directory: ${dir}`);
        } catch (error: any) {
          console.error(`Failed to create directory ${dir}:`, error.message);
          // Don't throw during initialization - check will happen when writing
          // This allows the service to start even if permissions are wrong
          // The actual write operation will fail with a clear error message
        }
      }
      // Note: We don't check writability during initialization to avoid blocking startup
      // Permissions will be checked when actually writing files
    }
  }

  /**
   * Check if a directory is writable
   * Throws an error with a clear message if not writable
   */
  private async checkDirectoryWritable(dir: string): Promise<void> {
    try {
      const testFile = path.join(dir, `.write-test-${Date.now()}`);
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
    } catch (error: any) {
      throw new Error(
        `Storage directory ${dir} is not writable. Please check permissions. ` +
        `Run: sudo chown -R $USER:$USER ${dir} && chmod -R 755 ${dir}`
      );
    }
  }

  /**
   * Get upload endpoint URL for direct file upload
   * Returns a URL that the frontend can POST to
   */
  async getObjectEntityUploadURL(bucket?: string, prefix?: string): Promise<string> {
    // For local storage, we return a direct upload endpoint
    const uploadId = randomUUID();
    let url = `/api/upload/direct?uploadId=${uploadId}`;
    if (bucket) {
      url += `&bucket=${encodeURIComponent(bucket)}`;
    }
    if (prefix) {
      url += `&prefix=${encodeURIComponent(prefix)}`;
    }
    return url;
  }

  /**
   * Save uploaded file from buffer and return the public URL
   */
  async saveUploadedFile(
    buffer: Buffer,
    originalName: string,
    userId: string,
    visibility: "public" | "private" = "public",
    bucket?: string,
    prefix?: string
  ): Promise<string> {
    if (!buffer || buffer.length === 0) {
      throw new Error("File buffer is empty");
    }

    const uploadId = randomUUID();
    // Get file extension from original name, default to .jpg for images if not provided
    let fileExt = path.extname(originalName).toLowerCase();
    if (!fileExt || fileExt === '') {
      // Try to detect from buffer (magic numbers)
      if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
        fileExt = '.jpg';
      } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        fileExt = '.png';
      } else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        fileExt = '.gif';
      } else {
        fileExt = '.bin';
      }
    }
    const fileName = `${uploadId}${fileExt}`;
    
    // Build target directory with bucket/prefix support
    let baseDir = visibility === "public" 
      ? this.publicDir 
      : path.join(this.storageDir, "private", userId);
    
    // Add bucket and prefix to path if provided
    if (bucket || prefix) {
      const pathParts: string[] = [];
      if (bucket) {
        pathParts.push(bucket);
      }
      if (prefix) {
        // Remove leading/trailing slashes and normalize
        const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '').replace(/\\/g, '/');
        if (normalizedPrefix) {
          pathParts.push(...normalizedPrefix.split('/'));
        }
      }
      if (pathParts.length > 0) {
        baseDir = path.join(baseDir, ...pathParts);
      }
    }
    
    const targetDir = baseDir;
    
    // Ensure user directory exists for private files
    if (visibility === "private") {
      if (!existsSync(targetDir)) {
        try {
          mkdirSync(targetDir, { recursive: true, mode: 0o755 });
        } catch (error: any) {
          console.error(`Failed to create private directory ${targetDir}:`, error.message);
          throw new Error(`Failed to create storage directory: ${error.message}`);
        }
      }
    }

    // Ensure public directory and all parent directories exist (including bucket/prefix paths)
    if (visibility === "public") {
      // First ensure base public directory exists
      if (!existsSync(this.publicDir)) {
        try {
          mkdirSync(this.publicDir, { recursive: true, mode: 0o755 });
        } catch (error: any) {
          console.error(`Failed to create public directory ${this.publicDir}:`, error.message);
          // Provide helpful error message with fix instructions
          if (error.code === 'EACCES' || error.code === 'EPERM') {
            const fixMessage = process.env.NODE_ENV === 'development' 
              ? `Permission denied. For development, ensure the storage directory is writable or use a local path. Try: mkdir -p ${path.join(process.cwd(), "storage/public")} && chmod -R 755 ${path.join(process.cwd(), "storage")}`
              : `Permission denied writing to ${this.publicDir}. Please check permissions. Run: sudo chown -R $USER:$USER ${this.storageDir} && chmod -R 755 ${this.storageDir}`;
            throw new Error(`Failed to create storage directory: ${error.message}. ${fixMessage}`);
          }
          throw new Error(`Failed to create storage directory: ${error.message}`);
        }
      }
      
      // Then ensure the full target directory (with bucket/prefix) exists
      if (!existsSync(targetDir)) {
        try {
          mkdirSync(targetDir, { recursive: true, mode: 0o755 });
        } catch (error: any) {
          console.error(`Failed to create target directory ${targetDir}:`, error.message);
          if (error.code === 'EACCES' || error.code === 'EPERM') {
            const fixMessage = process.env.NODE_ENV === 'development' 
              ? `Permission denied. For development, ensure the storage directory is writable. Try: mkdir -p ${path.join(process.cwd(), "storage/public")} && chmod -R 755 ${path.join(process.cwd(), "storage")}`
              : `Permission denied writing to ${targetDir}. Please check permissions. Run: sudo chown -R $USER:$USER ${this.storageDir} && chmod -R 755 ${this.storageDir}`;
            throw new Error(`Failed to create storage directory: ${error.message}. ${fixMessage}`);
          }
          throw new Error(`Failed to create storage directory: ${error.message}`);
        }
      }
    }

    // Check if directory is writable before attempting to write
    await this.checkDirectoryWritable(targetDir);

    const filePath = path.join(targetDir, fileName);
    
    try {
      await fs.writeFile(filePath, buffer, { mode: 0o644 });
      console.log(`File saved successfully: ${filePath} (${buffer.length} bytes)`);
    } catch (error: any) {
      console.error(`Failed to write file ${filePath}:`, error.message);
      // If it's a permission error, provide helpful message
      if (error.code === 'EACCES' || error.code === 'EPERM') {
        throw new Error(
          `Permission denied writing to ${targetDir}. Please check permissions. ` +
          `Run: sudo chown -R $USER:$USER ${this.storageDir} && chmod -R 755 ${this.storageDir}`
        );
      }
      throw new Error(`Failed to save file: ${error.message}`);
    }

    // Return the URL path with bucket/prefix if provided
    let urlPath = visibility === "public" 
      ? `${this.baseUrl}/public` 
      : `${this.baseUrl}/private/${userId}`;
    
    // Add bucket and prefix to URL path
    if (bucket || prefix) {
      const pathParts: string[] = [];
      if (bucket) {
        pathParts.push(bucket);
      }
      if (prefix) {
        const normalizedPrefix = prefix.replace(/^\/+|\/+$/g, '').replace(/\\/g, '/');
        if (normalizedPrefix) {
          pathParts.push(...normalizedPrefix.split('/'));
        }
      }
      if (pathParts.length > 0) {
        urlPath += '/' + pathParts.join('/');
      }
    }
    
    return `${urlPath}/${fileName}`;
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

    console.log(`[LocalStorage] Getting file for path: ${normalizedPath}`);

    const pathParts = normalizedPath.split("/").filter(p => p);
    
    if (pathParts.length < 3) {
      console.error(`[LocalStorage] Invalid path format: ${normalizedPath} (parts: ${pathParts.length})`);
      throw new ObjectNotFoundError();
    }

    let filePath: string;
    if (pathParts[1] === "public") {
      filePath = path.join(this.publicDir, ...pathParts.slice(2));
    } else if (pathParts[1] === "private") {
      filePath = path.join(this.storageDir, "private", ...pathParts.slice(2));
    } else {
      console.error(`[LocalStorage] Invalid storage type: ${pathParts[1]} (expected public or private)`);
      throw new ObjectNotFoundError();
    }

    console.log(`[LocalStorage] Resolved file path: ${filePath}`);
    console.log(`[LocalStorage] Public dir: ${this.publicDir}, Storage dir: ${this.storageDir}`);

    if (!existsSync(filePath)) {
      console.error(`[LocalStorage] File does not exist: ${filePath}`);
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
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
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

