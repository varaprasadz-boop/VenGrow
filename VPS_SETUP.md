# VPS Setup Instructions for VenGrow

This guide will help you deploy VenGrow on your Hostinger VPS with local file storage.

## Prerequisites

- Hostinger VPS with Ubuntu/Debian
- SSH access to your VPS
- Domain name (optional but recommended)
- Node.js 18+ installed

## Step 1: Server Setup

### 1.1 Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### 1.2 Update System Packages

```bash
apt update && apt upgrade -y
```

### 1.3 Install Node.js 18+

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node --version  # Should show v18.x or higher
```

### 1.4 Install PM2 (Process Manager)

```bash
npm install -g pm2
```

### 1.5 Install Nginx (Web Server)

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

## Step 2: Application Setup

### 2.1 Clone Your Repository

```bash
cd /var/www
git clone <your-repository-url> vengrow
cd vengrow
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Create Storage Directory

```bash
mkdir -p /var/www/vengrow/storage/public
mkdir -p /var/www/vengrow/storage/private
chmod -R 755 /var/www/vengrow/storage
```

### 2.4 Create Environment File

```bash
cp .env.example .env
nano .env
```

Add the following environment variables:

```env
# Server
NODE_ENV=production
PORT=5000

# Database (Neon PostgreSQL)
DATABASE_URL=your-neon-database-url

# Storage Configuration
LOCAL_STORAGE_DIR=/var/www/vengrow/storage
PUBLIC_STORAGE_DIR=/var/www/vengrow/storage/public
STORAGE_BASE_URL=/storage

# Session Secret
SESSION_SECRET=your-random-secret-key-here

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@vengrow.com

# Razorpay (if using)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Super Admin Credentials
SUPERADMIN_EMAIL=admin@vengrow.com
SUPERADMIN_PASSWORD=your-secure-password
```

**Important:** Generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Build the Application

```bash
npm run build
```

## Step 3: Database Setup

### 3.1 Push Database Schema

```bash
npm run db:push
```

### 3.2 (Optional) Seed Initial Data

If you have seed scripts:
```bash
# You may need to create a seed script or run it manually
```

## Step 4: Configure Nginx

### 4.1 Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/vengrow
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Increase upload size limit for file uploads
    client_max_body_size 100M;

    # Serve static files from storage
    location /storage {
        alias /var/www/vengrow/storage/public;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Serve built client files
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API routes
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4.2 Enable the Site

```bash
ln -s /etc/nginx/sites-available/vengrow /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl reload nginx
```

## Step 5: Setup SSL with Let's Encrypt (Recommended)

### 5.1 Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 5.2 Obtain SSL Certificate

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

### 5.3 Auto-renewal

Certbot sets up auto-renewal automatically. Test it:
```bash
certbot renew --dry-run
```

## Step 6: Start Application with PM2

### 6.1 Start the Application

```bash
cd /var/www/vengrow
pm2 start dist/index.js --name vengrow
```

### 6.2 Save PM2 Configuration

```bash
pm2 save
pm2 startup  # Follow the instructions to enable startup on boot
```

### 6.3 Monitor Application

```bash
pm2 status
pm2 logs vengrow
pm2 monit
```

## Step 7: Firewall Configuration

### 7.1 Configure UFW (Uncomplicated Firewall)

```bash
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

## Step 8: Maintenance Commands

### Update Application

```bash
cd /var/www/vengrow
git pull
npm install
npm run build
pm2 restart vengrow
```

### View Logs

```bash
pm2 logs vengrow
# Or
tail -f /var/www/vengrow/storage/logs/app.log  # If you set up file logging
```

### Restart Application

```bash
pm2 restart vengrow
```

### Stop Application

```bash
pm2 stop vengrow
```

### Database Migrations

```bash
cd /var/www/vengrow
npm run db:push
```

## Step 9: Storage Management

### Storage Location

Files are stored in:
- **Public files**: `/var/www/vengrow/storage/public/`
- **Private files**: `/var/www/vengrow/storage/private/{userId}/`

### Backup Storage

Create a backup script:

```bash
nano /root/backup-vengrow.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR

# Backup storage
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz /var/www/vengrow/storage

# Keep only last 7 days of backups
find $BACKUP_DIR -name "storage_*.tar.gz" -mtime +7 -delete

echo "Backup completed: storage_$DATE.tar.gz"
```

Make it executable:
```bash
chmod +x /root/backup-vengrow.sh
```

Add to crontab for daily backups:
```bash
crontab -e
# Add this line:
0 2 * * * /root/backup-vengrow.sh
```

## Step 10: Monitoring & Performance

### Monitor Disk Usage

```bash
df -h  # Check disk space
du -sh /var/www/vengrow/storage  # Check storage size
```

### Monitor Application Performance

```bash
pm2 monit
```

### Set Up Log Rotation

PM2 handles log rotation automatically, but you can configure it:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Troubleshooting

### Application Won't Start

1. Check logs: `pm2 logs vengrow`
2. Check environment variables: `cat .env`
3. Check port: `netstat -tulpn | grep 5000`
4. Check Node.js version: `node --version`

### Files Not Uploading

1. Check storage directory permissions: `ls -la /var/www/vengrow/storage`
2. Check Nginx upload limit: `client_max_body_size 100M;`
3. Check application logs: `pm2 logs vengrow`

### Database Connection Issues

1. Verify DATABASE_URL in .env
2. Check if Neon database is accessible
3. Check firewall rules

### SSL Certificate Issues

1. Check certificate: `certbot certificates`
2. Renew manually: `certbot renew`
3. Check Nginx config: `nginx -t`

## Security Recommendations

1. **Change default SSH port** (optional but recommended)
2. **Use strong passwords** for all accounts
3. **Keep system updated**: `apt update && apt upgrade`
4. **Regular backups** of database and storage
5. **Monitor logs** for suspicious activity
6. **Use fail2ban** to prevent brute force attacks:
   ```bash
   apt install fail2ban
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

## Support

For issues or questions:
- Check application logs: `pm2 logs vengrow`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`
- Check system logs: `journalctl -u nginx`

## Notes

- The application uses local file storage instead of Replit storage
- All uploaded files are stored in `/var/www/vengrow/storage/`
- Make sure you have enough disk space (100GB should be plenty)
- Regularly monitor disk usage to prevent running out of space
- Consider setting up automated backups for both database and storage

