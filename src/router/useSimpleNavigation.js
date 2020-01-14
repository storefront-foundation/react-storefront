import delegate from 'delegate'
import fetch from 'isomorphic-unfetch'
import { useEffect, useRef } from 'react'
import Router from 'next/router'
import qs from 'qs'

/**
 * @private
 * Watches for clicks on HTML anchor tags and performs client side navigation if
 * the URL matches a next route.
 */
export default function useSimpleNavigation() {
  const routes = useRef({})

  useEffect(() => {
    async function doEffect() {
      delegate('a', 'click', e => {
        const { delegateTarget } = e
        const as = delegateTarget.getAttribute('href')
        const href = getRoute(as, routes.current)

        if (href) {
          e.preventDefault()
          const url = toNextURL(href)
          // temporarily disabled as this was causing double fetching of props
          // Router.push(url, as)
        }
      })

      routes.current = await fetchRouteManifest()
    }

    doEffect()
  }, [])
}

function toNextURL(href) {
  const url = new URL(href, window.location.protocol + window.location.hostname)

  return {
    pathname: url.pathname,
    query: qs.parse(url.search),
  }
}

function fetchRouteManifest() {
  return fetch('/api/routes').then(res => res.json())
}

function getRoute(href, routes) {
  for (let pattern in routes) {
    if (new RegExp(pattern).test(href)) {
      return routes[pattern].as
    }
  }

  return null
}
