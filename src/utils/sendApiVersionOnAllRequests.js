/**
 * Here we send an rsf-api-version header whose value is the timestamp of the build
 * with all requests so that the service worker can make sure it only returns a cached
 * result from the same version of the application that is currently running.
 */
export default function sendApiVersionOnAllRequests() {
  if (typeof XMLHttpRequest !== 'undefined') {
    const open = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function() {
      const res = open.apply(this, arguments)

      this.setRequestHeader('x-rsf-api-version', process.env.RSF_API_VERSION || '1')

      return res
    }
  }
}
