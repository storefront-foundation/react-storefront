import delegate from 'delegate'
import { useEffect, useRef, useCallback } from 'react'
import Router from 'next/router'
import qs from 'qs'
import fetch from '../fetch'
import getAPIURL from '../api/getAPIURL'

/**
 * @private
 * Watches for clicks on HTML anchor tags and performs client side navigation if
 * the URL matches a next route.
 */
export default function useSimpleNavigation() {
  const routes = useRef({})
  const nextNavigation = useRef(false)

  const onNextNavigation = useCallback(() => {
    nextNavigation.current = true
  }, [])

  const onNextNavigationEnd = useCallback(() => {
    nextNavigation.current = false
  }, [])

  useEffect(() => {
    async function doEffect() {
      delegate('a', 'click', e => {
        const { delegateTarget } = e
        const as = delegateTarget.getAttribute('href')
        const href = getRoute(as, routes.current)

        // catch if not next link
        if (href && !nextNavigation.current) {
          e.preventDefault()
          const url = toNextURL(href, as)
          Router.push(url, as)
        }
      })

      routes.current = await fetchRouteManifest()
    }

    doEffect()
    Router.events.on('routeChangeStart', onNextNavigation)
    Router.events.on('routeChangeComplete', onNextNavigationEnd)

    return () => Router.events.off('routeChangeStart', onNextNavigation)
  }, [])
}

function toNextURL(href, as) {
  const url = new URL(as, `${window.location.protocol}//${window.location.hostname}`)

  return {
    pathname: href,
    query: qs.parse(url.search, { ignoreQueryPrefix: true }),
  }
}

function fetchRouteManifest() {
  return fetch(getAPIURL('/routes')).then(res => res.json())
}

function getRoute(href, routes) {
  for (const pattern in routes) {
    if (new RegExp(pattern, 'i').test(href)) {
      return routes[pattern].as
    }
  }

  return null
}
