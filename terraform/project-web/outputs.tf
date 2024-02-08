output "sentry_dsn" {
  value = data.sentry_key.default.dsn_public
}
