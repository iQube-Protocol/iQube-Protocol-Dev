# iQube Protocol: Comprehensive Build and Deployment Manual

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Infrastructure Architecture](#infrastructure-architecture)
5. [Deployment Environments](#deployment-environments)
6. [Security Configuration](#security-configuration)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Troubleshooting](#troubleshooting)

## Project Overview
iQube Protocol is a blockchain-enabled web application designed for secure, cross-chain interactions and NFT management.

### Key Components
- Frontend: React with Vite
- Blockchain Integration: Polygon, Avalanche
- State Management: React Hooks
- Styling: Tailwind CSS
- Deployment: DigitalOcean
- Monitoring: Sentry

## Prerequisites

### Software Requirements
- Node.js (v20.x)
- npm (v10.x)
- Git
- Docker
- Homebrew (macOS)

### Development Tools
- Visual Studio Code
- Windsurf IDE
- GitHub CLI
- Postman/Insomnia

### Blockchain Wallets
- MetaMask
- WalletConnect
- Coinbase Wallet

## Local Development Setup

### 1. Clone Repository
```bash
git clone git@github.com:iQube-Protocol/Front_Endv2.git
cd Front_Endv2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env` files in project root:
- `.env.development`
- `.env.staging`
- `.env.production`

#### Sample .env Configuration
```
VITE_APP_ENV=development
VITE_API_BASE_URL=https://api.staging.iqube.network
VITE_BLOCKCHAIN_NETWORK=polygon-mumbai
VITE_SENTRY_DSN=[YOUR_SENTRY_DSN]
```

### 4. Start Development Server
```bash
npm run dev
```

## Infrastructure Architecture

### Cloud Provider: DigitalOcean
- **Staging Server**
  - 2 vCPU
  - 4GB RAM
  - Location: NYC1

- **Production Server**
  - 4 vCPU
  - 8GB RAM
  - Location: SFO3

### Deployment Strategy
- Containerization with Docker
- Nginx Reverse Proxy
- Let's Encrypt SSL
- Cloudflare CDN

## Deployment Environments

### Branches
- `main`: Production
- `staging`: Staging/Testing
- `development`: Active Development

### Continuous Integration
GitHub Actions workflow:
- Lint code
- Run unit tests
- Build application
- Deploy to appropriate environment

## Security Configuration

### API Token Management
1. Generate tokens for:
   - DigitalOcean
   - Cloudflare

2. Secure Storage
```bash
# Use provided manage-tokens.sh script
/scripts/manage-tokens.sh
```

### SSL/TLS Configuration
- Minimum TLS Version: 1.2
- Cloudflare Full (Strict) Encryption
- Let's Encrypt Certificates

## Monitoring and Logging

### Error Tracking
- Sentry Integration
- Environment-specific error reporting
- Performance monitoring

### Logging Levels
- Development: DEBUG
- Staging: INFO
- Production: ERROR

## Troubleshooting

### Common Issues
1. Dependency Conflicts
   - Delete `node_modules`
   - Run `npm cache clean --force`
   - Reinstall dependencies

2. Blockchain Connection
   - Check MetaMask network
   - Verify wallet permissions
   - Restart application

3. Deployment Failures
   - Check GitHub Actions logs
   - Verify environment variables
   - Confirm server connectivity

### Support Channels
- GitHub Issues
- Discord Community
- Email: support@iqube.com

## Contributing

### Code Style
- Follow ESLint rules
- Use Prettier for formatting
- Write comprehensive tests

### Pull Request Process
1. Fork repository
2. Create feature branch
3. Commit changes
4. Open pull request to `development`

## Versioning
Semantic Versioning (SemVer)
- Major.Minor.Patch
- Example: 1.2.3

## License
[Insert License Details]

---

**Last Updated**: 2024-12-19
**Version**: 1.0.0
