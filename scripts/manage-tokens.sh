#!/bin/bash

# API Token Management Script

# Secure Token Storage Directory
TOKEN_DIR="$HOME/.iqube_tokens"
mkdir -p "$TOKEN_DIR"
chmod 700 "$TOKEN_DIR"

# Function to store token
store_token() {
    local service=$1
    local token=$2
    
    # Securely store token
    echo "$token" | gpg --symmetric --output "$TOKEN_DIR/$service.gpg"
    echo "Token for $service stored securely"
}

# Function to retrieve token
get_token() {
    local service=$1
    
    # Decrypt and display token
    gpg --decrypt "$TOKEN_DIR/$service.gpg"
}

# Main menu
while true; do
    echo "iQube Protocol - Token Management"
    echo "1. Store DigitalOcean Token"
    echo "2. Store Cloudflare Token"
    echo "3. Retrieve DigitalOcean Token"
    echo "4. Retrieve Cloudflare Token"
    echo "5. Exit"
    
    read -p "Choose an option: " choice
    
    case $choice in
        1)
            read -sp "Enter DigitalOcean Token: " do_token
            store_token "digitalocean" "$do_token"
            ;;
        2)
            read -sp "Enter Cloudflare Token: " cf_token
            store_token "cloudflare" "$cf_token"
            ;;
        3)
            get_token "digitalocean"
            ;;
        4)
            get_token "cloudflare"
            ;;
        5)
            exit 0
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done
