# CI/CD Deployment Guide

This guide explains how to set up automated deployment from GitHub to your Hostinger VPS.

## Overview

The CI/CD pipeline automatically:
1. Builds the application when code is pushed to `main` branch
2. Deploys to your Hostinger VPS via SSH
3. Installs dependencies and runs migrations
4. Restarts the application with PM2

## Prerequisites

1. **GitHub Repository** with your code
2. **Hostinger VPS** with:
   - Node.js 18+ installed
   - PM2 installed globally
   - SSH access configured
   - Application directory: `/var/www/vengrow`
   - Storage directory: `/var/www/storage`

## Setup Instructions

### Step 1: Generate SSH Key for Deployment

On your local machine, generate a new SSH key pair for GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

This creates two files:
- `~/.ssh/github_actions_deploy` (private key)
- `~/.ssh/github_actions_deploy.pub` (public key)

### Step 2: Add Public Key to VPS

Copy the public key to your VPS:

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-vps-ip
```

Or manually add it to `~/.ssh/authorized_keys` on your VPS:

```bash
cat ~/.ssh/github_actions_deploy.pub | ssh user@your-vps-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

#### Required Secrets for Production:

1. **VPS_HOST**
   - Value: Your VPS IP address or domain name
   - Example: `123.456.789.0` or `vps.yourdomain.com`

2. **VPS_USER**
   - Value: SSH username for your VPS
   - Example: `root` or `ubuntu` or `vengrow`

3. **VPS_SSH_KEY**
   - Value: Contents of your private key file
   - Get it with: `cat ~/.ssh/github_actions_deploy`
   - Copy the entire output including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

4. **VPS_SSH_PORT** (Optional)
   - Value: SSH port number (default: 22)
   - Only add if your SSH port is not 22

#### Optional Secrets for Staging:

If you want to deploy to a staging environment:

1. **VPS_STAGING_HOST**
2. **VPS_STAGING_USER**
3. **VPS_STAGING_SSH_KEY**
4. **VPS_STAGING_SSH_PORT**

### Step 4: Initial VPS Setup

Before the first deployment, set up your VPS:

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Create application directory
sudo mkdir -p /var/www/vengrow
sudo chown -R $USER:$USER /var/www/vengrow

# Create storage directory
sudo mkdir -p /var/www/storage/public
sudo mkdir -p /var/www/storage/private
sudo mkdir -p /var/www/storage/uploads
sudo chown -R $USER:$USER /var/www/storage
chmod -R 755 /var/www/storage

# Create backup directory
sudo mkdir -p /var/www/vengrow-backups
sudo chown -R $USER:$USER /var/www/vengrow-backups

# Install Node.js 18+ if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Clone your repository (first time only)
cd /var/www/vengrow
git clone https://github.com/your-username/your-repo.git .

# Create .env file
cp .env.example .env
nano .env  # Edit with your configuration

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Follow instructions to enable on boot
```

### Step 5: Test Deployment

1. Make a small change to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Go to GitHub → Actions tab
4. Watch the deployment workflow run
5. Check your VPS to verify the deployment:
   ```bash
   ssh user@your-vps-ip
   pm2 status
   pm2 logs vengrow
   ```

## Workflow Files

### Production Deployment (`.github/workflows/deploy.yml`)

- Triggers on push to `main` branch
- Builds the application
- Creates a deployment package
- Deploys to VPS via SSH
- Runs deployment script
- Verifies deployment

### Staging Deployment (`.github/workflows/deploy-staging.yml`)

- Triggers on push to `develop` branch
- Similar to production but deploys to staging environment
- Uses different VPS secrets

## Deployment Process

When you push to `main`, the workflow:

1. **Checks out code** from GitHub
2. **Installs dependencies** with `npm ci`
3. **Runs type check** with `npm run check`
4. **Builds application** with `npm run build`
5. **Creates deployment package** with:
   - Built `dist` folder
   - `package.json` and `package-lock.json`
   - `ecosystem.config.cjs`
   - Deployment script
6. **Transfers package** to VPS via SCP
7. **Extracts and deploys** on VPS:
   - Extracts files to `/var/www/vengrow`
   - Runs `npm ci --production`
   - Runs database migrations
   - Ensures storage directories exist
   - Restarts PM2 process
8. **Verifies deployment** by checking PM2 status

## Manual Deployment

You can also trigger deployment manually:

1. Go to GitHub → Actions
2. Select "Deploy to Hostinger VPS" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Troubleshooting

### Deployment Fails: SSH Connection Error

- Check that `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY` secrets are correct
- Verify SSH key is added to VPS: `ssh -i ~/.ssh/github_actions_deploy user@your-vps-ip`
- Check VPS firewall allows SSH connections

### Deployment Fails: Permission Denied

- Ensure the user has write permissions to `/var/www/vengrow`
- Check storage directory permissions: `ls -la /var/www/storage`
- May need to run: `sudo chown -R $USER:$USER /var/www/vengrow /var/www/storage`

### Application Doesn't Start After Deployment

- Check PM2 logs: `pm2 logs vengrow`
- Verify `.env` file exists and has correct values
- Check Node.js version: `node --version` (should be 18+)
- Verify port 5000 is not in use: `netstat -tulpn | grep 5000`

### Build Fails

- Check GitHub Actions logs for specific error
- Verify all dependencies are in `package.json`
- Ensure TypeScript compilation passes: `npm run check`

### Database Migration Fails

- Check `DATABASE_URL` in `.env` file
- Verify database connection from VPS
- Check database permissions

## Security Best Practices

1. **Use SSH keys** instead of passwords
2. **Restrict SSH access** to specific IPs if possible
3. **Use non-root user** for deployments
4. **Rotate SSH keys** periodically
5. **Monitor deployment logs** for suspicious activity
6. **Keep secrets secure** - never commit them to repository
7. **Use different keys** for staging and production

## Rollback

If deployment fails or causes issues, you can rollback:

```bash
# SSH into VPS
ssh user@your-vps-ip

# List backups
ls -la /var/www/vengrow-backups/

# Restore from backup
cd /var/www/vengrow
rm -rf dist
cp -r /var/www/vengrow-backups/YYYYMMDD_HHMMSS/dist .
pm2 restart vengrow
```

## Monitoring

After deployment, monitor:

- **PM2 Status**: `pm2 status`
- **Application Logs**: `pm2 logs vengrow`
- **System Resources**: `pm2 monit`
- **Disk Usage**: `df -h`
- **Storage Usage**: `du -sh /var/www/storage`

## Advanced Configuration

### Custom Deployment Script

You can customize the deployment by editing `.github/workflows/deploy.yml` or creating a custom `scripts/deploy.sh` on your VPS.

### Environment-Specific Deployments

To deploy to different environments:

1. Create separate workflow files
2. Use different GitHub secrets (e.g., `VPS_STAGING_*`)
3. Trigger on different branches

### Pre/Post Deployment Hooks

Add custom commands in the workflow file:

```yaml
- name: Run pre-deployment tasks
  run: |
    # Your custom commands here
```

## Support

For issues:
1. Check GitHub Actions logs
2. Check PM2 logs on VPS: `pm2 logs vengrow`
3. Verify all secrets are set correctly
4. Test SSH connection manually

## Notes

- The deployment process creates automatic backups before updating
- Old backups are automatically cleaned (keeps last 5)
- The workflow uses `npm ci` for faster, reliable installs
- Database migrations run automatically during deployment
- Storage directories are created/verified during each deployment

