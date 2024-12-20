# GitHub Secrets Configuration Guide

## Deployment Server Secrets
1. `STAGING_SERVER`: IP or hostname of staging server
2. `STAGING_USERNAME`: SSH username for staging server
3. `STAGING_SSH_KEY`: Private SSH key for staging server deployment

4. `PROD_SERVER`: IP or hostname of production server
5. `PROD_USERNAME`: SSH username for production server
6. `PROD_SSH_KEY`: Private SSH key for production server deployment

## Sentry Secrets
7. `SENTRY_DSN_DEVELOPMENT`: Sentry DSN for development environment
8. `SENTRY_DSN_STAGING`: Sentry DSN for staging environment
9. `SENTRY_DSN_PRODUCTION`: Sentry DSN for production environment

## How to Generate and Add Secrets
1. Generate SSH Keys:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "iqube-deployment"
   ```

2. Add public key to server's `~/.ssh/authorized_keys`
3. Add private key as GitHub secret

4. Create Sentry Project:
   - Go to sentry.io
   - Create projects for each environment
   - Copy DSN from each project settings
