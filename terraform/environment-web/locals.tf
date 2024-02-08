locals {
  name            = "auth-web"
  prefix          = "${data.terraform_remote_state.global.outputs.global_resource_prefix}${data.terraform_remote_state.global.outputs.global_prefix}${module.environment.resource_name_prefix}-"
  domain          = module.environment.sub_domain == "" ? data.terraform_remote_state.global.outputs.domain_name : "${module.environment.sub_domain}.${data.terraform_remote_state.global.outputs.domain_name}"
  ecs_cluster_key = var.ecs_cluster_key == "" ? module.environment.branch_name : var.ecs_cluster_key
}
