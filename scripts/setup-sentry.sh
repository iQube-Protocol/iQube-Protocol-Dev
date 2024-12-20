#!/bin/bash

# Sentry Project Setup Script for iQube Protocol

# Configuration
ORG_NAME="iqube-protocol"
TEAM_NAME="iqube-team"
ENVIRONMENTS=("development" "staging" "production")

# Check if Sentry CLI is installed
if ! command -v sentry-cli &> /dev/null
then
    echo "Sentry CLI not found. Installing..."
    npm install -g @sentry/cli
fi

# Authenticate with Sentry
sentry-cli login

# Create Sentry projects for each environment
create_sentry_project() {
    local ENV=$1
    local PROJECT_NAME="iQube-${ENV^}"
    
    echo "Creating Sentry project for $ENV environment..."
    
    PROJECT_SLUG=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
    
    sentry-cli projects create \
        --organization "$ORG_NAME" \
        --team "$TEAM_NAME" \
        --platform "javascript-react" \
        "$PROJECT_SLUG"
    
    # Retrieve and display DSN
    DSN=$(sentry-cli project get "$PROJECT_SLUG" | grep "dsn:" | cut -d' ' -f2)
    echo "DSN for $ENV: $DSN"
    
    # Optionally, write DSN to a secure configuration file
    echo "$DSN" > "../.sentry-dsn-$ENV.txt"
}

# Create projects for each environment
for ENV in "${ENVIRONMENTS[@]}"; do
    create_sentry_project "$ENV"
done

echo "Sentry projects created successfully!"
echo "DSNs have been saved in .sentry-dsn-* files. Update .env files accordingly."
