/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'
import { Provider } from 'mobx-react'
import { SheetsRegistry } from 'react-jss/lib/jss'
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { jssPreset } from '@material-ui/core/styles'
import jssNested from 'jss-nested'
import { MuiThemeProvider } from '@material-ui/core/styles'
import createGenerateClassName from './utils/createGenerateClassName'

// Convert mobx-state-tree model to json and escape <\ in a closing script tag to avoid untimely script closing.
const getSanitizedModelJson = state => sanitizeJsonForScript(state.toJSON())

// Escape <\ in a closing script tag to avoid untimely script closing
const sanitizeJsonForScript = state => JSON.stringify(state).replace(/<\/script/gi, '<\\/script')

/**
 * Get javascript asset filename by chunk name
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
      return stats.assetsByChunkName[key]
    })
}

/**
 * Render HTML of given component
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
 * @param  {options} options
 * @param  {Object} options.stats   Webpack generated stats
 * @param  {String} options.chunk   Chunk name
 * @param  {Boolean} options.defer  Should defer execution
 * @return {String}                 Script HTML
 */
export function renderScript({ stats, chunk, defer }) {
  const assetPathBase = process.env.ASSET_PATH_BASE || ''

  return getSources(stats, chunk)
    .map(
      src =>
        `<script type="text/javascript" ${
          defer ? 'defer' : ''
          } src="${assetPathBase}/pwa/${src}"></script>`
    )
    .join('')
}

/**
 * Renders extracted CSS from Sheets Registry
 * @param  {options} options
 * @param  {Object} options.registry  JSS Sheets Registry
 * @param  {String} options.id        ID for style tag
 * @return {String}                   Style HTML
 */
export function renderStyle({ registry, id = 'ssr-css' }) {
  return `<style id="${id}">${registry.toString()}</style>`
}

/**
 * Helper for extracting location object from Adapt environment
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
export function render({
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
    style: renderStyle({ registry }),
    initialStateScript: renderInitialStateScript({ state, defer: false, initialStateProperty }),
    bootstrapScript: renderScript({ stats, chunk: 'bootstrap' }),
    componentScript: renderScript({ stats, chunk: clientChunk })
  }

  if (injectAssets) {
    $head.append(result.style)
    $body.append(result.initialStateScript)
    $body.append(result.bootstrapScript)
    $body.append(result.componentScript)
  }

  return result
}

/**
 * Hydrates React component
 * @param  {options} options
 * @param  {React.Component} options.component    Component to be rendered
 * @param  {Model} options.model                  MobX Model
 * @param  {Object} options.theme                 MUI Theme
 * @param  {String} options.target                Selector for rendering target
 * @param  {String} options.providerProps         Props to add the to <Provider/> element
 * @param  {String} options.initialStateProperty  Optional window property name for initial state
 * @return {Object} The app state
 */
export function hydrate({
                          component,
                          model,
                          theme,
                          target,
                          providerProps = {},
                          initialStateProperty = 'initialState',
                          cssPrefix = 'jss'
                        }) {
  const generateClassName = createGenerateClassName()
  const state = model.create(window[initialStateProperty] || {})
  const jss = create(jssPreset(), jssNested())

  window.moov = window.moov || {}
  Object.assign(window.moov, { state, timing: {} }, providerProps)

  // skip jss insertion if we are hydrating SSR cached by the service worker because it has already been mounted
  if (!document.body.hasAttribute('data-jss-inserted')) {
    const styleNode = document.createComment('jss-insertion-point')
    document.head.insertBefore(styleNode, document.head.firstChild)
    jss.options.insertionPoint = 'jss-insertion-point'
    document.body.setAttribute('data-jss-inserted', 'on')
  }

  ReactDOM.hydrate(
    <Provider app={state} {...providerProps}>
      <JssProvider classNamePrefix={cssPrefix} jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>{component}</MuiThemeProvider>
      </JssProvider>
    </Provider>,
    target,
    removeSSRStyles
  )

  return state
}

/**
 * Removes the style tag rendered on the server so that components are styled correctly
 * after hydration.
 */
function removeSSRStyles() {
  const jssStyles = document.getElementById('ssr-css')

  if (jssStyles && jssStyles.parentNode) {
    jssStyles.parentNode.removeChild(jssStyles)
  }
}
