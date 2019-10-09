/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.
import { removeOldCaches } from './router/serviceWorker'
import { isSafari } from './utils/browser'

if (!window.moov) {
  window.moov = {}
}

// The service worker derives the cache name from this, which is sent as the x-moov-api-version
// request header in router/fromServer
window.moov.apiVersion = global.__build_timestamp__ || ''

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

/**
 * Returns true if this is a private window in safari
 * From https://stackoverflow.com/questions/12821127/how-to-check-if-ios-is-using-private-browsing/47642304#47642304
 */
function isSafariPrivateWindow() {
  if (!isSafari()) return false

  try {
    window.openDatabase(null, null, null, null)
    return false
  } catch (_) {
    return true
  }
}

export default function register() {
  if (isSafariPrivateWindow()) {
    // Private windows in safari have a known bug with sending cookies
    // in POST requests.  This often breaks cart and checkout, so we choose
    // not to use service workers at all when in safari private windows.
    // See the bug report here: https://bugs.webkit.org/show_bug.cgi?id=186617
    console.log('skipping service worker in Safari private window')
    unregister()
    return
  }

  const installSW = process.env.NODE_ENV === 'production' || process.env.MOOV_SW === 'true'

  if (installSW && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      const swUrl = getServiceWorkerURL()

      if (isLocalhost) {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl)
      } else {
        // Is not local host. Just register service worker
        registerValidSW(swUrl)
      }
    })
  }
}

/**
 * Gets the query string to append to the service worker URL based on the current mode being served.
 * This ensures that the service worker is fetched from the same mode as the app was service from
 * when running an A/B test.
 * @private
 */
function getModeQueryString() {
  const { mode } = window.moov.state

  if (mode) {
    return `?moov_fetch_from=${encodeURIComponent(mode.id)}`
  } else {
    return ''
  }
}

/**
 * Creates the url for the service worker
 */
export function getServiceWorkerURL() {
  return `${process.env.PUBLIC_URL || ''}/service-worker.js${getModeQueryString()}`
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      removeOldCaches()

      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              document.dispatchEvent(new CustomEvent('moov-update-available'))
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.')
            }
          }
        }
      }
    })
    .catch(error => {
      console.error('Error during service worker registration:', error)
    })
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (response.status === 404) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl)
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.')
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}
