export default function routeMetaDataHandler(router) {
  const routes = {}

  for (let route of router.routes) {
    if (!route.declaredPath.startsWith('/.')) {
      const cache = route.handlers.find(route => route.type === 'cache')
      const fromServer = route.handlers.find(route => route.type === 'fromServer')

      if (fromServer) {
        routes[route.declaredPath] = {
          surrogateKey: cache ? cache.getSurrogateKey(route) : null,
          handler: fromServer.path
        }
      }
    }
  }

  return routes
}
