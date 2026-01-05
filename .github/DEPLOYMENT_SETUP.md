# GitHub Actions Deployment Setup Guide

This guide will help you set up automated deployment to your Hostinger VPS using GitHub Actions.

## Prerequisites

1. SSH access to your VPS
2. SSH key pair (public key added to VPS, private key for GitHub)
3. GitHub repository with Actions enabled

## Step 1: Generate SSH Key Pair (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

This will create:
- `~/.ssh/github_actions_deploy` (private key)
- `~/.ssh/github_actions_deploy.pub` (public key)

## Step 2: Add Public Key to VPS

Copy the public key to your VPS:

```bash
cat ~/.ssh/github_actions_deploy.pub
```

Then on your VPS, add it to the authorized_keys:

```bash
# On your VPS
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Required Secrets:

1. **VPS_SSH_PRIVATE_KEY**
   - Value: The content of your private key file (`~/.ssh/github_actions_deploy`)
   - You can get it with: `cat ~/.ssh/github_actions_deploy`
   - Include the entire key including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

2. **VPS_HOST**
   - Value: Your VPS IP address or hostname
   - Example: `123.456.789.0` or `staging.vengrow.net`

3. **VPS_USER**
   - Value: SSH username for your VPS
   - Example: `root` or `ubuntu` or your username

### Optional Secrets (with defaults):

4. **VPS_PROJECT_PATH** (optional, defaults to `VenGrow`)
   - Value: Path to your project directory on the VPS
   - Example: `VenGrow` or `/home/user/VenGrow`

5. **VPS_WEB_DIR** (optional, defaults to `/var/www/staging.vengrow.net`)
   - Value: Web server directory where files are deployed
   - Example: `/var/www/staging.vengrow.net`

## Step 4: Configure Deployment Branch

By default, the workflow deploys when you push to the `main` branch. To change this:

1. Open `.github/workflows/deploy-staging.yml`
2. Find the `on.push.branches` section
3. Change `main` to your desired branch (e.g., `staging`, `develop`)

## Step 5: Test the Deployment

1. Make a small change to your code
2. Commit and push to the configured branch
3. Go to your GitHub repository → Actions tab
4. Watch the deployment workflow run

## Manual Deployment

You can also trigger the deployment manually:

1. Go to your GitHub repository → Actions tab
2. Select "Deploy to Staging VPS" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Troubleshooting

### SSH Connection Issues

- Verify your SSH key is correctly added to GitHub secrets
- Check that the public key is in `~/.ssh/authorized_keys` on your VPS
- Ensure your VPS firewall allows SSH connections

### Permission Issues

- Make sure the VPS user has permissions to:
  - Write to the project directory
  - Execute `sudo` commands (for nginx reload and file operations)
  - Run `pm2` commands

### PM2 Not Found

- Ensure PM2 is installed globally: `npm install -g pm2`
- Or use the full path to PM2 in the workflow

### Build Failures

- Check the Actions logs for specific error messages
- Verify all dependencies are in `package.json`
- Ensure Node.js version on VPS matches your project requirements

## Security Best Practices

1. **Never commit secrets**: All sensitive information should be in GitHub Secrets
2. **Use SSH keys**: Don't use passwords for SSH authentication
3. **Limit sudo access**: Configure sudoers to only allow specific commands
4. **Rotate keys**: Periodically rotate your SSH keys
5. **Monitor deployments**: Review deployment logs regularly

## Workflow Details

The deployment workflow performs the following steps:

1. ✅ Checks out your code
2. 🔐 Sets up SSH authentication
3. 📥 Pulls latest changes from Git
4. 📦 Installs npm dependencies
5. 🔨 Builds the project
6. 🧹 Cleans the web directory
7. 📋 Copies build files to web directory
8. 🔄 Restarts PM2 process
9. 🔄 Reloads nginx

Total deployment time: ~2-5 minutes (depending on build time)

