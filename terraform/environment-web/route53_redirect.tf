data "aws_lb_listener" "main" {
  arn = data.terraform_remote_state.global.outputs.main_tls_lb_listener_arn
}

data "aws_lb" "main" {
  arn = data.aws_lb_listener.main.load_balancer_arn
}

module "auth_host" {
  source      = "git@github.com:abs-safety/terraform-modules.git//modules/host_entry?ref=v0.0.21"
  domain_name = data.terraform_remote_state.global.outputs.domain_name
  host_name   = "auth.${local.domain}"
  cert_name   = "${local.prefix}${local.name}"
  alias = {
    name    = data.aws_lb.main.dns_name
    zone_id = data.aws_lb.main.zone_id
  }
}

resource "aws_lb_listener_certificate" "auth_cert" {
  listener_arn    = data.aws_lb_listener.main.arn
  certificate_arn = module.auth_host.aws_acm_certificate_arn
}

resource "aws_lb_listener_rule" "redirect_auth_to_hub" {
  listener_arn = data.terraform_remote_state.global.outputs.main_tls_lb_listener_arn

  action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
      host        = "hub.${local.domain}"
      path        = "/#{path}"
      query       = "#{query}"
    }
  }

  condition {
    host_header {
      values = ["auth.${local.domain}"]
    }
  }
}
