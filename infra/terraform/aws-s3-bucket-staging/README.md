# AWS S3 bucket - staging

Terraform module for the Finance Dashboard staging environment. FIN-1 adds a static JSON-backed Transactions page with no API, database, auth, queue, or secret requirements, so this module provisions a private S3 bucket for staging static assets and build artifacts only.

## Resources

- `aws_s3_bucket.static_assets`
- `aws_s3_bucket_public_access_block.static_assets`
- `aws_s3_bucket_server_side_encryption_configuration.static_assets`
- `aws_s3_bucket_versioning.static_assets`
- `aws_s3_bucket_ownership_controls.static_assets`

## Usage

```bash
terraform init \
  -backend-config="bucket=<ORG>-terraform-state" \
  -backend-config="key=modules/aws-s3-bucket-staging/terraform.tfstate" \
  -backend-config="region=us-east-1" \
  -backend-config="dynamodb_table=<ORG>-terraform-locks" \
  -backend-config="encrypt=true"

terraform plan -var-file=terraform.tfvars
```

Copy `terraform.tfvars.example` to `terraform.tfvars` and replace placeholder values before planning or applying.

## Inputs

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `aws_region` | AWS region for provider operations. | `string` | `"us-east-1"` |
| `environment` | Deployment environment name. | `string` | `"staging"` |
| `project_name` | Project/application name for bucket naming and tags. | `string` | `"finance-dashboard"` |
| `team` | Team that owns the resource. | `string` | `"finance-app"` |
| `cost_center` | Cost center used for cost allocation tags. | `string` | `"finance-dashboard"` |
| `bucket_name` | Globally unique staging bucket name. When unset, Terraform derives `finance-dashboard-staging-assets`. | `string` | `null` |
| `force_destroy` | Whether Terraform can delete a non-empty bucket. | `bool` | `false` |
| `extra_tags` | Additional AWS tags. | `map(string)` | `{}` |

## Outputs

| Name | Description |
| --- | --- |
| `module_name` | Logical module name. |
| `bucket_id` | S3 bucket ID. |
| `bucket_arn` | S3 bucket ARN. |
| `bucket_region` | AWS region for the S3 bucket. |
| `bucket_regional_domain_name` | Regional DNS name for the S3 bucket. |

## Tags

The AWS provider applies standard default tags to every taggable resource:

- `environment`
- `team`
- `cost-center`
- `managed-by`
- `project`
- `jira-ticket`
- `module`
- `resource-role`

## Manual steps

1. Confirm the organization state bucket and DynamoDB lock table names, then pass them through `terraform init -backend-config`.
2. Choose a globally unique staging bucket name and set it in `terraform.tfvars`.
3. Configure deployment CI/CD to upload the Next.js build artifacts if this bucket becomes the staging artifact destination.
4. If public staging hosting is needed later, add CDN/hosting resources in a separate reviewed change; this module intentionally keeps the bucket private.
