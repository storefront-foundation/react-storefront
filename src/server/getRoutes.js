import { getRouteRegex } from 'next/dist/next-server/lib/router/utils/route-regex'

export default function routes(pagesManifest) {
  const routes = {}

  for (let as in pagesManifest) {
    const component = pagesManifest[as]
    const route = getRouteRegex(as).re.source

    routes[route] = {
      component,
      as,
    }
  }

  return routes
}
