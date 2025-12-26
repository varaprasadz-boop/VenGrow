#!/bin/bash

# VenGrow Deployment Script
# This script is run on the VPS server after files are deployed

set -e  # Exit on error

echo "🚀 Starting VenGrow deployment..."

# Configuration
APP_DIR="/var/www/vengrow"
STORAGE_DIR="/var/www/storage"
BACKUP_DIR="/var/www/vengrow-backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Navigate to application directory
if [ ! -d "$APP_DIR" ]; then
    print_error "Application directory $APP_DIR does not exist!"
    exit 1
fi

cd "$APP_DIR" || exit 1

# Create backup
print_info "Creating backup of current version..."
if [ -d "dist" ]; then
    BACKUP_PATH="$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$BACKUP_PATH"
    cp -r dist "$BACKUP_PATH/" 2>/dev/null || true
    cp package.json "$BACKUP_PATH/" 2>/dev/null || true
    print_success "Backup created at $BACKUP_PATH"
    
    # Keep only last 5 backups
    print_info "Cleaning old backups (keeping last 5)..."
    ls -t "$BACKUP_DIR" | tail -n +6 | xargs -I {} rm -rf "$BACKUP_DIR/{}" 2>/dev/null || true
fi

# Install/update dependencies
print_info "Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci --production
else
    npm install --production
fi

# Run database migrations
print_info "Running database migrations..."
if npm run db:push 2>/dev/null; then
    print_success "Database migrations completed"
else
    print_info "Database migrations skipped or not needed"
fi

# Ensure storage directories exist
print_info "Ensuring storage directories exist..."
sudo mkdir -p "$STORAGE_DIR/public"
sudo mkdir -p "$STORAGE_DIR/private"
sudo mkdir -p "$STORAGE_DIR/uploads"

# Set proper permissions
if [ -w "$STORAGE_DIR" ]; then
    chmod -R 755 "$STORAGE_DIR"
    print_success "Storage directories ready"
else
    print_info "Setting storage directory permissions (may require sudo)..."
    sudo chown -R "$USER:$USER" "$STORAGE_DIR"
    sudo chmod -R 755 "$STORAGE_DIR"
    print_success "Storage directories ready"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_info ".env file not found. Please create it from .env.example"
    if [ -f ".env.example" ]; then
        print_info "You can copy .env.example to .env and update the values"
    fi
fi

# Restart application with PM2
print_info "Restarting application with PM2..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install it with: npm install -g pm2"
    exit 1
fi

# Try to restart existing process, or start new one
if pm2 describe vengrow > /dev/null 2>&1; then
    print_info "Restarting existing PM2 process..."
    pm2 restart vengrow
    print_success "Application restarted"
else
    print_info "Starting new PM2 process..."
    if [ -f "ecosystem.config.cjs" ]; then
        pm2 start ecosystem.config.cjs
    else
        pm2 start dist/index.js --name vengrow
    fi
    pm2 save
    print_success "Application started"
fi

# Show PM2 status
print_info "Current PM2 status:"
pm2 status

# Show recent logs
print_info "Recent application logs:"
pm2 logs vengrow --lines 10 --nostream || true

# Health check
print_info "Performing health check..."
sleep 3

# Check if application is running
if pm2 describe vengrow | grep -q "online"; then
    print_success "Application is running!"
    
    # Try to check if the server is responding (optional)
    if command -v curl &> /dev/null; then
        if curl -f -s http://localhost:5000/api/health > /dev/null 2>&1 || \
           curl -f -s http://localhost:5000/ > /dev/null 2>&1; then
            print_success "Application is responding to requests"
        else
            print_info "Application is running but health check endpoint may not be available"
        fi
    fi
else
    print_error "Application failed to start. Check logs with: pm2 logs vengrow"
    exit 1
fi

print_success "Deployment completed successfully! 🎉"

