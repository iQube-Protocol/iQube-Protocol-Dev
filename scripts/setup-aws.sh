#!/bin/bash

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY."
    exit 1
fi

# Function to create S3 bucket with website hosting
create_s3_bucket() {
    local bucket_name=$1
    local region=$2

    echo "Creating S3 bucket: $bucket_name"
    aws s3api create-bucket \
        --bucket "$bucket_name" \
        --region "$region" \
        --create-bucket-configuration LocationConstraint="$region"

    # Enable website hosting
    aws s3 website "s3://$bucket_name" \
        --index-document index.html \
        --error-document index.html

    # Set bucket policy for public read access
    cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucket_name/*"
        }
    ]
}
EOF

    aws s3api put-bucket-policy \
        --bucket "$bucket_name" \
        --policy file:///tmp/bucket-policy.json

    # Enable CORS
    cat > /tmp/cors-policy.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": [],
            "MaxAgeSeconds": 3000
        }
    ]
}
EOF

    aws s3api put-bucket-cors \
        --bucket "$bucket_name" \
        --cors-configuration file:///tmp/cors-policy.json

    echo "S3 bucket $bucket_name created and configured successfully"
}

# Function to create CloudFront distribution
create_cloudfront_distribution() {
    local bucket_name=$1
    local domain_name="$bucket_name.s3.amazonaws.com"

    # Create CloudFront distribution
    cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$bucket_name",
                "DomainName": "$domain_name",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$bucket_name",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"],
            "CachedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            }
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Comment": "Distribution for $bucket_name",
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "PriceClass": "PriceClass_100",
    "ViewerCertificate": {
        "CloudFrontDefaultCertificate": true
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    }
}
EOF

    distribution_id=$(aws cloudfront create-distribution \
        --distribution-config file:///tmp/cloudfront-config.json \
        --query 'Distribution.Id' \
        --output text)

    echo "CloudFront distribution created with ID: $distribution_id"
    echo "Please save this ID as it will be needed for GitHub Actions"
}

# Main execution
REGION="us-east-1"
STAGING_BUCKET="staging-iqube-protocol"
PRODUCTION_BUCKET="iqube-protocol"

# Create staging environment
create_s3_bucket "$STAGING_BUCKET" "$REGION"
create_cloudfront_distribution "$STAGING_BUCKET"

# Create production environment
create_s3_bucket "$PRODUCTION_BUCKET" "$REGION"
create_cloudfront_distribution "$PRODUCTION_BUCKET"

echo "Setup complete! Please save the CloudFront distribution IDs and configure them in GitHub Secrets."
