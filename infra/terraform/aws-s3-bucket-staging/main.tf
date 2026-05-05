terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "<ORG>-terraform-state"
    key            = "modules/aws-s3-bucket-staging/terraform.tfstate"
    region         = "<REGION>"
    dynamodb_table = "<ORG>-terraform-locks"
    encrypt        = true
  }
}

locals {
  module_name = "aws-s3-bucket-staging"
  bucket_name = coalesce(
    var.bucket_name,
    lower(replace("${var.project_name}-${var.environment}-assets", "_", "-")),
  )

  standard_tags = {
    environment     = var.environment
    team            = var.team
    "cost-center"   = var.cost_center
    "managed-by"    = "terraform"
    project         = var.project_name
    "jira-ticket"   = "FIN-1"
    module          = local.module_name
    "resource-role" = "static-assets"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(local.standard_tags, var.extra_tags)
  }
}

resource "aws_s3_bucket" "static_assets" {
  bucket        = local.bucket_name
  force_destroy = var.force_destroy

  tags = merge(local.standard_tags, var.extra_tags, {
    Name = local.bucket_name
  })
}

resource "aws_s3_bucket_public_access_block" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  versioning_configuration {
    status = "Enabled"
  }
}
