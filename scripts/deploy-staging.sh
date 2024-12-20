#!/bin/bash

# Staging Deployment Script for iQube Protocol

# Exit on any error
set -e

# Configuration
REPO_DIR="/Users/hal1/Desktop/CascadeProjects/iQube-Protocol-Dev"
STAGING_DOMAIN="staging.iqube.network"
STAGING_SERVER="staging.iqube.network"
STAGING_USER="iqube-deploy"
DEPLOY_PATH="/var/www/staging.iqube.network"

# Deployment Workflow
main() {
    # 1. Verify Current Branch
    verify_branch

    # 2. Build Production Assets
    build_assets

    # 3. Prepare Deployment Package
    prepare_package

    # 4. Deploy to Staging Server
    deploy_to_server

    # 5. Verify Deployment
    verify_deployment
}

verify_branch() {
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$current_branch" != "staging" ]]; then
        echo "Error: Must be on 'staging' branch. Current branch: $current_branch"
        exit 1
    fi
}

build_assets() {
    echo "Building staging assets..."
    npm run build:staging
}

prepare_package() {
    echo "Creating deployment package..."
    tar -czvf staging-deploy.tar.gz dist
}

deploy_to_server() {
    echo "Deploying to staging server..."
    
    # Copy package to server
    scp staging-deploy.tar.gz ${STAGING_USER}@${STAGING_SERVER}:~/

    # SSH and extract/deploy
    ssh ${STAGING_USER}@${STAGING_SERVER} << DEPLOY_COMMANDS
        # Create backup of current deployment
        mkdir -p ~/deployments/backup
        cp -r ${DEPLOY_PATH}/* ~/deployments/backup/

        # Extract new deployment
        tar -xzvf ~/staging-deploy.tar.gz -C ${DEPLOY_PATH}

        # Set correct permissions
        chown -R www-data:www-data ${DEPLOY_PATH}
        chmod -R 755 ${DEPLOY_PATH}

        # Restart web server
        systemctl restart nginx
DEPLOY_COMMANDS

    # Clean up local package
    rm staging-deploy.tar.gz
}

verify_deployment() {
    # Perform health check
    deployment_status=$(curl -s -o /dev/null -w "%{http_code}" https://${STAGING_DOMAIN})
    
    if [[ "$deployment_status" == "200" ]]; then
        echo "✅ Staging deployment successful!"
        echo "🌐 Access at: https://${STAGING_DOMAIN}"
    else
        echo "❌ Deployment verification failed. Status code: $deployment_status"
        exit 1
    fi
}

# Logging
log_deployment() {
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] Deployment to $STAGING_DOMAIN completed" >> ~/deployment.log
}

# Error Handling
trap 'handle_error' ERR

handle_error() {
    echo "❌ Deployment failed at $(date)"
    # Optional: Send notification to deployment team
}

# Execute Main Deployment
main
log_deployment
