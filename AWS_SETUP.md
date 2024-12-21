# AWS Setup Guide for iQube Protocol

## Prerequisites
1. AWS Account with administrative access
2. AWS CLI installed locally
3. GitHub repository access

## Step 1: Create AWS IAM User

1. Go to AWS IAM Console
2. Create a new IAM user:
   ```bash
   User name: iqube-protocol-ci
   Access type: Programmatic access
   ```

3. Attach the following policies:
   - AmazonS3FullAccess
   - CloudFrontFullAccess

4. Save the Access Key ID and Secret Access Key

## Step 2: Configure AWS CLI

```bash
aws configure
```
Enter the credentials from Step 1.

## Step 3: Run Infrastructure Setup Script

```bash
export AWS_ACCESS_KEY_ID='your_access_key'
export AWS_SECRET_ACCESS_KEY='your_secret_key'
./scripts/setup-aws.sh
```

Save the CloudFront Distribution IDs displayed at the end of the script.

## Step 4: Add GitHub Secrets

Go to your GitHub repository settings and add these secrets:

1. AWS Credentials:
   ```
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   ```

2. S3 Bucket Names:
   ```
   STAGING_BUCKET_NAME=staging-iqube-protocol
   PRODUCTION_BUCKET_NAME=iqube-protocol
   ```

3. CloudFront Distribution IDs:
   ```
   STAGING_DISTRIBUTION_ID=[ID from setup script]
   PRODUCTION_DISTRIBUTION_ID=[ID from setup script]
   ```

## Step 5: Verify Setup

1. Push a commit to the staging branch
2. Check GitHub Actions to verify the deployment
3. Access your site at the CloudFront URL

## Domain Configuration

After setup is complete, you can configure custom domains:

1. Add your domain in AWS Certificate Manager
2. Update CloudFront distribution with the certificate
3. Create Route 53 records or update your DNS provider

## Troubleshooting

1. If deployment fails:
   - Check GitHub Actions logs
   - Verify AWS credentials
   - Ensure bucket names are correct

2. If site is not accessible:
   - Check CloudFront distribution status
   - Verify S3 bucket permissions
   - Check for any CloudFront cache invalidation issues

## Security Notes

- Never commit AWS credentials to the repository
- Regularly rotate AWS access keys
- Monitor AWS CloudWatch for any unusual activity
- Enable AWS CloudTrail for audit logging
