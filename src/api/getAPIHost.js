/**
 * Resolves the host to use when making server-side API requests.
 *
 * The host must never be taken from the untrusted `Host` request header without
 * validation, otherwise an attacker can redirect the credentialed server-side
 * fetch to an arbitrary host (SSRF), poison shared caches, and leak the
 * forwarded `cookie` header. See fetchServerSideProps / fetchFromAPI.
 *
 * Resolution order:
 *   1. process.env.API_HOST, when configured, is always trusted.
 *   2. Otherwise the incoming request's `Host` header is used, but only when it
 *      matches the process.env.ALLOWED_HOSTS allowlist (a comma separated list
 *      of host names). When an allowlist is configured and the header is not in
 *      it, an error is thrown so no request is sent to the attacker host.
 *   3. When no allowlist is configured the header is returned unchanged to
 *      preserve local and development behavior. Production deployments should
 *      always set API_HOST or ALLOWED_HOSTS.
 *
 * @param {Object} req The incoming request
 * @return {String} The validated host
 */
export default function getAPIHost(req) {
  if (process.env.API_HOST) {
    return process.env.API_HOST
  }

  const host = req && req.headers && req.headers.host

  const allowlist = (process.env.ALLOWED_HOSTS || '')
    .split(',')
    .map(entry => entry.trim().toLowerCase())
    .filter(Boolean)

  if (allowlist.length > 0 && !allowlist.includes(String(host).toLowerCase())) {
    throw new Error('getAPIHost: the request Host header is not in ALLOWED_HOSTS')
  }

  return host
}
