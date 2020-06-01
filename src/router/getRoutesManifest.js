import { getRouteRegex } from 'next/dist/next-server/lib/router/utils/route-regex'

/**
 * Returns an object containing all of the Next.js routes. Keys are regexes that can
 * be used to test if a URL matches a route.
 */
export default function getRoutesManifest() {
  if (typeof window !== 'undefined') return null

  const req = eval('require')
  const path = req('path')

  // Depending on the context (local dev, serverless lambda), the page manifest
  // file can be at different locations
  const MANIFEST_PATHS = [
    path.join(process.cwd(), '.next', '.serverless', 'pages-manifest.json'),
    path.join(process.cwd(), '.next', 'server', 'pages-manifest.json'),
    path.join(process.cwd(), 'pages-manifest.json'),
  ]

  let pagesManifest

  for (let manifestPath of MANIFEST_PATHS) {
    try {
      pagesManifest = req(manifestPath)
    } catch (e) {
      // try the next path
    }
  }

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
