---
name: generate-terraform-module
description: Scaffolds a Terraform module from provider, resource type, and environment — producing main.tf, variables.tf, outputs.tf, terraform.tfvars.example, and README.md with standard tags, remote backend pattern, and post-generation fmt/validate. Use when the user asks to generate, scaffold, or bootstrap a Terraform module for AWS, Azure, or GCP.
disable-model-invocation: true
---

# Generate Terraform module

## Inputs (collect first)

1. **Cloud provider**: `aws` | `azure` | `gcp` (normalize to lowercase).
2. **Resource type**: short kebab-case slug describing the primary resource (e.g. `s3-bucket`, `key-vault`, `cloud-sql`).
3. **Environment**: e.g. `dev`, `staging`, `prod` (kebab-case or lowercase; use consistently in names and tags).

Derive **module directory name** and logical **module name**:

- Pattern: `<provider>-<resource>-<environment>` (all lowercase, hyphen-separated).
- Example: `aws-s3-bucket-prod`.

If any input is missing, ask once for the missing fields before generating files.

## Files to create

In the target directory (user-provided or default to the module name folder), create exactly:

| File | Purpose |
|------|---------|
| `main.tf` | Provider config, `terraform` block (backend below), core resources (minimal sensible skeleton with `TODO` for resource-specific attributes). |
| `variables.tf` | Input variables including `environment`, `team`, `cost_center`, and any resource inputs. |
| `outputs.tf` | Outputs for resource IDs/names the module consumer needs. |
| `terraform.tfvars.example` | Example values; never commit secrets — use placeholders. |
| `README.md` | Purpose, usage, inputs/outputs table, backend note, tagging note, security-review flag if applicable. |

Do not add extra root-level `.tf` files unless required for providers/versions; prefer a single `versions.tf` **only** if splitting improves clarity — otherwise merge `required_version` and `required_providers` into `main.tf` to keep the five-file contract.

## Standard tags

All taggable resources must receive:

| Key | Source |
|-----|--------|
| `environment` | Variable (same as environment input). |
| `team` | Variable (string). |
| `cost-center` | Variable (string); HCL identifier `cost_center`, map to provider key `cost-center` where applicable. |
| `managed-by` | Literal `terraform`. |

**Provider mapping:**

- **AWS**: Use `default_tags` on the `aws` provider block merging the above as tags. Use `merge(local.standard_tags, var.extra_tags)` where needed.
- **Azure**: `tags = merge(local.standard_tags, var.extra_tags)` on resources; locals should use `cost-center` and `managed-by` as Azure tag keys.
- **GCP**: Use `labels` where supported; keys must be lowercase letters, digits, underscores — use `cost_center` and `managed_by` if `cost-center` is invalid for labels, and document the mapping in README.

## Remote state (backend pattern)

Use the **organization backend pattern** below. Replace placeholder values with project/organization defaults: state bucket/storage account, lock table (AWS), region/location, container/prefix, encrypt flags.

### AWS (`backend "s3"`)

```hcl
terraform {
  backend "s3" {
    bucket         = "<ORG>-terraform-state"
    key            = "modules/<MODULE_NAME>/terraform.tfstate"
    region         = "<REGION>"
    dynamodb_table = "<ORG>-terraform-locks"
    encrypt        = true
  }
}
```

### Azure (`backend "azurerm"`)

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "<RG_NAME>"
    storage_account_name = "<STORAGE_ACCOUNT>"
    container_name       = "tfstate"
    key                  = "modules/<MODULE_NAME>.tfstate"
  }
}
```

### GCP (`backend "gcs"`)

```hcl
terraform {
  backend "gcs" {
    bucket = "<ORG>-terraform-state"
    prefix = "modules/<MODULE_NAME>"
  }
}
```

In README, state that operators must run `terraform init -backend-config=...` or use CI-supplied partial backend config if the org uses that pattern.

## Minimal structural expectations

- `variables.tf`: Define `environment`, `team`, `cost_center`, optional `extra_tags` / `additional_labels`, plus resource-specific variables with descriptions and types.
- `main.tf`: Include `terraform` block with `required_version` (conservative recent, e.g. `>= 1.6.0`) and `required_providers` for the chosen cloud. Add a **minimal** resource skeleton (or `TODO` comment block) for the named resource type — do not invent large unmaintainable blobs.
- `outputs.tf`: At minimum `module_name` or resource id/name outputs as appropriate.
- `terraform.tfvars.example`: Fill example non-secret values.

## After writing files

1. **Format**: From the module directory, run:

   ```bash
   terraform fmt -recursive
   ```

2. **Validate** (only if Terraform CLI is available):

   ```bash
   terraform init -backend=false
   terraform validate
   ```

   If `terraform` is not installed or the command fails, note that in the README or chat output and skip validate — do not block completion.

## Manual security review flag

After generation, assess whether the **resource type** or skeleton touches **network boundaries** or **identity/access control**. If yes, prepend a clear notice to `README.md` and state it in the response.

**Treat as requiring manual security review** when the resource type or `main.tf` content includes any of (case-insensitive substring match):

- Networking: `vpc`, `subnet`, `route`, `gateway`, `nat`, `firewall`, `nsg`, `load_balancer`, `alb`, `nlb`, `endpoint`, `peering`, `vpn`, `eip`, `cidr`, `network`.
- IAM / identity: `iam`, `role`, `policy`, `principal`, `rbac`, `service_account`, `key`, `kms` (when tied to access policies), `identity`, `permission`, `group`, `admin`.

**README notice block** (when flagged):

```markdown
> **Security review required**: This module involves networking and/or IAM. Have infrastructure/security review changes before apply in any shared or production environment.
```

## Examples

**Example 1 — AWS S3 bucket, prod**

- Inputs: AWS, `s3-bucket`, `prod`
- Folder: `aws-s3-bucket-prod/`
- Backend key uses `MODULE_NAME` = `aws-s3-bucket-prod`
- Flag security review if public access or bucket policies are added; a plain private bucket stub may still warrant review if IAM policies are included.

**Example 2 — GCP VPC, dev**

- Inputs: GCP, `vpc`, `dev`
- Folder: `gcp-vpc-dev/`
- Flag security review (networking).
