/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import _isString from 'lodash/isString'
import _isEmpty from 'lodash/isEmpty'
import _forEach from 'lodash/forEach'
import _map from 'lodash/map'

/**
 * Rules found in MPS. Only bidirectional is used.
 */
const RewriteRule_BIDIRECTIONAL = 0
const RewriteRule_PROXY_TO_UPSTREAM = 1 // eslint-disable-line no-unused-vars
const RewriteRule_UPSTREAM_TO_PROXY = 2 // eslint-disable-line no-unused-vars

/**
 * Naively converts host map as codified in project configuration and converts it into an array
 * of routing rules objects that are usable by Moovweb code running inside user slug
 * (e.g. rewriter)
 *
 * Notes:
 * - Ported from golang in manhattan/project/project.go file, convertHostMapToSdkRoutingRules function.
 * - Cookie domain is proxy domain minus the template part.
 *
 * @param {Array} hostMap Array of strings in "<origin> => <upstream>" format as codified in project configuration
 */
export function convertHostMapToSlugRoutingRules(hostMap) {
  const routingRules = []

  const hostRoutingRules = convertHostMapToHostRoutingRules(hostMap)

  _forEach(hostRoutingRules, ({ proxy, upstream }) => {
    ;['http', 'https'].forEach(protocol => {
      routingRules.push({
        Proxy: `${protocol}://${proxy}`,
        Upstream: `${protocol}://${upstream}`,
        Direction: RewriteRule_BIDIRECTIONAL,
        Cookiedomain: proxy.replace('$.', '')
      })
    })
  })

  return routingRules
}

/**
 * Converts host map as codified in project configuration and converts it into an array
 * of host routing rules.
 *
 * Notes:
 * - Ported from golang in manhattan/project/project.go file, convertHostMapToHostRoutingRules function.
 *
 * @param {Array} hostMap Array of strings in "<origin> => <upstream>" format as codified in project configuration
 */
export function convertHostMapToHostRoutingRules(hostMap) {
  return _map(hostMap, mapping => {
    if (_isString(mapping)) {
      throw new Error('Host mapping must be a string')
    }

    if (mapping.indexOf('=>') < 0) {
      throw new Error('Only supported host mapping is =>')
    }

    const [downstreamMapping, upstreamMapping] = _map(mapping.split('=>'), str => str.trim())
    if (_isEmpty(downstreamMapping) || _isEmpty(upstreamMapping)) {
      throw new Error('Host mapping downstream and upstream must be a non-empty string')
    }

    return {
      proxy: downstreamMapping,
      upstream: upstreamMapping
    }
  })
}
