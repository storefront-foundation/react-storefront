import { getAPICacheName } from './cache'

const isApiRequest = path => !!path.match(/^\/api\//)
const appShellPath = '/.app-shell'

/**
 * Returns the app shell for html requests.
 * Returns { page: 'offline' } for api requests.
 */
export function offlineResponse(apiVersion, context) {
  if (isApiRequest(context.url.pathname)) {
    const offlineData = { page: 'Offline' }
    const blob = new Blob([JSON.stringify(offlineData, null, 2)], {
      type: 'application/json',
    })
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Length': blob.size,
      },
    })
  } else {
    // If not API request, find and send app shell
    const cacheName = getAPICacheName(apiVersion)
    const req = new Request(appShellPath)
    return caches.open(cacheName).then(cache => cache.match(req))
  }
}
