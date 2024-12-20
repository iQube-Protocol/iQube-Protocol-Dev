#!/bin/bash

# SSL and Domain Configuration Script for iQube Protocol

# Cloud Provider Configuration
CLOUD_PROVIDER="DigitalOcean"  # or AWS, GCP, etc.

# Domains and Server Details
declare -A ENVIRONMENTS=(
    ["staging"]="staging.iqube.network"
    ["production"]="iqube.network"
)

# Server Specifications
declare -A SERVER_SPECS=(
    ["staging_size"]="s-2vcpu-4gb"
    ["production_size"]="s-4vcpu-8gb"
    ["staging_region"]="nyc1"
    ["production_region"]="sfo3"
)

# Networking Configuration
configure_network() {
    local ENV=$1
    local DOMAIN=${ENVIRONMENTS[$ENV]}
    local REGION=${SERVER_SPECS[${ENV}_region]}

    # Create Firewall Rules
    doctl compute firewall create \
        --name "iqube-${ENV}-firewall" \
        --inbound-rules "protocol:tcp,ports:22,sources:ip-list:office-ips protocol:tcp,ports:80,sources:anywhere protocol:tcp,ports:443,sources:anywhere" \
        --outbound-rules "protocol:tcp,destinations:anywhere protocol:udp,destinations:anywhere"

    # Create Floating IP for High Availability
    FLOATING_IP=$(doctl compute floating-ip create --region "$REGION" --output text)
    
    echo "Floating IP for $ENV: $FLOATING_IP"
}

# Server Provisioning
create_server() {
    local ENV=$1
    local DOMAIN=${ENVIRONMENTS[$ENV]}
    local SIZE=${SERVER_SPECS[${ENV}_size]}
    local REGION=${SERVER_SPECS[${ENV}_region]}

    # Create Droplet with Docker Preinstalled
    SERVER_ID=$(doctl compute droplet create "iqube-${ENV}" \
        --image docker-20-04 \
        --size "$SIZE" \
        --region "$REGION" \
        --ssh-keys "$(doctl compute ssh-key list --no-header --format ID)" \
        --output text)

    # Wait for server creation
    sleep 60

    # Get Server IP
    SERVER_IP=$(doctl compute droplet get "$SERVER_ID" --format PublicIPv4 --no-header)
    
    echo "Server created for $ENV at IP: $SERVER_IP"
    
    # Configure Networking
    configure_network "$ENV"

    # Return Server Details
    echo "$SERVER_ID:$SERVER_IP"
}

# SSL and Domain Setup
setup_domain_ssl() {
    local ENV=$1
    local DOMAIN=${ENVIRONMENTS[$ENV]}
    local SERVER_IP=$2

    # Cloudflare DNS Configuration
    cloudflare-cli zone dns create \
        --zone "$DOMAIN" \
        --name "@" \
        --type "A" \
        --content "$SERVER_IP" \
        --ttl 3600 \
        --proxy

    # SSL Certificate with Certbot
    ssh "root@$SERVER_IP" <<EOF
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    certbot certonly \
        --standalone \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        --agree-tos \
        --email "ssl@iqube.com" \
        --non-interactive
EOF
}

# Main Execution
main() {
    # Create Servers
    IFS=':' read -r STAGING_ID STAGING_IP <<< "$(create_server "staging")"
    IFS=':' read -r PROD_ID PROD_IP <<< "$(create_server "production")"

    # Setup Domains and SSL
    setup_domain_ssl "staging" "$STAGING_IP"
    setup_domain_ssl "production" "$PROD_IP"

    # Output Summary
    cat << EOF > server_details.txt
Staging Server:
- ID: $STAGING_ID
- IP: $STAGING_IP
- Domain: ${ENVIRONMENTS[staging]}

Production Server:
- ID: $PROD_ID
- IP: $PROD_IP
- Domain: ${ENVIRONMENTS[production]}
EOF

    echo "Infrastructure setup completed successfully!"
}

# Prerequisite Check
check_prerequisites() {
    # Check required CLIs
    for cmd in doctl cloudflare-cli; do
        if ! command -v "$cmd" &> /dev/null; then
            echo "Error: $cmd is not installed"
            exit 1
        fi
    done
}

# Run the script
check_prerequisites
main
