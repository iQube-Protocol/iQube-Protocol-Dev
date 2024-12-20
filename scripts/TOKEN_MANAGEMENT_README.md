# API Token Management Guide

## Prerequisites
- GPG installed
- Terminal access

## Token Storage Locations
- Encrypted tokens stored in: `~/.iqube_tokens/`
- Encrypted files: 
  - `digitalocean.gpg`
  - `cloudflare.gpg`

## How to Use the Token Management Script

### 1. Store a Token
1. Run the script
2. Choose "Store DigitalOcean Token" or "Store Cloudflare Token"
3. Enter the token when prompted
4. Token will be encrypted and stored securely

### 2. Retrieve a Token
1. Run the script
2. Choose "Retrieve DigitalOcean Token" or "Retrieve Cloudflare Token"
3. Enter your GPG decryption passphrase
4. Token will be displayed

## Security Notes
- Tokens are encrypted with GPG
- Only accessible with your passphrase
- Store passphrase securely
- Rotate tokens periodically

## Troubleshooting
- Ensure GPG is installed
- Check file permissions
- Verify token file exists in `~/.iqube_tokens/`

## Recommended Token Sources
- DigitalOcean: Account > API > Tokens/Keys
- Cloudflare: User Profile > API Tokens
