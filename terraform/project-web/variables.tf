variable "ecr_repository_name" {
  description = "The name for the ecr repository to store the frontend images"
  type        = string
}

variable "tags" {
  description = "Additional default tags for all aws resources"
  default     = {}
}


variable "sentry_token" {
  type = string
}
