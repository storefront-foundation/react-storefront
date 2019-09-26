/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'mobx-react'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider } from '@material-ui/core/styles'
import createGenerateClassName from './utils/createGenerateClassName'
import minifyStyles from './utils/minifyStyles'

// Convert mobx-state-tree model to json and escape <\ in a closing script tag to avoid untimely script closing.
const getSanitizedModelJson = state => sanitizeJsonForScript(state.toJSON())

// Escape <\ in a closing script tag to avoid untimely script closing
const sanitizeJsonForScript = state =>
  JSON.stringify(state || {}).replace(/<\/script/gi, '<\\/script')

/**
 * Get javascript asset filename by chunk name
 * @private
 * @param  {Object} stats Webpack generated stats
 * @param  {String} chunk Chunk name
 * @return {String}       Asset filename
 */
export function getJS(stats, chunk) {
  let assets = stats.assetsByChunkName[chunk]
  if (!assets) {
    return null
  } else if (Array.isArray(assets)) {
    return assets.find(file => file.endsWith('.js'))
  } else {
    return assets
  }
}

/**
 * Gets all source paths for the given chunk
 * @private
 * @param  {Object} stats Webpack generated stats
 * @param  {String} chunk Chunk name
 * @return {String[]}
 */
function getSources(stats, chunk) {
  return Object.keys(stats.assetsByChunkName)
    .filter(key => {
      // render any that have `chunk` in the name, split by ~
      // when webpack sees two or more chunks that share some vendor libs, it can decide
      // to create a separate chunk just for the libs those two chunks share.
      // for example: vendors~component-Component~guide-Guide
      return key.split('~').some(page => page === chunk)
    })
    .map(key => {
      const assets = stats.assetsByChunkName[key]

      if (Array.isArray(assets)) {
        // we'll get an array when building with source maps, in that case pick the JS file, not the map
        return stats.assetsByChunkName[key].find(file => !file.match(/\.map$/))
      } else {
        // otherwise the value will be the JS file
        return assets
      }
    })
}

/**
 * Render HTML of given component
 * @private
 * @param  {options} options
 * @param  {React.Component} options.component Component to be rendered
 * @param  {Object} options.providers          Data providers
 * @param  {Object} options.registry           JSS Sheets Registry
 * @param  {Object} options.theme              MUI Theme
 * @param  {Object} options.cssPrefix          A prefix to apply to css classes
 * @return {String}                            HTML
 */
export function renderHtml({ component, providers, registry, theme, cssPrefix = 'jss' }) {
  return renderToString(
    <Provider {...providers}>
      <JssProvider
        classNamePrefix={cssPrefix}
        registry={registry}
        generateClassName={createGenerateClassName()}
      >
        <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
          {component}
        </MuiThemeProvider>
      </JssProvider>
    </Provider>
  )
}

/**
 * Renders initial state for client side hydration
 * @private
 * @param  {options} options                      Model instance
 * @param  {Object} options.state                 The initial app state needed for hydration
 * @param  {Object} options.routeData             The data that resulted from the route being run.  This is needed for creating a cache
 *                                                entry for the equivalend .json request if the user navigates back to this page.
 * @param  {Boolean} options.defer                Should defer execution
 * @param  {String} options.initialStateProperty  Property name on window object
 * @return {String}                               Script HTML
 */
export function renderInitialStateScript({
  state,
  routeData,
  defer,
  initialStateProperty = 'initialState',
  initialRouteDataProperty = 'initialRouteData'
}) {
  return `<script type="text/javascript" ${defer ? 'defer' : ''}>
    window.${initialStateProperty}=Object.freeze(${getSanitizedModelJson(state)})
    window.${initialRouteDataProperty}=Object.freeze(${sanitizeJsonForScript(routeData)})
	</script>`
}

/**
 * Renders script for a specified chunk
 * @private
 * @param  {String} src             Source of script
 * @param  {Boolean} defer          Should defer execution
 * @return {String}                 Script HTML
 */
export function renderScript(src, defer) {
  return `<script type="text/javascript" ${defer ? 'defer' : ''} src="${src}"></script>`
}

/**
 * Renders extracted CSS from Sheets Registry
 * @private
 * @param  {options} options
 * @param  {Object} options.registry  JSS Sheets Registry
 * @param  {String} options.id        ID for style tag
 * @return {String}                   Style HTML
 */
export async function renderStyle({ registry, id = 'ssr-css' }) {
  let css = registry.toString()

  // css might be undefined, e.g. after an error.
  if (css) {
    css = await minifyStyles(css)
  }

  return `<style id="${id}">${css}</style>`
}

/**
 * Extracts scripts from sources in chunk
 * @private
 * @param {Object} options
 * @param {Object} options.stats    Webpack generated stats
 * @param {String} options.chunk     Chunk name
 */
export function getScripts({ stats, chunk }) {
  const assetPathBase = process.env.ASSET_PATH_BASE || ''
  return getSources(stats, chunk).map(src => `${assetPathBase}/pwa/${src}`)
}

/**
 * Renders a link prefetch header value
 * @private
 * @param {String} src Source of script
 */
export function renderPreloadHeader(src) {
  return `<${src}>; rel=preload; as=script`
}

/**
 * Helper for extracting location object from Adapt environment
 * @private
 * @param  {Object} env Adapt Environment
 * @return {Object}     Location Object
 */
function getLocation(env) {
  const [pathname, search] = env.path.split('?')
  return {
    protocol: env.secure ? 'https' : 'http',
    hostname: env.host,
    pathname,
    search: search || ''
  }
}

/**
 * Renders a component on the server.
 * @private
 * @param  {options} options
 * @param  {React.Component} options.component    Component to be rendered
 * @param  {Object} options.state                 Model instance
 * @param  {Object} options.theme                 MUI Theme
 * @param  {Object} options.stats                 Webpack generated stats
 * @param  {String} options.clientChunk           Chunk name for hydration script
 * @param  {String} options.initialStateProperty  Optional window property name for initial state
 * @param  {Boolean} options.injectAssets          Defaults to true.  Set this to false to prevent scripts and css from automatically being injected into the document.
 * @param  {String} options.cssPrefix            A prefix to apply to css class names
 * @return {Object}                               Components for SSR
 */
export async function render({
  component,
  state,
  theme,
  stats,
  clientChunk,
  initialStateProperty,
  injectAssets = true,
  cssPrefix
}) {
  const registry = new SheetsRegistry()

  state.applyState({ location: getLocation(env) }, 'REPLACE')

  const html = renderHtml({
    component,
    providers: { app: state },
    registry,
    theme,
    cssPrefix
  })

  const result = {
    html,
    style: await renderStyle({ registry }),
    initialStateScript: renderInitialStateScript({ state, defer: false, initialStateProperty }),
    componentScript: getScripts({ stats, chunk: clientChunk }).map(renderScript)
  }

  if (injectAssets) {
    $head.append(result.style)
    $body.append(result.initialStateScript)
    $body.append(...result.componentScript)
  }

  return result
}
