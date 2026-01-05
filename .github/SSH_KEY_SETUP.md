# SSH Key Setup for GitHub Actions Deployment

Since GitHub Actions requires SSH key authentication (not passwords), you need to set up SSH key authentication between GitHub Actions and your VPS.

## Option 1: Generate a New SSH Key Pair (Recommended)

### Step 1: Generate SSH Key on Your Local Machine

```bash
# Generate a new SSH key specifically for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-vengrow" -f ~/.ssh/github_actions_vengrow

# When prompted, you can either:
# - Press Enter to use no passphrase (easier for automation)
# - Or set a passphrase (more secure)
```

This creates two files:
- `~/.ssh/github_actions_vengrow` (private key - keep this secret!)
- `~/.ssh/github_actions_vengrow.pub` (public key - add this to your VPS)

### Step 2: Copy Public Key to Your VPS

**Method A: Using ssh-copy-id (if you have password access)**

```bash
ssh-copy-id -i ~/.ssh/github_actions_vengrow.pub root@72.61.233.124
# Enter password when prompted: Venki@459999
```

**Method B: Manual Copy (if ssh-copy-id doesn't work)**

1. Display your public key:
```bash
cat ~/.ssh/github_actions_vengrow.pub
```

2. SSH into your VPS:
```bash
ssh root@72.61.233.124
# Password: Venki@459999
```

3. On your VPS, run these commands:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

Replace `PASTE_YOUR_PUBLIC_KEY_HERE` with the output from step 1.

### Step 3: Test SSH Key Authentication

Test that you can connect without a password:

```bash
ssh -i ~/.ssh/github_actions_vengrow root@72.61.233.124
```

If it connects without asking for a password, you're good to go!

### Step 4: Add Private Key to GitHub Secrets

1. Display your private key:
```bash
cat ~/.ssh/github_actions_vengrow
```

2. Copy the entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

3. Go to your GitHub repository:
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VPS_SSH_PRIVATE_KEY`
   - Value: Paste the entire private key
   - Click "Add secret"

### Step 5: Add Other Secrets (Optional but Recommended)

Add these secrets to make the workflow more flexible:

- **VPS_HOST**: `72.61.233.124`
- **VPS_USER**: `root`
- **VPS_PROJECT_PATH**: `VenGrow` (or your actual project path)
- **VPS_WEB_DIR**: `/var/www/staging.vengrow.net` (or your actual web directory)

## Option 2: Use Existing SSH Key (If You Already Have One)

If you already have an SSH key set up for your VPS:

1. Find your existing private key (usually `~/.ssh/id_rsa` or `~/.ssh/id_ed25519`)
2. Display it: `cat ~/.ssh/id_rsa` (or your key file)
3. Add it to GitHub Secrets as `VPS_SSH_PRIVATE_KEY`

**Note**: Make sure the corresponding public key is in `~/.ssh/authorized_keys` on your VPS.

## Troubleshooting

### "Permission denied (publickey)" Error

- Verify the public key is in `~/.ssh/authorized_keys` on your VPS
- Check file permissions on VPS:
  ```bash
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  ```
- Ensure the private key in GitHub Secrets includes the header/footer lines

### "Host key verification failed"

The workflow automatically adds the host to known_hosts, but if you see this error, you can manually add it:

```bash
ssh-keyscan -H 72.61.233.124 >> ~/.ssh/known_hosts
```

### Still Using Password?

If you want to keep using password authentication for manual SSH, that's fine! The SSH key is only for GitHub Actions automation. You can still use:
```bash
ssh root@72.61.233.124
# Password: Venki@459999
```

## Security Best Practices

1. **Never commit SSH keys to Git** - Always use GitHub Secrets
2. **Use a dedicated key for CI/CD** - Don't reuse your personal SSH key
3. **Rotate keys periodically** - Generate new keys every 6-12 months
4. **Limit key access** - Consider using a non-root user with sudo privileges instead of root

## Quick Reference

Your VPS Details:
- **Host**: `72.61.233.124`
- **User**: `root`
- **Password**: `Venki@459999` (for manual access only)

After setup, GitHub Actions will use SSH key authentication automatically.

