terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    onepassword = {
      source  = "1Password/onepassword"
      version = "~> 1.1.4"
    }
  }
  backend "s3" {}
}

provider "onepassword" {
  url = "https://1password.connect.lock-book.com"
}

data "onepassword_vault" "terraform" {
  name = var.onepassword_vault
}

# Reference infrastructure from "global"
data "terraform_remote_state" "global" {
  backend = "s3"

  config = {
    region = "eu-central-1"
    bucket = "lock-book-tfstate"
    key    = "states/lb/global/tfstate"
  }
}

data "terraform_remote_state" "project" {
  backend = "s3"

  config = {
    region = "eu-central-1"
    bucket = "lock-book-tfstate"
    key    = "states/lb/auth-web/tfstate"
  }
}

# Translate branch_name to different environment values
module "environment" {
  source      = "git@github.com:abs-safety/terraform-modules.git//modules/environment?ref=v0.0.21"
  branch_name = var.branch_name
}

# Configure the AWS Provider
provider "aws" {
  region = data.terraform_remote_state.global.outputs.aws_region

  default_tags {
    tags = merge({
      Iac         = "true",
      Product     = local.name,
      Environment = module.environment.environment
    }, var.tags)
  }
}

data "aws_caller_identity" "current" {}

resource "aws_kms_key" "secrets" {
  description         = "Auth Frontend Secrets Manager (${module.environment.short})"
  enable_key_rotation = true
}

resource "aws_kms_alias" "secrets" {
  name          = "alias/${local.prefix}${local.name}-secrets"
  target_key_id = aws_kms_key.secrets.key_id
}

resource "aws_secretsmanager_secret" "main" {
  name       = "${local.prefix}${local.name}"
  kms_key_id = aws_kms_key.secrets.arn
}

resource "aws_secretsmanager_secret_version" "main" {
  secret_id = aws_secretsmanager_secret.main.id
  secret_string = jsonencode({
    LACEWORK_ACCESS_TOKEN = var.lacework_access_token
  })
}

data "aws_ecr_repository" "repo" {
  name = var.ecr_repository_name
}

module "service" {
  source = "git@github.com:abs-safety/terraform-modules.git//modules/service?ref=v0.0.21"

  name              = local.name
  host              = "hub.${local.domain}"
  prefix            = local.prefix
  service_port      = 80
  environment       = module.environment.environment
  short_environment = module.environment.short
  image             = "${data.aws_ecr_repository.repo.repository_url}:${var.commit_hash}"
  health_check_path = "/"
  desired_count     = 1
  cpu               = 1024
  memory            = 2048
  onepassword_vault = var.onepassword_vault
  docker_labels = {
    "com.lock-book.product" = "Auth"
  }
  docker_cmd = [
    "/bin/sh",
    "-c",
    "/var/lib/lacework-backup/lacework-sidecar.sh -U $LaceworkServerUrl && envsubst '$NGINX_HOST' < /etc/nginx/conf.d/nginx.template.conf > /etc/nginx/conf.d/default.conf && cat /etc/nginx/conf.d/default.conf && rm /etc/nginx/conf.d/nginx.template.conf && exec nginx -g 'daemon off;'"
  ]

  lb_listener_arn = data.terraform_remote_state.global.outputs.main_tls_lb_listener_arn
  domain_name     = data.terraform_remote_state.global.outputs.domain_name
  subnet_ids      = data.terraform_remote_state.global.outputs.private_subnet_ids
  ecs_cluster_id  = data.terraform_remote_state.global.outputs.aws_ecs_cluster_ids[local.ecs_cluster_key]
  aws_logs_region = data.terraform_remote_state.global.outputs.aws_region
  service_environment = {
    NGINX_HOST           = "hub.${local.domain}"
    INSTANA_SERVICE_NAME = "auth-web"

    # LaceWork
    LaceworkServerUrl = "https://api.fra.lacework.net"
  }

  service_secrets = {
    LaceworkAccessToken = "${aws_secretsmanager_secret_version.main.arn}:LACEWORK_ACCESS_TOKEN::"
  }
}

resource "aws_iam_role_policy" "password_policy_secretsmanager" {
  name = "${local.prefix}${local.name}-password-policy-secretsmanager"
  role = module.service.ecs_task_execution_role.name

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": [
          "kms:Decrypt",
          "secretsmanager:GetSecretValue"
        ],
        "Effect": "Allow",
        "Resource": [
          "${aws_secretsmanager_secret_version.main.arn}",
          "${aws_kms_key.secrets.arn}"
        ]
      }
    ]
  }
  EOF
}
