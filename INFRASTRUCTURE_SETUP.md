# iQube Protocol Infrastructure Setup Guide

## Prerequisites
1. DigitalOcean Account
2. Cloudflare Account
3. GitHub Account
4. Domain Registration

## Cloud Provider Setup
### DigitalOcean
1. Create DigitalOcean Account
2. Generate API Token
   - Go to API > Tokens/Keys
   - Create New Token with Read/Write Permissions
3. Install DigitalOcean CLI
   ```bash
   brew install doctl
   doctl auth init
   ```

### Cloudflare
1. Register Domain
2. Transfer DNS Management to Cloudflare
3. Generate API Token
   - Go to User Profile > API Tokens
   - Create Token with DNS Edit Permissions

## Server Specifications
### Staging Server
- Size: 2 vCPU, 4GB RAM
- Region: New York (NYC1)
- Image: Docker-enabled Ubuntu 20.04

### Production Server
- Size: 4 vCPU, 8GB RAM
- Region: San Francisco (SFO3)
- Image: Docker-enabled Ubuntu 20.04

## Deployment Architecture
1. Separate servers for staging and production
2. Docker containerization
3. Nginx as reverse proxy
4. Let's Encrypt SSL
5. Cloudflare DNS & CDN

## Security Considerations
- Firewall Rules
- SSH Key Authentication
- Regular Security Updates
- Fail2Ban Installation

## Monitoring Setup
- Sentry for Error Tracking
- Prometheus & Grafana
- DigitalOcean Monitoring

## Estimated Monthly Cost
- Staging: $20-$30
- Production: $40-$60

## Next Steps
1. Run infrastructure setup scripts
2. Configure DNS
3. Deploy initial application
4. Set up monitoring
