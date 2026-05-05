variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "staging"
}

variable "team" {
  description = "Team responsible for this infrastructure."
  type        = string
  default     = "finance-app"
}

variable "cost_center" {
  description = "Cost center used for billing attribution."
  type        = string
  default     = "finance-dashboard"
}

variable "aws_region" {
  description = "AWS region where the staging bucket will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project/application name used in default resource names and tags."
  type        = string
  default     = "finance-dashboard"
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name for staging static assets/build artifacts."
  type        = string
  default     = null
}

variable "force_destroy" {
  description = "Allow Terraform to delete all bucket objects when destroying the staging bucket."
  type        = bool
  default     = false
}

variable "extra_tags" {
  description = "Additional tags to apply to taggable resources."
  type        = map(string)
  default     = {}
}
