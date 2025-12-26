# CI/CD Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Generate SSH Key (Local Machine)

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

### 2. Add Public Key to VPS

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-vps-ip
```

### 3. Add GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `VPS_HOST` | Your VPS IP or domain | `123.456.789.0` |
| `VPS_USER` | SSH username | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Private key content | `cat ~/.ssh/github_actions_deploy` |
| `VPS_SSH_PORT` | SSH port (optional) | `22` |

### 4. Initial VPS Setup

Run the setup script on your VPS:

```bash
# Copy setup script to VPS
scp scripts/setup-vps.sh user@your-vps-ip:/tmp/

# SSH into VPS
ssh user@your-vps-ip

# Run setup
chmod +x /tmp/setup-vps.sh
/tmp/setup-vps.sh
```

### 5. First Deployment

```bash
# Clone repo on VPS
cd /var/www/vengrow
git clone https://github.com/your-username/your-repo.git .

# Create .env file
cp .env.example .env
nano .env  # Edit with your config

# Build and start
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

### 6. Test Automated Deployment

```bash
# Make a change and push
git add .
git commit -m "Test CI/CD"
git push origin main

# Watch deployment in GitHub Actions tab
```

## 📋 What Happens on Push to `main`?

1. ✅ Code is checked out
2. ✅ Dependencies installed
3. ✅ Type checking runs
4. ✅ Application builds
5. ✅ Package created and uploaded to VPS
6. ✅ Dependencies installed on VPS
7. ✅ Database migrations run
8. ✅ Storage directories created
9. ✅ PM2 restarts application
10. ✅ Deployment verified

## 🔧 Troubleshooting

### SSH Connection Fails
```bash
# Test SSH connection
ssh -i ~/.ssh/github_actions_deploy user@your-vps-ip

# Check if key is in authorized_keys
ssh user@your-vps-ip "cat ~/.ssh/authorized_keys"
```

### Permission Denied
```bash
# Fix permissions on VPS
sudo chown -R $USER:$USER /var/www/vengrow
sudo chown -R $USER:$USER /var/www/storage
```

### Application Won't Start
```bash
# Check PM2 logs
pm2 logs vengrow

# Check if port is in use
netstat -tulpn | grep 5000
```

## 📚 Full Documentation

- **DEPLOYMENT.md** - Complete deployment guide
- **VPS_SETUP.md** - VPS setup instructions
- **STORAGE_MIGRATION.md** - Storage configuration

## 🎯 Common Commands

```bash
# View deployment logs
pm2 logs vengrow

# Restart manually
pm2 restart vengrow

# Check status
pm2 status

# View recent deployments
ls -la /var/www/vengrow-backups/
```

## 🔐 Security Checklist

- [ ] SSH key is secure (not committed to repo)
- [ ] GitHub secrets are set correctly
- [ ] VPS firewall is configured
- [ ] Non-root user is used for deployment
- [ ] .env file is not committed to repo
- [ ] PM2 is configured for auto-restart

