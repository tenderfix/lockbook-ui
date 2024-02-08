resource "sentry_project" "default" {
  name         = "lock-book-auth-web"
  organization = data.terraform_remote_state.global.outputs.sentry_organization
  platform     = "javascript-react"
  slug         = "lock-book-auth-web"
  teams        = [data.terraform_remote_state.global.outputs.sentry_team]
}

data "sentry_key" "default" {
  organization = data.terraform_remote_state.global.outputs.sentry_organization
  project      = sentry_project.default.slug
  name         = "Default"
}
