#!/bin/bash

# VenGrow VPS Initial Setup Script
# Run this script on your VPS to prepare it for deployment

set -e

echo "🚀 VenGrow VPS Setup Script"
echo "============================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo "❌ Please do not run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Update system
print_info "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
print_info "Installing Node.js 18..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_success "Node.js $(node --version) is already installed"
    else
        print_info "Node.js version is too old, installing Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

print_success "Node.js $(node --version) installed"

# Install PM2
print_info "Installing PM2..."
if command -v pm2 &> /dev/null; then
    print_success "PM2 is already installed"
else
    sudo npm install -g pm2
    print_success "PM2 installed"
fi

# Install Nginx
print_info "Installing Nginx..."
if command -v nginx &> /dev/null; then
    print_success "Nginx is already installed"
else
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    print_success "Nginx installed and started"
fi

# Create application directory
print_info "Creating application directory..."
sudo mkdir -p /var/www/vengrow
sudo chown -R $USER:$USER /var/www/vengrow
print_success "Application directory created"

# Create storage directory
print_info "Creating storage directory..."
sudo mkdir -p /var/www/storage/public
sudo mkdir -p /var/www/storage/private
sudo mkdir -p /var/www/storage/uploads
sudo chown -R $USER:$USER /var/www/storage
sudo chmod -R 755 /var/www/storage
print_success "Storage directory created"

# Create backup directory
print_info "Creating backup directory..."
sudo mkdir -p /var/www/vengrow-backups
sudo chown -R $USER:$USER /var/www/vengrow-backups
print_success "Backup directory created"

# Create logs directory
print_info "Creating logs directory..."
mkdir -p /var/www/vengrow/logs
print_success "Logs directory created"

# Setup PM2 startup
print_info "Setting up PM2 startup..."
pm2 startup | grep -v "PM2" | sudo bash || true
print_success "PM2 startup configured"

# Configure firewall
print_info "Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable || true
print_success "Firewall configured"

echo ""
print_success "VPS setup completed! 🎉"
echo ""
echo "Next steps:"
echo "1. Clone your repository: cd /var/www/vengrow && git clone <your-repo-url> ."
echo "2. Create .env file: cp .env.example .env && nano .env"
echo "3. Install dependencies: npm install"
echo "4. Build application: npm run build"
echo "5. Start application: pm2 start ecosystem.config.cjs"
echo "6. Configure Nginx (see VPS_SETUP.md)"
echo "7. Set up GitHub Actions secrets (see DEPLOYMENT.md)"

