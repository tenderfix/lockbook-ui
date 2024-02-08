terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    sentry = {
      source  = "jianyuan/sentry"
      version = "0.11.2"
    }

  }
  backend "s3" {}
}

data "terraform_remote_state" "global" {
  backend = "s3"

  config = {
    region = "eu-central-1"
    bucket = "lock-book-tfstate"
    key    = "states/lb/global/tfstate"
  }
}

provider "sentry" {
  token = var.sentry_token
}

# Configure the AWS Provider
provider "aws" {
  region = data.terraform_remote_state.global.outputs.aws_region
  default_tags {
    tags = merge({
      Iac         = "true",
      Product     = "auth-web",
      Environment = "production"
      Shared      = "true"
    }, var.tags)
  }
}

resource "aws_kms_key" "repo" {
  description         = "Auth Frontend ECR Repo Key"
  enable_key_rotation = true
}

resource "aws_ecr_repository" "repo" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "IMMUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = aws_kms_key.repo.arn
  }
}
