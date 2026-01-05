# Quick SSH Key Setup Guide

Follow these steps to create an SSH key and set it up for GitHub Actions.

## Step 1: Generate SSH Key (Run on Your Computer)

Open your terminal and run:

```bash
ssh-keygen -t ed25519 -C "github-actions-vengrow" -f ~/.ssh/github_actions_vengrow
```

**When prompted:**
- "Enter passphrase" → Just press **Enter** (leave it empty)
- "Enter same passphrase again" → Press **Enter** again

This creates two files:
- `~/.ssh/github_actions_vengrow` (private key - you'll add this to GitHub)
- `~/.ssh/github_actions_vengrow.pub` (public key - you'll add this to your VPS)

## Step 2: Copy Public Key to Your VPS

### Option A: Using ssh-copy-id (Easiest)

```bash
ssh-copy-id -i ~/.ssh/github_actions_vengrow.pub root@72.61.233.124
```

When prompted, enter your password: `Venki@459999`

### Option B: Manual Copy (If Option A doesn't work)

**2a. Display your public key:**
```bash
cat ~/.ssh/github_actions_vengrow.pub
```

Copy the entire output (it starts with `ssh-ed25519` and ends with `github-actions-vengrow`)

**2b. Connect to your VPS:**
```bash
ssh root@72.61.233.124
# Password: Venki@459999
```

**2c. On your VPS, run these commands:**
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
```

**2d. In the nano editor:**
- Press `Ctrl+V` to paste your public key
- Press `Ctrl+O` to save, then `Enter`
- Press `Ctrl+X` to exit

**2e. Set correct permissions:**
```bash
chmod 600 ~/.ssh/authorized_keys
exit
```

## Step 3: Test SSH Key Works

Test that you can connect without a password:

```bash
ssh -i ~/.ssh/github_actions_vengrow root@72.61.233.124
```

If it connects **without asking for a password**, you're good! Type `exit` to disconnect.

If it still asks for a password, go back to Step 2 and make sure the public key was added correctly.

## Step 4: Add Private Key to GitHub Secrets

**4a. Display your private key:**
```bash
cat ~/.ssh/github_actions_vengrow
```

**4b. Copy the ENTIRE output** - it should look like this:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtZW
... (many lines of text) ...
-----END OPENSSH PRIVATE KEY-----
```

**4c. Go to GitHub:**
1. Open your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Name: `VPS_SSH_PRIVATE_KEY`
6. Value: Paste the entire private key (including the BEGIN and END lines)
7. Click **Add secret**

## Step 5: Add Other Secrets (Optional)

While you're in GitHub Secrets, add these for clarity:

1. **New secret**: Name `VPS_HOST`, Value `72.61.233.124`
2. **New secret**: Name `VPS_USER`, Value `root`

## Step 6: Test the Deployment

1. Make a small change to your code
2. Commit and push to the `main` branch
3. Go to your GitHub repository → **Actions** tab
4. Watch the deployment workflow run!

## Troubleshooting

### "Permission denied (publickey)" error

- Make sure you copied the **public key** (`.pub` file) to your VPS
- Check permissions on VPS: `chmod 700 ~/.ssh` and `chmod 600 ~/.ssh/authorized_keys`

### "Host key verification failed"

This is normal the first time. The workflow handles this automatically.

### Still asks for password

- Verify the public key is in `~/.ssh/authorized_keys` on your VPS
- Make sure there are no extra spaces or line breaks
- Check file permissions: `ls -la ~/.ssh/` on your VPS

## What You've Created

- **Private Key** (`~/.ssh/github_actions_vengrow`): Added to GitHub Secrets
- **Public Key** (`~/.ssh/github_actions_vengrow.pub`): Added to your VPS

**Important**: Never share your private key or commit it to Git!

## Next Steps

Once the secrets are added, your GitHub Actions workflow will automatically:
- Connect to your VPS using the SSH key
- Pull latest code
- Build and deploy your application
- Restart PM2 and reload nginx

You're all set! 🚀

