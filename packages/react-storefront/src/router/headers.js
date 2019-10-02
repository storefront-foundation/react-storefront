/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * Response header which designates an surrogate key by which the response can be
 * flushed from edge caches.
 *
 * Value: a string, defaults to the handler path but can be set by the user.
 */
export const SURROGATE_KEY = 'x-moov-surrogate-key'

/**
 * Response header containing the path to the handler as written in `fromServer`
 *
 * Value: a string like './home/home-handler'
 */
export const HANDLER = 'x-rsf-handler'

/**
 * Response header that indicates whether the response was "static", "json", "ssr", or "proxy".
 * Used to gather metrics for different response types.
 *
 * Value: "static", "json", "ssr", or "proxy"
 */
export const RESPONSE_TYPE = 'x-rsf-response-type'

/**
 * Response header used by the service worker to ensure that responses are only served from the
 * cache  corresponding to the current running version of the app.
 *
 * Value: a webpack hash
 */
export const API_VERSION = 'x-moov-api-version'

/**
 * Response header whose presence indicates that the request was
 * served by react-storefront.
 *
 * Value: true
 */
export const REACT_STOREFRONT = 'x-react-storefront'

/**
 * Request header sent from the outer edge to indicate that the app is running
 * behind an outer edge.
 *
 * Value: a semver value.
 */
export const XDN_VERSION = 'x-moov-xdn-version'

/**
 * Request header that when present will make RSF return a JSON summary of the routes.
 */
export const ROUTES = 'x-rsf-routes'

/**
 * Instructs the service worker to only return a response if a match is found in the cache.
 */
export const CLIENT_IF = 'x-moov-client-if'

export default null
