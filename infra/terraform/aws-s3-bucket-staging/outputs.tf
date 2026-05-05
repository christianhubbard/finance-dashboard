output "module_name" {
  description = "Logical Terraform module name."
  value       = local.module_name
}

output "bucket_id" {
  description = "Name of the staging artifact bucket."
  value       = aws_s3_bucket.static_assets.id
}

output "bucket_arn" {
  description = "ARN of the staging artifact bucket."
  value       = aws_s3_bucket.static_assets.arn
}

output "bucket_region" {
  description = "AWS region hosting the staging artifact bucket."
  value       = var.aws_region
}

output "bucket_regional_domain_name" {
  description = "Regional DNS name of the staging artifact bucket."
  value       = aws_s3_bucket.static_assets.bucket_regional_domain_name
}
