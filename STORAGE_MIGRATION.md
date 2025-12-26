# Storage Migration: Replit to Local File Storage

## Overview

The application has been updated to use local file storage instead of Replit's object storage. This allows deployment on any VPS (like Hostinger) using the server's local filesystem.

## Changes Made

### 1. New Local Storage Service (`server/localStorage.ts`)

A new `LocalStorageService` class has been created that:
- Stores files in the local filesystem
- Organizes files into `public` and `private` directories
- Handles file uploads, downloads, and serving
- Automatically creates necessary directories

### 2. Updated Object Storage Service (`server/objectStorage.ts`)

The `ObjectStorageService` now:
- Automatically uses `LocalStorageService` when not running on Replit
- Falls back to Replit storage when `REPL_ID` environment variable is set
- Maintains backward compatibility with existing code

### 3. New Upload Endpoint (`server/routes.ts`)

Added `/api/upload/direct` endpoint for direct file uploads when using local storage.

### 4. Storage Routes

Added `/storage/:type(public|private)/:path(*)` route to serve files from local storage.

## Environment Variables

Add these to your `.env` file:

```env
# Local Storage Configuration
LOCAL_STORAGE_DIR=/var/www/storage
PUBLIC_STORAGE_DIR=/var/www/storage/public
STORAGE_BASE_URL=/storage
NODE_ENV=production
```

**Default values** (if not set):
- `LOCAL_STORAGE_DIR`: 
  - Production: `/var/www/storage` (for VPS)
  - Development: `./storage` (relative to project root)
- `PUBLIC_STORAGE_DIR`: `{LOCAL_STORAGE_DIR}/public`
- `STORAGE_BASE_URL`: `/storage`
- `NODE_ENV`: `development` (affects default storage path)

## Storage Structure

```
storage/
├── public/          # Publicly accessible files
│   ├── {uuid}.jpg
│   ├── {uuid}.png
│   └── ...
└── private/         # Private user files
    └── {userId}/
        ├── {uuid}.jpg
        └── ...
```

## How It Works

### File Upload Flow

1. **Frontend requests upload URL**: `POST /api/objects/upload`
2. **Backend returns upload endpoint**: `/api/upload/direct?uploadId={uuid}`
3. **Frontend uploads file**: `PUT /api/upload/direct?uploadId={uuid}` with file data
4. **Backend saves file**: File is saved to `storage/public/` or `storage/private/{userId}/`
5. **Backend returns file URL**: `/storage/public/{filename}`

### File Serving

- **Public files**: `GET /storage/public/{filename}`
- **Private files**: `GET /storage/private/{userId}/{filename}`

## Migration from Replit

If you're migrating from Replit:

1. **Set environment variables** (see above)
2. **Create storage directories on VPS**:
   ```bash
   sudo mkdir -p /var/www/storage/public /var/www/storage/private /var/www/storage/uploads
   sudo chown -R $USER:$USER /var/www/storage
   chmod -R 755 /var/www/storage
   ```
3. **Deploy to VPS** following `VPS_SETUP.md`
4. **No code changes needed** - the application automatically detects the environment and uses `/var/www/storage` in production mode

## VPS Setup

For VPS deployment, the storage is automatically configured to use `/var/www/storage` when `NODE_ENV=production`. 

**Important**: Make sure the application user has write permissions to `/var/www/storage`:
```bash
sudo chown -R $USER:$USER /var/www/storage
chmod -R 755 /var/www/storage
```

If using PM2 or a process manager, ensure the user running the application has permissions.

## Testing Local Storage

### 1. Test Upload Endpoint

```bash
curl -X POST http://localhost:5000/api/objects/upload \
  -H "Cookie: connect.sid=your-session-cookie"
```

Response:
```json
{
  "uploadURL": "/api/upload/direct?uploadId=...",
  "url": "/api/upload/direct?uploadId=..."
}
```

### 2. Test File Upload

```bash
curl -X PUT "http://localhost:5000/api/upload/direct?uploadId=..." \
  -H "Cookie: connect.sid=your-session-cookie" \
  --data-binary @test-image.jpg \
  -H "Content-Type: image/jpeg"
```

### 3. Test File Serving

```bash
curl http://localhost:5000/storage/public/{filename}
```

## Frontend Integration

The frontend code should work without changes if using Uppy or similar upload libraries. The upload flow:

1. Request upload URL from `/api/objects/upload`
2. Use the returned `uploadURL` to upload the file
3. For local storage, `uploadURL` will be `/api/upload/direct?uploadId=...`
4. Upload file using PUT request to that URL
5. Use the returned `url` to display/store the file

## File Size Limits

- **Default limit**: 100MB per file
- **Configure in**: `server/app.ts` - `express.raw({ limit: '100mb' })`
- **Nginx limit**: Set `client_max_body_size 100M;` in Nginx config

## Security Considerations

1. **File Permissions**: Ensure storage directories have correct permissions (755 for directories, 644 for files)
2. **Private Files**: Private files are organized by userId - ensure proper authentication
3. **File Validation**: Consider adding file type validation on the upload endpoint
4. **Virus Scanning**: Consider adding virus scanning for uploaded files in production

## Backup Strategy

Regularly backup the `storage/` directory:

```bash
# Daily backup script
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/vengrow/storage
```

## Troubleshooting

### Files Not Uploading

1. Check storage directory exists and has write permissions
2. Check file size limits (both Express and Nginx)
3. Check application logs: `pm2 logs vengrow`

### Files Not Serving

1. Check file exists in storage directory
2. Check Nginx configuration for `/storage` route
3. Check file permissions

### Storage Full

1. Monitor disk usage: `df -h`
2. Implement file cleanup for old/unused files
3. Consider archiving old files

## Performance Tips

1. **Use CDN**: For high traffic, consider using a CDN for public files
2. **Image Optimization**: Compress images before upload
3. **Lazy Loading**: Implement lazy loading for images in frontend
4. **Caching**: Nginx caching is configured in `VPS_SETUP.md`

## Next Steps

1. Review `VPS_SETUP.md` for complete deployment instructions
2. Set up environment variables
3. Test file uploads in development
4. Deploy to VPS
5. Monitor storage usage

