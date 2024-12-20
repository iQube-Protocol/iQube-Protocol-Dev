# iQube Protocol Development Environment Guide

## Repository Structure
- `staging`: Stable version ready for testing
- `development`: Active development branch
- `main`: Production-ready code

## Workflow
1. Make changes in the `development` branch
2. Create pull requests to merge into `staging`
3. After thorough testing, merge `staging` to `main`

## Setup Instructions
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Deployment
- Staging: Deployed to internal testing environment
- Production: Will be published to public domain

## Best Practices
- Always create a new branch for features
- Write comprehensive tests
- Keep commits small and focused
- Update documentation with significant changes
