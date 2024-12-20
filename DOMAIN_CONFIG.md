# iQube Protocol Domain Configuration

## Domains
- Production: `iqube.network`
- Staging: `staging.iqube.network`

## DNS Configuration Checklist

### Cloudflare DNS Records
1. A Records
   ```
   @ IN A [PRODUCTION_IP]
   www IN A [PRODUCTION_IP]
   staging IN A [STAGING_IP]
   ```

2. CNAME Records
   ```
   api IN CNAME [PRODUCTION_DOMAIN]
   staging-api IN CNAME [STAGING_DOMAIN]
   ```

3. MX Records (Optional Email)
   ```
   @ IN MX 1 mailhost.iqube.com
   ```

## SSL/TLS Settings
- Full (strict) SSL/TLS encryption mode
- Automatic HTTPS Rewrites
- Minimum TLS Version: 1.2

## Performance & Security
- Enable Cloudflare CDN
- Web Application Firewall (WAF)
- Bot Fight Mode
- Challenge Passage

## Recommended DNS Providers
1. Cloudflare (Recommended)
2. Google Domains
3. Namecheap

## IP Address Placeholders
- Production IP: `[TO_BE_DETERMINED]`
- Staging IP: `[TO_BE_DETERMINED]`

## Verification Steps
1. Confirm DNS Propagation
2. Test SSL Certificate
3. Verify Redirects
4. Check Performance

## Estimated Costs
- Domain Registration: $10-$15/year
- SSL Certificate: Free (Let's Encrypt)
- Cloudflare: Free Tier Sufficient
