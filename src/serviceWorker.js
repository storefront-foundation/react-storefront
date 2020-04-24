/**
 * Resolves when the service worker has been installed.
 * @private
 */
export function waitForServiceWorker() {
  if (!navigator.serviceWorker || !navigator.serviceWorker.ready) {
    return false
  }

  return new Promise(resolve => {
    navigator.serviceWorker.ready.then(() => {
      if (navigator.serviceWorker.controller) {
        return resolve(true)
      }
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        return resolve(true)
      })
    })
  })
}
