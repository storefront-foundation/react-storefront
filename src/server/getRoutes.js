const pathToRegexp = require('path-to-regexp')

export default function routes(pagesManifest) {
  const routes = {}

  for (let as in pagesManifest) {
    const component = pagesManifest[as]
    const route = pathToRegexp(as.replace(/\[([^\]]+)\]/g, ':$1')).source
    routes[route] = {
      component,
      as,
    }
  }

  return routes
}
