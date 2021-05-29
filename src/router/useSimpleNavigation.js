import delegate from 'delegate'
import fetch from '../fetch'
import { useEffect, useRef, useCallback } from 'react'
import Router from 'next/router'
import qs from 'qs'
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
        const isNativeOverride = delegateTarget.hasAttribute('data-native')
        const href = getRoute(as, routes.current)

        // catch if not native override or next link
        if (!isNativeOverride && href && !nextNavigation.current) {
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
  const url = new URL(as, window.location.protocol + '//' + window.location.hostname)

  return {
    pathname: href,
    query: qs.parse(url.search, { ignoreQueryPrefix: true }),
  }
}

function fetchRouteManifest() {
  return fetch(getAPIURL('/routes')).then(res => res.json())
}

function getRoute(href, routes) {
  const matches = [];

  for (let pattern in routes) {
    if (new RegExp(pattern, 'i').test(href)) {
      matches.push(routes[pattern].as)
    }
  }

  // matches all occurrences of `...`, `[`, `]`, and `/` 
  const specificityWeightPattern = new RegExp(/\.{3}|\[|\/|\]/g);

  // sorts the matches by specificity weight descending
  const prioritizedMatches = matches.sort((a, b) => {
    const aWeight = (a.match(specificityWeightPattern) || []).length;
    const bWeight = (b.match(specificityWeightPattern) || []).length;
    return aWeight > bWeight ? 1 : -1
  });

  // return the route with the most specificity, similar to Next.js route matching
  return prioritizedMatches[0] || null;
}
