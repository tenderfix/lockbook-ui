variable "branch_name" {
  description = "The current branch name (e. g. main, staging, develop)"
  type        = string
}

variable "commit_hash" {
  description = "The current commit hash that can be used to uniquely identify this deployment"
  type        = string
}

variable "ecr_repository_name" {
  description = "The ecr repository that is used to store the api images in"
  type        = string
}

variable "onepassword_vault" {
  description = "The name of the 1password vault passwords get stored in"
  default     = "Terraform" #tfsec:ignore:GEN001
  type        = string
}

variable "lacework_access_token" {
  description = "The lacework access token"
  type        = string
}

variable "ecs_cluster_key" {
  description = "Which ECS cluster to use. In most cases this is derived from the current branch name."
  default     = ""
  type        = string
}

variable "tags" {
  description = "Additional default tags for all aws resources"
  default     = {}
}
